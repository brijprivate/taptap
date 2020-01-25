import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import * as CryptoJS from 'crypto-js';

/**
 * Generated class for the PairdevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pairdevice',
  templateUrl: 'pairdevice.html',
})
export class PairdevicePage {
  page = '';
  public userId: any;
  public paircode: any;
  public tapData: any;
  public isnetwork = "Online";

  public encryptSecretKey = "the_quick_brown_fox_jumps_over_the_lazy_dog";
  alertcs: any;
  readingTag: boolean = true;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(public navCtrl: NavController,
    public alert: AlertController,
    public navParams: NavParams,
    public nfc: NFC,
    public ndef: Ndef,
    public loading: LoadingController,
    public nfctagpro: NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController) {
    //Get Network status...
    this.sharedservice.getNetworkStat().subscribe((value) => {

      this.isnetwork = value;
    });

    this.page = this.navParams.get('x');

    this.userId = localStorage.getItem("userId");
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
            this.readingTag = false;
            // this.pairDevice(tagContent);
            this.tapData = tagContent;
            this.presentPrompt(tagContent)
          } else {
            // encrypted data
            this.readingTag = false;
            this.decryptData(tagContent);
          }
          // let payload = data.tag.ndefMessage[0].payload;
          // let tagContent = this.nfc.bytesToString(payload).substring(3);
          // this.readingTag = true;

          // var s = '';
          // tagid.forEach(function (byte) {
          //   s += ('0' + (byte & 0xFF).toString(16)).slice(-2) + ':';
          // });
          // 
          // 
          // 
          // this.tapData = s.substring(0, s.length - 1);
          // if (this.tapData) {
          //   this.presentPrompt()


          // }
          // return s.substring(0, s.length - 1);

        }
      },
        err => {
        })
    );
  }

  ionViewDidLoad() {

  }
  //Pair Device...
  pairDevice(tagdata) {
    let _base = this;
    if (this.isnetwork == "Offline") {
      let showtoast = this.toast.create({
        message: "Please check your internet connection and try again",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if (!tagdata) {
      let showtoast = this.toast.create({
        message: "please approach a TapTap device first",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if (!this.paircode) {
      let showtoast = this.toast.create({
        message: "Please enter your pair code",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }

    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let pairdata = {
      nfc_id: tagdata,
      secret_code: this.paircode,
      owner: this.userId
    }
    this.nfctagpro.pairDevice(pairdata).then(function (success: any) {

      loader.dismiss();
      if (success.error) {
        alert(success.message)
      } else {
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

    this.nfctagpro.updateDeviceName(data).then(function (success: any) {

      if (success.error) {
        _base.sharedservice.triggerDevices(true)
        alert('Device paired but can not set to Default. Please set it default manually')

        // _base.navCtrl.pop();
      } else {
        // _base.navCtrl.pop();
        _base.sharedservice.triggerDevices(true)
      }
    }, function (err) {

      alert('Device paired but can not set to Default. Please set it default manually')
      // _base.navCtrl.pop();
      _base.sharedservice.triggerDevices(true)
    })
  }


  gotovack() {
    this.navCtrl.pop()
  }

  ionViewDidLeave() {
    this.readingTag = false;
    // this.alertcs.dismiss();
  }

  presentPrompt(tapdata) {



    // if(this.page=='page'){

    this.alertcs = this.alert.create({
      title: 'Provide Pairing Code',
      inputs: [
        {

          placeholder: 'Pairing code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Save',
          handler: data => {

            this.paircode = data[0]
            this.pairDevice(tapdata);
          }
        }
      ]
    });
    this.alertcs.present();
  }
  //   this.page=''
  // }

  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        this.tapData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // this.pairDevice(this.tapData)
        this.presentPrompt(this.tapData);
      }
      return data;
    } catch (e) {

    }
  }
}
