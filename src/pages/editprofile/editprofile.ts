import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
declare var cordova: any;

/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {

  private win: any = window;
  lastImage: any;
  public imageId='../../assets/images/avatar.png';
  public data = [];
  API_URL = "http://ec2-18-225-10-142.us-east-2.compute.amazonaws.com:5450";
  public userId:any;
  public profiledata=[];
  profileImage: string;
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera, 
    private transfer: FileTransfer, 
    private file: File, 
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private crop: Crop,
    public actionSheetCtrl: ActionSheetController,
    private DomSanitizer: DomSanitizer,
    public loginsignupProvider:LoginsignupProvider,
    public alert:AlertController
    ) {

      this.userId = localStorage.getItem("userId");
      console.log(this.userId);
      if(this.userId){
        this.getprofiledata();
        
      }
  }

  ionViewDidLoad() {
    //creating url for profile pic
    // this.imageId = this.API_URL+"/file/getImage?imageId=" + this.profileImage;

    console.log('ionViewDidLoad EditprofilePage');
  }

  ionViewDidEnter(){
    this.userId = localStorage.getItem("userId");
    console.log(this.userId);
    if(this.userId){
      this.getprofiledata();
    }
    // console.log("get profile image------->>>>");
    // this.imageId = this.API_URL+"/file/getImage?imageId=" + this.profileImage;//creating url for profile pic

  }


  /**
   * @desc Action sheet to select camera/gallery option to choose profile pic
   *
   */
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
            console.log("open camera:")
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

   /**
   * @desc capture data from device and set filepath
   * @param sourceType
   * @returns @string filepath in device
   */
  public takePicture(sourceType)
  {
    let _base = this;

    // Create options for the Camera Dialog
    var options =
      {
        sourceType: sourceType,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

       // Get the data of an image...
    this.camera.getPicture(options).then((imagePath) => {
      console.log("imagePath trace.........." + imagePath);

      //Crop function to crop the image...
      this.crop.crop(imagePath,{
        quality: 100,
        targetWidth:160,
        targetHeight:160,
        }).then(function(success:any){
          console.log("here is the success image ..."+success);
          imagePath=success;
          console.log("check image path......"+imagePath);
          _base.imageId = imagePath;
          console.log("check image source type............");
          console.log(sourceType);

      // Speacial handleing for Android platform...
      if (_base.platform.is('android') || sourceType == options.sourceType.PHOTOLIBRARY)
      {
        console.log("selected from library.......");

        _base.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            _base.copyFileToLocalDir(correctPath, currentName, _base.createFileName());
          });
      }
      else {
        var currentName =imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        _base.copyFileToLocalDir(correctPath, currentName, _base.createFileName());
      }

    },
      (err) => {
        this.presentToast('Error while selecting image.');
      });

    },function(error){
      return error;
    })
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  /**
   * @desc Copy the image to a local folder in case user deletes the image
   */
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      console.log("image file trace ................>>>");
      console.log(this.file);
      console.log(newFileName);
      console.log(cordova.file.dataDirectory);
      console.log(namePath);
      console.log(currentName);
      this.lastImage = newFileName;
      if (this.lastImage){
        this.uploadImage();
      }
      // this.getTrustImg(this.lastImage);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  getTrustImg(imgsrc){
    let path = this.win.Ionic.WebView.convertFileSrc(imgsrc);
console.log(path);
return path;
  }
  
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    }
    else {
      return cordova.file.dataDirectory + img;
    }
  }

   /**
   * @desc If image then upload and update other details
   * otherwise only update
   *
   */
  public uploadImage() {

    if (this.lastImage) {
      // Destination URL
      // var url = "https://memeapi.memeinfotech.com/file/fileUpload";
      var url = this.API_URL+"/file/upload";

      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);


      const fileTransfer: FileTransferObject = this.transfer.create();
      let loader = this.loadingCtrl.create({
        content: "Uploading..."
      });
      loader.present();

      var filename = this.lastImage;

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "image/jpeg",
        params: { 'fileName': filename }
      };
      console.log("click in upload image .....");
      fileTransfer.upload(targetPath, url, options).then(data => {

        console.log("image upload trace.......");
        var temp: any;
        temp = data;
        console.log(temp);
        this.profileImage = JSON.parse(temp.response).upload._id;
        console.log("profile image"+this.profileImage);

        if(this.profileImage){
          this.imageId = this.API_URL+"/file/getImage?imageId=" + this.profileImage;//creating url for profile pic
          console.log(this.imageId);
        }
       
        // console.log(temp.imageId._id);

        loader.dismiss();
        this.presentToast('Image succesful uploaded.');
        // this.update();//update after image uploaded successfully

      },
        err => {
          loader.dismiss();
          this.presentToast('Error while uploading file.' + err);
          console.log("Error in image upload function...." + err);
        });
    }
    else {
      // this.update();
    }
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1000,
      position: 'top'
    });

    toast.present();
  }

  //check permissions....
  // checkpermissions(){
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
  //     result => console.log('Has permission?',result.hasPermission),
  //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
  //   );
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
  //     result => console.log('Has permission?',result.hasPermission),
  //   );
  // }

   //Get profile data...
   getprofiledata(){
    let _base = this;
    this.loginsignupProvider.getProfile(this.userId).then(function(success:any){
      console.log(success);
        _base.profiledata = success.result;
        if(success.result.imageId){
          _base.imageId = _base.API_URL+"/file/getImage?imageId="+success.result.imageId._id;
        }
    },function(err){
      console.log(err);
    })
  }
  updateProfile()
  {
    let _base = this;
    // let data = {
    //   name:_base.profiledata.name,
    //   website:_base.profiledata.website,
    //   city:_base.profiledata.city,
    //   address:_base.profiledata.address,
    //   zip:_base.profiledata.zip,
    //   country:_base.profiledata.country,
    //   imageId:_base.profileImage,
    //   milage_prefrence:"mile"
    // }
    Object.assign(_base.profiledata,{imageId:_base.profileImage});
    console.log(_base.profiledata);
    this.loginsignupProvider.profileUpdate(_base.profiledata).then(function(success:any){
      console.log(success);
      _base.presentAlert();
      _base.navCtrl.pop();
    },function(err){
      console.log(err);
    })
  }
  back(){
    this.navCtrl.pop()
  }
  presentAlert() {

    let alert = this.alert.create({
      title: 'Data has been saved',
      // subTitle: 'Milage Saved',
      cssClass:'mycss',
      buttons: [
        {
          text: 'OK',
          handler: data => {
          }
        }
      ]
    });
    alert.present();
  }
}
