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
        } else if (_base.countryCode == 'fr') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+33", "") : null;
          _base.country_code = "33";
        } else if (_base.countryCode == 'be') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+32", "") : null;
          _base.country_code = "32";
        } else if (_base.countryCode == 'fr') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+44", "") : null;
          _base.country_code = "44";
        } else if (_base.countryCode == 'es') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+34", "") : null;
          _base.country_code = "34";
        } else if (_base.countryCode == 'it') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+39", "") : null;
          _base.country_code = "39";
        }
        else if (_base.countryCode == 'de') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+49", "") : null;
          _base.country_code = "49";
        }
        else if (_base.countryCode == 'ch') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+41", "") : null;
          _base.country_code = "41";
        }
        else if (_base.countryCode == 'se') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+46", "") : null;
          _base.country_code = "46";
        } else if (_base.countryCode == 'us') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+1", "") : null;
          _base.country_code = "1";
        } else if (_base.countryCode == 'ae') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+971", "") : null;
          _base.country_code = "971";
        } else if (_base.countryCode == 'tn') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+216", "") : null;
          _base.country_code = "216";
        } else if (_base.countryCode == 'om') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+968", "") : null;
          _base.country_code = "968";
        } else if (_base.countryCode == 'gh') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+233", "") : null;
          _base.country_code = "233";
        } else if (_base.countryCode == 'ng') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+234", "") : null;
          _base.country_code = "234";
        } else if (_base.countryCode == 'za') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+27", "") : null;
          _base.country_code = "27";
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
