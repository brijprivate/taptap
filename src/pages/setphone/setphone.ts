import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { ModalController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var SMSReceive: any;
declare var carrier;
/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setphone',
  templateUrl: 'setphone.html',
})
export class SetphonePage {

  public state: string = "phone"
  public contact: String = ""
  public otp: any
  public password: String = ""
  public confirmpassword: String = ""
  public type: any = ""
  public country_code: any = "91"
  countryCode: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: LoginsignupProvider,
    public loading: LoadingController,
    public modalCtrl: ModalController,
    private toast: ToastController,
    private androidPermissions: AndroidPermissions,
    public alert: AlertController) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ForgotpasswordPage');
    let _base = this
    this.getCountryCode()
  }

  sendcode() {
    let _base = this
    if (_base.contact.length != 0) {
      _base.http.register({ contact: _base.contact, country_code: _base.country_code })
        .then(function (success: any) {
          if (success.error == false) {
            _base.state = "otp"
            // alert("O.T.P Send successfully")
            _base.start()

          } else {
            alert(success.message)
          }
        }, function (error) {
          console.log(JSON.parse(error._body).message)
          alert(JSON.parse(error._body).message)
        });
    } else {
      alert("Please input your registered phone number")
    }
  }

  verifycode() {
    let _base = this
    _base.http.verifyUserOTP({ phoneNumber: '+' + _base.country_code + _base.contact, country_code: _base.country_code, code: _base.otp, userId: localStorage.getItem('userId') })
      .then(function (success: any) {
        if (success.error == false) {
          _base.presentAlert()
          _base.back()
        } else {
          alert(success.message)
        }
      }, function (error) {
        console.log(error)
        alert(JSON.parse(error._body).message)
      });
  }

  resendOTP() {
    this.sendcode()
    this.otp = null
  }

  back() {
    this.navCtrl.pop();
  }

  //check pattern...
  checkpattern(email) {
    // console.log("aaaaaa");
    let _base = this;
    let pattern = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$/;
    let result = pattern.test(email);
    if (!result) {
      console.log("miss");
      let showtoast = _base.toast.create({
        message: "Please provide valid email",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;

    } else {
      console.log("matched");
    }
    console.log(pattern)
  }

  openSimCards() {
    let _base = this
    if (_base.type == 'other') {
      return
    }
    const modal = _base.modalCtrl.create('SimcardsPage');
    modal.present();

    modal.onDidDismiss((data) => {
      console.log("Data from modal page", data)
      let length = Object.keys(data).length
      if (length != 0) {
        let card = data
        if (!card.phoneNumber) {
          _base.type = 'other'
        }
        if (_base.countryCode == 'in') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+91", "") : null
          _base.country_code = "91"
        } else if (_base.countryCode == 'gb') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+44", "") : null
          _base.country_code = "44"
        }
      }
    })
  }


  start() {
    let _base = this
    SMSReceive.startWatch(
      () => {
        console.log('watch started');
        document.addEventListener('onSMSArrive', (e: any) => {
          console.log('onSMSArrive()');
          var IncomingSMS = e.data;
          console.log(JSON.stringify(IncomingSMS));
          var string = IncomingSMS.body;
          var numbers = string.match(/\d+/g).map(Number);
          let otp = numbers[0]
          console.log(otp);
          _base.stop();
          (<HTMLInputElement>document.getElementById("partitioned")).value = otp;
          _base.otp = otp;
          (<HTMLButtonElement>document.getElementById("verify")).click();

        });
      },
      () => { console.log('watch start failed') }
    )
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  presentAlert() {

    let alert = this.alert.create({
      title: 'Your phone number has been set',
      // subTitle: 'Milage Saved',
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

  getCountryCode() {
    let _base = this
    carrier.getCountryCode(function (success) {
      console.log("Success", success)
      _base.countryCode = success
    }, function (error) {
      console.log("Error", error)
    });
  }

}
