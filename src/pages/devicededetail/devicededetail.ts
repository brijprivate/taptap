import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, ModalController, NavParams, ToastController, Platform, ActionSheetController, LoadingController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Geolocation } from '@ionic-native/geolocation';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

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

  public devicedetail: any = [];
  public lostmessage: any;
  public lost: boolean = false;
  islost: boolean = true;
  lastImage: any;
  public imageId: any;
  profileImage: string;
  API_URL = "https://api.taptap.org.uk";



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nfctagProvider: NfctagProvider,
    private camera: Camera,
    private transfer: FileTransfer,
    public sharedservice: SharedserviceProvider,
    private file: File,
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private crop: Crop,
    public actionSheetCtrl: ActionSheetController,
    public alert: AlertController,
    private GoogleAutocomplete: Geolocation,
  ) {
    let device = navParams.get("devicedetail");
    let device_string = JSON.stringify(device)
    let index = navParams.get("index");
    let _base = this;
    _base.devicedetail = device
    if (_base.devicedetail.image) {
      _base.imageId = _base.devicedetail.image
    }
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {
        let device_details = response.devices[index]
        if (device_string != JSON.stringify(device_details)) {
          console.log("Not Equal")
          _base.devicedetail = device_details
          if (_base.devicedetail.imageId) {
            _base.imageId = _base.devicedetail.image
          }
        } else {
          console.log("Equal")

        }
      })
  }

  // notify(){
  //   
  // }

  updatedetail() {
    let _base = this;
    let ddata = {
      deviceId: this.devicedetail._id,
      device_title: this.devicedetail.device_title,

      imageId: this.profileImage,
      contact_info: {
        email: this.devicedetail.contact_info.email,
        name: this.devicedetail.contact_info.name,
        address: this.devicedetail.contact_info.address,
        phoneNumber: this.devicedetail.contact_info.phoneNumber,
        mobileNumber: this.devicedetail.contact_info.mobileNumber,
        company_name: this.devicedetail.contact_info.company_name,
        website: this.devicedetail.contact_info.website
      }
    }

    this.nfctagProvider.updateDeviceName(ddata).then(function (success) {
      _base.sharedservice.triggerDevices(true)
      _base.presentAlert();
      // _base.navCtrl.pop();
    }, function (err) {

    })
  }

  //mark as lost...
  notify(device) {
    let _base = this;
    let data = {
      deviceId: device._id,
      is_lost: device.is_lost
    }

    this.nfctagProvider.updateDeviceName(data).then(function (success: any) {
      _base.sharedservice.triggerDevices(true)
      // _base.getpairedDevice();
    }, function (err) {

    })
  }

  back() {
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

        _base.profileImage = JSON.parse(temp.response).upload._id;


        if (_base.profileImage) {

        }

        loader.dismiss();
        _base.presentToast('Image succesful uploaded. Now saving the image to profile.');
        _base.updatedetail();

      },
        err => {
          loader.dismiss();
          _base.presentToast('Error while uploading file.');

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

  showautocomplete() {
    let _base = this;
    let modal = this.modalCtrl.create("AutocompletePage");

    modal.onDidDismiss(data => {
      if (Object.keys(data).length != 0) {
        _base.devicedetail.contact_info.address = data.location;
      } else {

      }
    });
    modal.present();
  }
  presentAlert() {
    let alert = this.alert.create({
      title: 'Data has been saved. Will be relfected in a moment',
      cssClass: 'mycss',
      // buttons: [
      //   {
      //     text: 'OK',
      //     handler: data => {
      //     }
      //   }
      // ]
    });
    alert.present();
    setTimeout(() => alert.dismiss(), 2000);

  }

  // updateSearchResults(inp){

  //   
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
  //         
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
  //   

  //   let autocomplete = new google.maps.places.Autocomplete(input, options);
  // }

  // updatedetaill(){
  //   let toast = this.toastCtrl.create({
  //     message:'<ion-icon name="pin"></ion-icon>',

  //   });
  // this.devicedetail.address = (<HTMLInputElement>document.getElementById('pac-input')).value;
  // 

  // }

}
