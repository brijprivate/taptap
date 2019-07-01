import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Geolocation } from '@ionic-native/geolocation';

declare var cordova: any;
declare var google

/**
 * Generated class for the DevicededetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-devicededetail',
  templateUrl: 'devicededetail.html',
})
export class DevicededetailPage {

  public devicedetail:any=[];
  public lostmessage:any;
  public lost:boolean=false;
  islost:boolean=true;
  lastImage: any;
  public imageId: any;
  profileImage: string;
  API_URL = "http://ec2-18-225-10-142.us-east-2.compute.amazonaws.com:5450";
  


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfctagProvider:NfctagProvider,
    private camera: Camera, 
    private transfer: FileTransfer, 
    private file: File, 
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private crop: Crop,
    public actionSheetCtrl: ActionSheetController,
    public alert:AlertController,
    private GoogleAutocomplete: Geolocation,
    public zone: NgZone) 
    {
      this.devicedetail = navParams.get("devicedetail");
      console.log(this.devicedetail);
      console.log(this.lost);
     
  }

  ionViewDidLoad() {
    if(this.devicedetail.imageId){
      this.imageId = this.API_URL+"/file/getImage?imageId=" + this.devicedetail.imageId._id;//creating url for profile pic

    }

    console.log('ionViewDidLoad DevicededetailPage');
  }

  // notify(){
  //   console.log(this.lost);
  // }

  updatedetail(){
    let _base = this;
    let ddata = {
      deviceId:this.devicedetail._id,
      device_title:this.devicedetail.device_title,
      
      imageId:this.profileImage,
      contact_info:{
        email:this.devicedetail.contact_info.email,
        name:this.devicedetail.contact_info.name,
        address:this.devicedetail.address,
        phoneNumber:this.devicedetail.contact_info.phoneNumber,
        mobileNumber:this.devicedetail.contact_info.mobileNumber,
        company_name:this.devicedetail.contact_info.company_name,
        website:this.devicedetail.contact_info.website
      }
    }
    console.log(ddata);
    this.nfctagProvider.updateDeviceName(ddata).then(function(success){
      console.log(success);
      _base.presentAlert();
    },function(err){
      console.log(err);
    })
  }

   //mark as lost...
   notify(id){
    let _base = this;
    let data = {
      deviceId:id,
      is_lost:this.lost
    }
    console.log(this.lost);
    this.nfctagProvider.updateDeviceName(data).then(function(success:any){
      console.log(success);
      // _base.getpairedDevice();
    },function(err){
      console.log(err);
    })
  }
  notifyy(id){
    let _base = this;
    let data = {
      deviceId:id,
      is_lost:this.islost
    }
    console.log(this.islost);
    this.nfctagProvider.updateDeviceName(data).then(function(success:any){
      console.log(success);
      // _base.getpairedDevice();
    },function(err){
      console.log(err);
    })
  }
  back(){
    this.navCtrl.pop();
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

  presentAlert() {
    let alert = this.alert.create({
      title: 'Data has been saved',
     
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

  // updateSearchResults(inp){

  //   console.log("clicked0------------", inp);
  //   if (this.devicedetail.address == '') {
  //     this.autocompleteItems = [];
  //     return;
  //   }
  //   this.googleAutocomplete.getPlacePredictions({ input: inp },
  //   (predictions, status) => {
  //     this.autocompleteItems = [];
  //     this.zone.run(() => {
  //       predictions.forEach((prediction) => {
  //         this.autocompleteItems.push(prediction);
  //         console.log(prediction);
  //       });
  //     });
  //   });
  // }

   //To add the full address through autocomplete search
  //  initmap() {

  //   var defaultBounds = new google.maps.LatLngBounds
  //     (
  //     new google.maps.LatLng(-33.8902, 151.1759),
  //     new google.maps.LatLng(-33.8474, 151.2631));

  //   var input = (<HTMLInputElement>document.getElementById('pac-input'));


  //   var options =
  //     {
  //       bounds: defaultBounds
       
  //     };
  //   console.log("working");

  //   let autocomplete = new google.maps.places.Autocomplete(input, options);
  // }

  // updatedetaill(){
  //   let toast = this.toastCtrl.create({
  //     message:'<ion-icon name="pin"></ion-icon>',
      
  //   });
    // this.devicedetail.address = (<HTMLInputElement>document.getElementById('pac-input')).value;
    // console.log(this.devicedetail.address);

  // }

}
