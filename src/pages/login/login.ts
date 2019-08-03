import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { GooglePlus } from '@ionic-native/google-plus';
import { ModalController } from 'ionic-angular';

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
  public country_code: any = "91";
  public type: any = ""
  userName: any;
  public fb_id: any;
  public isnetwork = "Online";
  contact_type: string = "phone"

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public signupprovider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,
    public fb: Facebook,
    private toast: ToastController,
    public modalCtrl: ModalController,
    public sharedservice: SharedserviceProvider,
    private googlePlus: GooglePlus
  ) {
    //Get Network status...
    this.sharedservice.getNetworkStat().subscribe((value) => {
      console.log("network status------------------>>>>>>", value);
      this.isnetwork = value;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
          _base.type = 'other'
        }
        if (card.countryCode == 'in') {
          _base.contact = card.phoneNumber ? card.phoneNumber.replace("+91", "") : null
          _base.country_code = "91"
        }
      }
    })
  }

  forgotpassword() {
    this.navCtrl.push('ForgotpasswordPage')
  }


  signup() {
    this.navCtrl.push('SignupPage');
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
}
