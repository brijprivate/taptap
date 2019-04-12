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

  public otp:any;
  public userEmail:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public signupprovider:LoginsignupProvider,
    public loading:LoadingController,
    public alert:AlertController) {
      this.userEmail = this.navParams.get("useremail");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyotpPage');
  }

  otpVerification()
  {
    if(this.otp)
    {
      let loader = this.loading.create({
        content:"Please wait..."
      });
      loader.present();
      let _base = this;
      let otpdata = {
        email:this.userEmail,
        code:this.otp
      }
      this.signupprovider.verifyotp(otpdata).then(function(success:any){
        loader.dismiss();
        console.log(success);
        if(success){
          localStorage.setItem("userId",success.result._id);
          _base.navCtrl.setRoot('DashboardPage');
        }
      },function(err){
        loader.dismiss();
        alert("Incorrect OTP")
        console.log(err);
      })
    }else
    {
      alert("Please Provide OTP to Continue");
    }
  }
}
