import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public name:any;
  public email:any;
  public password:any;
  public isnetwork= "Online";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public signupprovider:LoginsignupProvider,
    public loading:LoadingController,
    public alert:AlertController,
    private toast: ToastController,
    public sharedservice: SharedserviceProvider,) {
  }

  //Go to Verify page...
  verify()
  {
   
    if(this.isnetwork == "Offline")
    {
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
    else if(!this.name)
    {
      let showtoast = this.toast.create({
        message: "Please provide valid Name",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if(!this.email)
    {
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
    else if(!this.password)
    {
      let showtoast = this.toast.create({
        message: "Please provide valid Password",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
      let loader = this.loading.create({
        content:"Please wait..."
      });
      loader.present();
      let _base = this;
      let signupdata = {
        name:this.name,
        email:this.email,
        password:this.password,
        role:"user"
      }
      this.signupprovider.register(signupdata).then(function(success:any){
        console.log(success);
        loader.dismiss();
        if(success.error == true){
          alert("user already exxxxx");
          return;
        }
        
        _base.navCtrl.setRoot('VerifyotpPage',{useremail:_base.email});
      },function(err){
        loader.dismiss();
        alert("Somethig went wrong, Please try again");
        console.log(err);
      })
   
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  login(){
    this.navCtrl.push('LoginPage')
  }
}
