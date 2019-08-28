import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { Storage } from '@ionic/storage';
import { toBase64String } from '@angular/compiler/src/output/source_map';

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
  public imageId: any = 'assets/images/avatar.png';
  public data = [];
  API_URL = "https://api.taptap.org.uk";
  public userId: any;
  public profiledata: any = {};
  profileImage: string = "";
  isemailchanged: boolean = false;
  initEmail: String = ""


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
    public loginsignupProvider: LoginsignupProvider,
    public alert: AlertController,
    private storage: Storage,

  ) {

    this.userId = localStorage.getItem("userId");
    console.log(this.userId);
    if (this.userId) {
      this.getprofiledata();

    }
  }

  ionViewDidLoad() {
    //creating url for profile pic
    // this.imageId = this.API_URL+"/file/getImage?imageId=" + this.profileImage;

    console.log('ionViewDidLoad EditprofilePage');
  }

  ionViewDidEnter() {
    this.userId = localStorage.getItem("userId");
    console.log(this.userId);
    if (this.userId) {
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
  public takePicture(sourceType) {
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
      this.crop.crop(imagePath, {
        quality: 100,
        targetWidth: 160,
        targetHeight: 160,
      }).then(function (success: any) {
        console.log("here is the success image ..." + success);
        imagePath = success;
        console.log("check image path......" + imagePath);
        // _base.imageId = imagePath;
        console.log("check image source type............");
        console.log(sourceType);

        // Speacial handleing for Android platform...
        if (_base.platform.is('android') || sourceType == options.sourceType.PHOTOLIBRARY) {
          console.log("selected from library.......");

          _base.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              _base.copyFileToLocalDir(correctPath, currentName, _base.createFileName());
            });
        }
        else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          _base.copyFileToLocalDir(correctPath, currentName, _base.createFileName());
        }

      },
        (err) => {
          this.presentToast('Error while selecting image.');
        });

    }, function (error) {
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
      if (this.lastImage) {
        this.uploadImage();
      }
      // this.getTrustImg(this.lastImage);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  getTrustImg(imgsrc) {
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
      var url = this.API_URL + "/file/upload";

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
        console.log("profile image" + this.profileImage);

        if (this.profileImage) {
          this.imageId = this.API_URL + "/file/getImage?imageId=" + this.profileImage + "&select=thumbnail";//creating url for profile pic
          this.convertToDataURLviaCanvas(this.API_URL + "/file/getImage?imageId=" + this.profileImage, "image/png").then(base64img => {
            console.log(base64img);
            this.imageId = base64img;
            this.storage.remove("buimg")
            this.storage.set('buimg', base64img);
          })
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

  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
        canvas = null;
      };
      img.src = url;
    });
  }

  //Get profile data...
  getprofiledata() {
    let _base = this;
    _base.storage.get("prodata").then((prodata) => {
      if (prodata) {
        _base.profiledata = prodata;
        console.log(_base.profiledata);
      }
    });


    // _base.storage.get('uimg')
    //   .then(function (image) {
    //     if (image) {
    //       _base.imageId = image;
    //     }
    //   });

    _base.storage.get('buimg')
      .then(function (image) {
        if (image) {
          _base.imageId = image;
        }
      });

    this.loginsignupProvider.getProfile(this.userId).then(function (success: any) {
      console.log(success);
      _base.storage.remove("prodata")
      _base.storage.set("prodata", success.result);
      _base.profiledata = success.result;
      if (success.result.imageId) {

        let image = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id;
        _base.imageId = image;
        _base.profileImage = success.result.imageId._id;
        _base.convertToDataURLviaCanvas(image, "image/png").then(base64img => {
          console.log(base64img);
          // _base.imageId = base64img;
          _base.storage.remove("buimg")
          _base.storage.set('buimg', base64img);
        })
      } else {
        _base.imageId = "assets/images/avatar.png";
        _base.convertToDataURLviaCanvas(_base.imageId, "image/png").then(base64img => {
          console.log(base64img);
          _base.imageId = base64img;
          _base.storage.remove("buimg")
          _base.storage.set('buimg', _base.imageId);
        })
        console.log("enterr else image =============")
      }
      _base.initEmail = success.result.email ? success.result.email : ''
    }, function (err) {
      _base.storage.get("prodata").then((prodata) => {
        if (prodata) {
          _base.profiledata = prodata;
          console.log(_base.profiledata);
        }
      });
      console.log(err);
    })
  }

  imageExists(url, callback) {
    var img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = url;
  }

  updateProfile() {
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

    let profile;

    if (!_base.profiledata.email) {
      _base.profiledata.email = ""
    }

    if (_base.initEmail.trim() != _base.profiledata.email.trim() && _base.profiledata.email.trim() != "") {
      profile = {
        email: _base.profiledata.email
      }
    } else {

      profile = {
        address: _base.profiledata.address ? _base.profiledata.address : ' ',
        city: _base.profiledata.city ? _base.profiledata.city : ' ',
        country: _base.profiledata.country ? _base.profiledata.country : ' ',
        imageId: _base.profileImage != "" ? _base.profileImage : null,
        name: _base.profiledata.name ? _base.profiledata.name : ' ',
        website: _base.profiledata.website ? _base.profiledata.website : ' '
      }
    }

    Object.assign(_base.profiledata, { imageId: _base.profileImage });
    console.log(_base.profiledata);
    this.loginsignupProvider.profileUpdate(profile).then(function (success: any) {
      console.log(success);

      if (success.error) {
        alert("This email is already owned")
        return;
      }

      if (_base.initEmail.trim() != _base.profiledata.email.trim() && _base.profiledata.email.trim() != "") {
        _base.OTPAlert()
      } else {
        _base.presentAlert();
        _base.navCtrl.pop();
      }
    }, function (err) {
      console.log(err);
      // alert("This email is already owned")
    })
  }
  back() {
    this.navCtrl.pop()
  }
  presentAlert() {

    let alert = this.alert.create({
      title: 'Data has been saved',
      // subTitle: 'Milage Saved',
      cssClass: 'mycss',

    });
    alert.present();
    setTimeout(() => alert.dismiss(), 2000);

  }

  OTPAlert() {
    let _base = this
    let alert = this.alert.create({
      title: 'ONE TIME PASSWORD has been sent to your email ' + _base.profiledata.email,
      cssClass: 'reset',
      inputs: [
        {
          name: 'code',
          placeholder: 'One Time Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Resend',
          handler: data => {
            _base.updateProfile()
          }
        },
        {
          text: 'Verify',
          handler: data => {

            if (data.code != null || data.code != '') {

              _base.verifycode(data.code)

            } else {
              _base.OTPAlert()
            }

          }
        }
      ]
    });
    alert.present();
  }

  verifycode(code) {
    let _base = this
    _base.loginsignupProvider.verifyEmailOTP({ email: _base.profiledata.email, code: code.trim(), userId: _base.userId })
      .then(function (success: any) {
        if (success.error == false) {
          _base.presentAlert();
          _base.navCtrl.pop();
        } else {
          alert(success.message)
          _base.OTPAlert()
        }
      }, function (error) {
        console.log(error)
        alert(JSON.parse(error._body).message)
        _base.OTPAlert()
      });
  }

}
