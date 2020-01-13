import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';


/**
 * Generated class for the VerifyotpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verifyotp',
  templateUrl: 'verifyotp.html',
})
export class VerifyotpPage {

  public otp: any;
  public user: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public signupprovider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController) {
    this.user = this.navParams.data;
  }

  ionViewDidLoad() {
    
  }
  
  otpVerification() {
    if (this.otp) {
      let loader = this.loading.create({
        content: "Please wait..."
      });
      loader.present();
      let _base = this;
      let otpdata = {
        contact: this.user.contact,
        country_code: this.user.country_code,
        code: this.otp
      }
      this.signupprovider.verifyotp(otpdata).then(function (success: any) {
        loader.dismiss();
        
        if (success) {
          localStorage.setItem("userId", success.result._id);
          _base.navCtrl.setRoot('SynchroniserPage');
        }
      }, function (err) {
        loader.dismiss();
        alert("Incorrect OTP")
        
      })
    } else {
      alert("Please Provide OTP to Continue");
    }
  }


  resendOTP() {
    let _base = this
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    this.signupprovider.register(this.user).then(function (success: any) {
      
      loader.dismiss();
      if (success.error == true) {
        alert("user already registered with that phone number");
        return;
      }

      alert("O.T.P sent successfully")

    }, function (err) {
      loader.dismiss();
      alert("Somethig went wrong, Please try again");
      
    })
  }
  // keyUpChecker(ev) {

  //   if (this.otp.length >4) {
  //     
  //     this.otp.slice(0,-1);
  //   }

  // }
}
