import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { Ndef, NFC } from '@ionic-native/nfc';
import { Subscription } from 'rxjs/Rx';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import * as CryptoJS from 'crypto-js';
/**
 * Generated class for the TapmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tapmodal',
  templateUrl: 'tapmodal.html',
})
export class TapmodalPage {

  public encryptSecretKey = "the_quick_brown_fox_jumps_over_the_lazy_dog";
  //NFC read related ....
  readingTag: boolean = true;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  public tapData: any;
  public geo: any = {}
  public location: any = "";

  public userId: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public nfc: NFC,
    public ndef: Ndef,
    private nativeGeocoder: NativeGeocoder,
    public viewCtrl: ViewController,
    public loading: LoadingController,
    private geolocation: Geolocation,
    public nfctagProvider: NfctagProvider) {
    this.userId = localStorage.getItem("userId");
    //Read tag ....

    this.subscriptions.push(this.nfc.addNdefListener()
      .subscribe(data => {
        if (this.readingTag) {
          let tagid = data.tag.id;
          console.log(data)
          // let parsedid = this.nfc.bytesToString(tagid);
          let payload = data.tag.ndefMessage[0].payload;
          let tagContent = this.nfc.bytesToString(payload).substring(3);
          this.readingTag = true;

          console.log(tagContent)

          let nfc_regex = /^(((([0-9]|[a-z]){2}):){6})(([0-9]|[a-z]){2})/i;
          let res = nfc_regex.test(tagContent);

          if (res) {
            // nfc id
            this.createTap(tagContent);
          } else {
            // encrypted data
            this.decryptData(tagContent);
          }

          // this.decryptData(tagContent);
          // var s = '';
          // payload.forEach(function (byte) {
          //   s += ('0' + (byte & 0xFF).toString(16)).slice(-2) + ':';
          // });

          // console.log(s)




          // try {
          //   const bytes = CryptoJS.AES.decrypt(s, this.encryptSecretKey);
          //   if (bytes.toString()) {
          //     let decryptData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          //     console.log(decryptData);
          //     this.tapData = decryptData.substring(0, s.length - 1);
          //     if (this.tapData) {
          //       this.createTap();
          //     }
          //   }
          //   return data;
          // } catch (e) {
          //   console.log(e);
          // }



          // console.log("tag data", tagContent);
          // console.log("whole data", data.tag);
          // console.log("tag id", s.substring(0, s.length - 1));
          // this.tapData = s.substring(0, s.length - 1);
          // if (this.tapData) {
          //   this.createTap();
          // }
          // return s.substring(0, s.length - 1);

        }
      },
        err => {
        })
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TapmodalPage');
  }

  ionViewDidEnter() {
    console.log("view enter-------->>>>");
    let _base = this
    _base.geolocation.getCurrentPosition({}).then((resp) => {
      _base.geo.latitude = resp.coords.latitude
      _base.geo.longitude = resp.coords.longitude
      _base.nativeGeocoder.reverseGeocode(_base.geo.latitude, _base.geo.longitude)
        .then((result: NativeGeocoderReverseResult[]) => {
          console.log("reverse geocode ----------------->>>>>>>", result)
          console.log(JSON.stringify(result[0]));
          let location = result[0];
          _base.location = location.thoroughfare + ' ' + location.locality + ' ' + location.subAdministrativeArea + ' ' + location.administrativeArea + ' ' + location.countryName + ' ' + location.postalCode;
        });
      _base.readingTag = true;
      console.log(_base.geo)
    }).catch((error) => {
      console.log('Error getting location', error);
      alert("Please turn on your location service")
    })
  }
  ionViewDidLeave() {
    this.readingTag = false;
  }
  closeModal() {
    // this.viewCtrl.dismiss();
    this.navCtrl.push('HomePage');
  }

  //Save tap .....
  createTap(tapData) {
    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let data = {
      userId: this.userId,
      nfc_id: tapData,
      location: _base.location,
      purpose: '',
      geo: this.geo
    }
    console.log(data);
    this.nfctagProvider.createTap(data).then(function (success: any) {
      console.log(success);
      loader.dismiss();
      _base.readingTag = false;
      // _base.viewCtrl.dismiss();
      if (success.message == 'DEVICE LOST INFO') {
        _base.navCtrl.push('LostcardPage', { lostinfo: success.lostinfo });
      }
      else if (success.message == "DEVICE INFO ") {
        console.log("deviceinfo--------------->>>>");
        _base.navCtrl.push('TapdetailsPage', {
          devicedetaill: success.lostinfo,
          key: 'device'
        });
      }
      else if (success.message == "No data found") {
        alert('No data found')
      }
      else if (success.message == 'Item Tapped Successfull') {
        console.log("detail page------->>>>");
        // _base.navCtrl.push('TapdetailsPage',{itemdetails:success.result});
        _base.navCtrl.push('TapdetailsPage', success.result);


      } else if (success.message == 'NOT PAIRED') {
        // if device is not paired
        _base.navCtrl.pop();
        _base.devicepair_confirmation(success);

      }
    }, function (err) {
      console.log(err);
      loader.dismiss();
    })
  }


  devicepair_confirmation(success: any) {
    let _base = this;
    let alert = this.alertCtrl.create({
      title: 'Pair this ' + success.deviceInfo.type,
      message: 'This ' + success.deviceInfo.type + ' is not paired. Please pair the ' + success.deviceInfo.type + ' to use it.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continue',
          handler: () => {
            console.log('Buy clicked');
            _base.paircode_prompt(success.deviceInfo);
          }
        }
      ]
    });
    alert.present();
  }


  paircode_prompt(device: any) {
    let _base = this;
    let alert = this.alertCtrl.create({
      title: 'Pairing Code',
      inputs: [
        {
          name: 'code',
          placeholder: 'Pairing Code'
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
          text: 'Pair',
          handler: data => {
            if (data.code) {
              // got code
              _base.pairDevice(device.nfc_id, data.code)
            } else {
              // no code

            }
          }
        }
      ]
    });
    alert.present();
  }

  pairDevice(nfc_id: String, pair_code) {
    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let pairdata = {
      nfc_id: nfc_id,
      secret_code: pair_code,
      owner: this.userId
    }
    this.nfctagProvider.pairDevice(pairdata).then(function (success: any) {
      console.log(success);
      loader.dismiss();
      if (success.error) {
        alert(success.message)
      } else {
        // alert('Device paired successfully')
        let showtoast = this.toast.create({
          message: "Device paired successfully",
          duration: 4000,
          position: "bottom",
          showCloseButton: true,
          closeButtonText: "OK"
        })
        showtoast.present();
        // _base.navCtrl.pop();
        // _base.navCtrl.setRoot('ProfilePage');
        if (success.result.type == 'Keyring' || success.result.type == 'card') {
          _base.setdefault(success.result._id)
        }
      }
    }, function (err) {
      console.log(err);
      alert(JSON.parse(err._body).message)
      loader.dismiss();
    })
  }

  setdefault(deviceID: String) {
    let _base = this;
    let data = {
      deviceId: deviceID,
      is_active: true
    }
    console.log(data);
    this.nfctagProvider.updateDeviceName(data).then(function (success: any) {
      console.log(success);
      if (success.error) {
      } else {
      }
    }, function (err) {
      console.log(err);
    })
  }

  gotovack() {
    this.navCtrl.pop()
  }

  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        this.tapData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log(this.tapData)
        this.createTap(this.tapData)
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
}
