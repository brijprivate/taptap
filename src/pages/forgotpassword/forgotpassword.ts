import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { ModalController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var SMSReceive: any;

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  public state: string = "phone"
  public contact: string = ""
  public otp: any
  public password: String = ""
  public confirmpassword: String = ""
  public type: any = ""
  public country_code: any = "91"
  public contact_type: any = ""

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

  }

  sendcode() {
    let _base = this
    if (_base.contact.length != 0) {

      if (this.contact) {
        console.log(parseInt(this.contact))
        if (parseInt(this.contact)) {

          if (parseInt(this.contact).toString().length != this.contact.length) {
            console.log('Email')

            let isValidEmail = this.checkpattern(this.contact)
            if (!isValidEmail) {
              return;
            } else {
              this.contact_type = "email"
            }

          } else {
            console.log('phone')
            this.contact_type = "phone"
          }

        } else {
          console.log('email')
          let isValidEmail = this.checkpattern(this.contact)
          if (!isValidEmail) {
            return;
          } else {
            this.contact_type = "email"
          }
        }
      }

      let logindata;
      if (this.contact_type == 'phone') {
        logindata = { phoneNumber: '+' + _base.country_code + _base.contact }
      } else {
        logindata = {
          email: this.contact
        }
      }

      _base.http.forgotPassword(logindata)
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

    let logindata;
    if (this.contact_type == 'phone') {
      logindata = { phoneNumber: '+' + _base.country_code + _base.contact, code: _base.otp }
    } else {
      logindata = {
        email: this.contact,
        code: _base.otp
      }
    }

    _base.http.verifyUserOTP(logindata)
      .then(function (success: any) {
        if (success.error == false) {
          _base.state = "password"
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

  setpassword() {
    if (this.password.trim() == "" || this.confirmpassword.trim() == "") {
      alert("Please fill all the fields");
      return;
    }

    if (this.password.trim().length <= 5) {
      alert("password should be more that 5 letters");
      return;
    }

    if (this.password.trim() != this.confirmpassword.trim()) {
      alert("password s do not match");
      return;
    }


    let _base = this
    _base.http.resetpassword({ phoneNumber: '+' + _base.country_code + _base.contact, country_code: _base.country_code })
      .then(function (success: any) {
        if (success.error == false) {
          _base.state = "phone"
          alert("Password changed successfully")
          _base.navCtrl.pop()
        } else {
          alert(success.message)
        }
      }, function (error) {
        alert(JSON.parse(error._body).message)
      });
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
      return false
    } else {
      return true
    }
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
        if (card.countryCode == 'in') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+91", "") : null
          _base.country_code = "91"
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
          if (IncomingSMS.body.includes("our OTP is")) {
            let otp = IncomingSMS.body.split(".")[0].replace("Your OTP is", "").trim()
            console.log(otp);
            _base.stop();
            (<HTMLInputElement>document.getElementById("partitioned")).value = otp;
            _base.otp = otp;
            (<HTMLButtonElement>document.getElementById("verify")).click();
          }

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

}
