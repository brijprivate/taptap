import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Platform, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { Storage } from '@ionic/storage';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

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
  API_URL = "https://api.thingtap.com";
  public userId: any;
  public profiledata: any = {};
  profileImage: string = "";
  isemailchanged: boolean = false;
  initEmail: String = ""



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private transfer: FileTransfer,
    public modalCtrl: ModalController,
    private file: File,
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public sharedservice: SharedserviceProvider,
    private crop: Crop,
    public actionSheetCtrl: ActionSheetController,
    private DomSanitizer: DomSanitizer,
    public loginsignupProvider: LoginsignupProvider,
    public alert: AlertController,
    private storage: Storage,

  ) {

    this.userId = localStorage.getItem("userId");
    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {
        _base.getprofiledata(response.profile, response.display_picture)
      })
  }

  onScroll($event) {

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


      //Crop function to crop the image...
      this.crop.crop(imagePath, {
        quality: 100,
        targetWidth: 160,
        targetHeight: 160,
      }).then(function (success: any) {

        imagePath = success;

        // _base.imageId = imagePath;



        // Speacial handleing for Android platform...
        if (_base.platform.is('android') || sourceType == options.sourceType.PHOTOLIBRARY) {


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
    let _base = this;

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

      fileTransfer.upload(targetPath, url, options).then(data => {


        var temp: any;
        temp = data;

        this.profileImage = JSON.parse(temp.response).upload._id;


        if (this.profileImage) {
          // this.imageId = this.API_URL + "/file/getImage?imageId=" + this.profileImage + "&select=thumbnail";//creating url for profile pic
          this.convertToDataURLviaCanvas(this.API_URL + "/file/getImage?imageId=" + this.profileImage, "image/png").then(base64img => {
            _base.savePhoto(_base.profileImage);

          })
        }

        // 

        loader.dismiss();
        // this.presentToast('Image succesfully uploaded. Will be shown on profile in a moment');
        // this.update();//update after image uploaded successfully

      },
        err => {
          loader.dismiss();
          this.presentToast('Error while uploading file.' + err);

        });
    }
    else {
      // this.update();
    }
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }

  //check permissions....
  // checkpermissions(){
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
  //     result => ,
  //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
  //   );
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
  //     result => ,
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

  removePhoto() {
    let _base = this;
    let data = {
      imageId: '5d67bb5c5c27994be78f2b73',
      _id: _base.profiledata._id
    }
    this.loginsignupProvider.profileUpdate(data).then(function (success: any) {

      // _base.presentToast('Profile picture will be removed shortly in a moment');
      _base.sharedservice.triggerProfile(true)
    }, function (err) {

      alert("Can not remove. please try again")
    })
  }

  savePhoto(imageID: String) {
    let _base = this;
    let data = {
      imageId: imageID,
      _id: _base.profiledata._id
    }
    this.loginsignupProvider.profileUpdate(data).then(function (success: any) {


      if (success.error) {
        alert("Can not save profile picture. Please try again")
        return;
      } else {
        // _base.getprofiledata()
        // _base.presentToast('Profile Picture will be shown on profile in a moment.');
        _base.sharedservice.triggerProfile(true)
      }
    }, function (err) {

      alert("Can not save profile picture. please try again")
    })
  }

  showautocomplete() {
    let _base = this;
    let modal = this.modalCtrl.create("AutocompletePage");

    modal.onDidDismiss(data => {
      if (data && Object.keys(data).length != 0) {

        _base.profiledata.address = data.location;
        _base.profiledata.country = data.country;
        _base.profiledata.city = data.city;
      } else {

      }
    });
    modal.present();
  }

  //Get profile data...
  getprofiledata(profile, display_picture) {
    let _base = this;
    _base.profiledata = profile;
    _base.imageId = display_picture;
  }

  imageExists(url, callback) {
    var img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = url;
  }

  updateProfile() {
    let _base = this;

    let profile;

    if (!_base.profiledata.email) {
      _base.profiledata.email = ""
    }

    if (this.initEmail.trim() != "" && _base.profiledata.email.trim() == "") {
      alert('Removing email is now allowed. You can only change the email.')
      _base.profiledata.email = _base.initEmail;
      return;
    }

    // if (_base.initEmail.trim() != _base.profiledata.email.trim() && _base.profiledata.email.trim() != "") {
    //   profile = {
    //     email: _base.profiledata.email
    //   }
    // } else {

    profile = {
      address: _base.profiledata.address,
      email: _base.profiledata.email,
      city: _base.profiledata.city,
      country: _base.profiledata.country,
      imageId: _base.profileImage != "" ? _base.profileImage : null,
      name: _base.profiledata.name,
      website: _base.profiledata.website
    }
    // }

    this.loginsignupProvider.profileUpdate(profile).then(function (success: any) {


      if (success.error) {
        alert("This email is already owned")
        return;
      }

      _base.sharedservice.triggerProfile(true)
      _base.presentAlert();
      _base.navCtrl.pop();

    }, function (err) {

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

        alert(JSON.parse(error._body).message)
        _base.OTPAlert()
      });
  }

}
