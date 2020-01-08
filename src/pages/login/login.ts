import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { ModalController } from 'ionic-angular';

declare var carrier;
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public contact: any;
  public password: any;
  public country_code: any = "44";
  public type: any = "other"
  userName: any;
  public fb_id: any;
  public isnetwork = "Online";
  contact_type: string = "phone"
  countryCode: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public signupprovider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,
    private toast: ToastController,
    public modalCtrl: ModalController,
    public sharedservice: SharedserviceProvider,
  ) {
    //Get Network status...
    this.sharedservice.getNetworkStat().subscribe((value) => {
      console.log("network status------------------>>>>>>", value);
      this.isnetwork = value;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.getCountryCode()
  }

  login() {
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
    else if (!this.contact) {
      let showtoast = this.toast.create({
        message: "Please provide valid phone number",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if (!this.password) {
      let showtoast = this.toast.create({
        message: "Please provide valid password",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }

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

    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();

    let logindata;
    if (this.contact_type == 'phone') {
      logindata = {
        phoneNumber: "+" + this.country_code + this.contact,
        // country_code: this.country_code,
        password: this.password,
        role: 'user'
      }
    } else {
      logindata = {
        email: this.contact,
        // country_code: this.country_code,
        password: this.password,
        role: 'user'
      }
    }

    this.signupprovider.login(logindata).then(function (success: any) {
      console.log(success);
      loader.dismiss();
      if (success) {
        console.log(success.user._id);
        localStorage.setItem("userId", success.user._id);
        _base.navCtrl.setRoot('DashboardPage');
      }
    }, function (err) {
      loader.dismiss();
      let temp: any;
      temp = err.responce;
      console.log(temp);
      // if(err._body.message == 'User does not exist'){
      let showtoast = _base.toast.create({
        message: "Please provide valid credentials",
        duration: 6000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
      // }


    })
  }


  openSimCards() {
    console.log("FOcus")
    let _base = this
    if (_base.type == 'other') {
      return
    }
    const modal = _base.modalCtrl.create('SimcardsPage');
    modal.present();

    console.log(modal)

    modal.onDidDismiss((data) => {
      console.log(modal)
      console.log("Data from modal page", data)
      let length = Object.keys(data).length
      if (length != 0) {
        let card = data
        if (!card.phoneNumber) {
          _base.type = 'other';
          modal.dismiss();
          // alert("no sim card");
          let showtoast = this.toast.create({
            message: "The phone number can not be assicible. Please enter the phone number manually",
            duration: 5000,
            position: "bottom",
            showCloseButton: true,
            closeButtonText: "Ok"
          })
          showtoast.present();

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
        else if (_base.countryCode == 'nl') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+31", "") : null;
          _base.country_code = "31";
        }

      } else {
        _base.type = 'other';
        modal.dismiss();
      }
    })
  }

  forgotpassword() {
    this.navCtrl.push('ForgotpasswordPage')
  }


  signup() {
    // this.navCtrl.push('SignupPage');
    this.navCtrl.push('NewsignupPage');
  }

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

  getCountryCode() {
    let _base = this
    carrier.getCountryCode(function (success) {
      console.log("Success", success)
      _base.countryCode = success

      if (_base.countryCode == 'in') {
        _base.country_code = "91"
      } else if (_base.countryCode == 'gb') {
        _base.country_code = "44"
      } else if (_base.countryCode == 'fr') {
        _base.country_code = "33";
      } else if (_base.countryCode == 'be') {
        _base.country_code = "32";
      } else if (_base.countryCode == 'fr') {
        _base.country_code = "44";
      } else if (_base.countryCode == 'es') {
        _base.country_code = "34";
      } else if (_base.countryCode == 'it') {
        _base.country_code = "39";
      }
      else if (_base.countryCode == 'de') {
        _base.country_code = "49";
      }
      else if (_base.countryCode == 'ch') {
        _base.country_code = "41";
      }
      else if (_base.countryCode == 'se') {
        _base.country_code = "46";
      } else if (_base.countryCode == 'us') {
        _base.country_code = "1";
      } else if (_base.countryCode == 'ae') {
        _base.country_code = "971";
      } else if (_base.countryCode == 'tn') {
        _base.country_code = "216";
      } else if (_base.countryCode == 'om') {
        _base.country_code = "968";
      } else if (_base.countryCode == 'gh') {
        _base.country_code = "233";
      } else if (_base.countryCode == 'ng') {
        _base.country_code = "234";
      } else if (_base.countryCode == 'za') {
        _base.country_code = "27";
      }
      else if (_base.countryCode == 'nl') {
        _base.country_code = "31";
      }
      else if (_base.countryCode == 'no') {
        _base.country_code = "47";
      }

    }, function (error) {
      console.log("Error", error)
    });
  }

}
