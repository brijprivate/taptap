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

          // let parsedid = this.nfc.bytesToString(tagid);
          let payload = data.tag.ndefMessage[0].payload;
          let tagContent = this.nfc.bytesToString(payload).substring(3);
          this.readingTag = true;



          let nfc_regex = /^(((([0-9]|[a-z]){2}):){6})(([0-9]|[a-z]){2})/i;
          let res = nfc_regex.test(tagContent);

          if (res) {
            // nfc id
            this.createTap(tagContent);
          } else {
            // encrypted data
            this.decryptData(tagContent);
          }

        }
      },
        err => {
        })
    );
  }

  ionViewDidLoad() {

  }

  ionViewDidLeave() {
    this.readingTag = false;
  }
  closeModal() {
    this.viewCtrl.dismiss();
    // this.navCtrl.push('HomePage');
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
      location: '',
      purpose: '',
      geo: {
        latitude: localStorage.getItem('lat'),
        longitude: localStorage.getItem('lng')
      }
    }

    this.nfctagProvider.createTap(data).then(function (success: any) {

      loader.dismiss();
      _base.readingTag = false;
      // _base.viewCtrl.dismiss();
      if (success.message == 'DEVICE LOST INFO') {
        _base.navCtrl.push('LostcardPage', { lostinfo: success.lostinfo });
      }
      else if (success.message == "DEVICE INFO ") {

        _base.navCtrl.push('TapdetailsPage', {
          devicedetaill: success.lostinfo,
          key: 'device'
        });
      }
      else if (success.message == "No data found") {
        alert('No data found')
      }
      else if (success.message == 'Item Tapped Successfull') {

        // _base.navCtrl.push('TapdetailsPage',{itemdetails:success.result});
        _base.navCtrl.push('TapdetailsPage', success.result);


      } else if (success.message == 'NOT PAIRED') {
        // if device is not paired
        _base.devicepair_confirmation(success);

      }
      // _base.navCtrl.pop();

    }, function (err) {

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

          }
        },
        {
          text: 'Continue',
          handler: () => {

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

    this.nfctagProvider.updateDeviceName(data).then(function (success: any) {

      if (success.error) {
      } else {
      }
    }, function (err) {

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

        this.createTap(this.tapData)
      }
      return data;
    } catch (e) {

    }
  }
}
