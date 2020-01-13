
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Slides, Platform, ToastController } from 'ionic-angular';
// import { RegistrationProvider } from "../../providers/registration/registration";
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ElementsProvider } from '../../providers/elements/elements';
import { MenuController } from 'ionic-angular';
import * as moment from 'moment';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
// import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
declare var SMS: any;
declare var carrier;



/**
 * Generated class for the NewsignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsignup',
  templateUrl: 'newsignup.html',
})
export class NewsignupPage {

 
  public loader:boolean=false;
  countryCode: any;
  country_code: any = "44"
  name:any;
  email:any;
  password:any;
  cpassword:any;
  phonenumber:any;
  code:any;
  public isnetwork = "Online";

  @ViewChild(Slides) slides: Slides;


  constructor
    (
      public menuCtrl: MenuController,
      public navCtrl: NavController,
      public platform: Platform,
      public elem: ElementRef,
      public ep: ElementsProvider,
      public api: LoginsignupProvider,
      private camera: Camera,
      public nav: NavController,
      // public theInAppBrowser:InAppBrowser,
      public navParams: NavParams,
      public androidPermissions: AndroidPermissions,
      public alertCtrl: AlertController,
      public loginsignupProvider:LoginsignupProvider,
      private toast: ToastController,
      public sharedservice: SharedserviceProvider,

    ) {

       //Get Network status...
    this.sharedservice.getNetworkStat().subscribe((value) => {
      
      this.isnetwork = value;
    });
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    this.getCountryCode();

  }




  //To slide the form through index

  nextform(index) {

    let _base = this;
    this.slides.lockSwipes(false);
    this.slides.slideTo(index, 250);
    this.slides.lockSwipes(true);
  }

  finish(){
this.loader=!this.loader
  }


  //get country code ...
  getCountryCode() {
    let _base = this
    carrier.getCountryCode(function (success) {
      
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
      
    });
  }

  checkval(){
    if (this.isnetwork == "Offline") {
      let showtoast = this.toast.create({
        message: "Please check your internet connection and try again",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      this.slides.lockSwipes(true);
      return;
    }
    else if (!this.name) {
      let showtoast = this.toast.create({
        message: "Please provide valid Name",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      this.slides.lockSwipes(true);

      return;
    }
   
    else if (!this.email) {
      let showtoast = this.toast.create({
        message: "Please provide valid Email",
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
        message: "Please provide valid Password",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    } else if (this.password != this.cpassword) {
      let showtoast = this.toast.create({
        message: "Passwords do not match",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    } else if (this.password.length <= 5) {
      let showtoast = this.toast.create({
        message: "Password length must be atleast 6",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else{
      this.nextform(1)
    }
  }
  //function to get otp...
  getotp(){
    if (this.isnetwork == "Offline") {
      let showtoast = this.toast.create({
        message: "Please check your internet connection and try again",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      this.slides.lockSwipes(true);
      return;
    }
    else if (!this.name) {
      let showtoast = this.toast.create({
        message: "Please provide valid Name",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      this.slides.lockSwipes(true);

      return;
    }
    else if (!this.phonenumber) {
      let showtoast = this.toast.create({
        message: "Please provide valid  Phone number",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if (!this.email) {
      let showtoast = this.toast.create({
        message: "Please provide valid Email",
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
        message: "Please provide valid Password",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    } else if (this.password != this.cpassword) {
      let showtoast = this.toast.create({
        message: "Passwords do not match",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    } else if (this.password.length <= 5) {
      let showtoast = this.toast.create({
        message: "Password length must be atleast 6",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }

    let _base = this;
    let signupdata = {
      name: this.name,
      contact: this.phonenumber,
      password: this.password,
      country_code:"91",
      role: "user"
    }
    this.loginsignupProvider.register(signupdata).then(function (success: any) {
      
      // loader.dismiss();
      if (success.error == true) {
        alert("user already registered with that Phone Number");
        return;
      }else{
        _base.nextform(2);
      }
      // alert(success.user.code)
      // _base.navCtrl.setRoot('VerifyotpPage', signupdata);
    }, function (err) {
      // loader.dismiss();
      alert(JSON.parse(err._body).message);
      
    })

  }

  //new Signup....
  newsignup(){
    let _base = this;
    let signupdata={
      name:this.name,
      email:this.email,
      password:this.password,
      country_code:"91",
      contact:this.phonenumber,
      code:this.code,
      loginType: "general",
      role:"user",
      zip:"",
      city:"",
      address:"",
      country:"",
      website:"",
      milage_preference:[],
      imageId:"",
      company_name:"",
      mobileNumber:""
    }
    
    _base.loginsignupProvider.newregister(signupdata).then(function(success){
      

    },function(err){
      
    })
  }
}


