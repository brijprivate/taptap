import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
// import { GooglePlus } from '@ionic-native/google-plus';

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

  public email:any;
  public password:any;
  userName: any;
  public fb_id:any;
  public isnetwork= "Online";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public signupprovider:LoginsignupProvider,
    public loading:LoadingController,
    public alert:AlertController,
    public fb: Facebook,
    private toast: ToastController,
    public sharedservice: SharedserviceProvider,
    ) 
    {
       //Get Network status...
       this.sharedservice.getNetworkStat().subscribe((value)=>{
        console.log("network status------------------>>>>>>",value);
        this.isnetwork = value;
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login()
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
    else if(!this.email)
    {
      let showtoast = this.toast.create({
        message: "Please provide valid email",
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
        message: "Please provide valid password",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
      let _base = this;
      let loader = this.loading.create({
        content:"Please wait..."
      });
      loader.present();
      let logindata ={
        email:this.email,
        password:this.password
      }
      this.signupprovider.login(logindata).then(function(success:any){
        console.log(success);
        loader.dismiss();
        if(success){
          console.log(success.user._id);
          localStorage.setItem("userId",success.user._id);
          _base.navCtrl.setRoot('DashboardPage');
        }
      },function(err){
        loader.dismiss();

      })
  }

  //Facebook Login...
  fbLogin()
  {
     // Login with permissions
    this.fb.login(['public_profile', 'user_photos', 'email', 'user_birthday'])
    .then( (res: FacebookLoginResponse) => {
      console.log("res==========>>>>>>", res);

        // The connection was successful
        if(res.status == "connected") {

            // Get user ID and Token
            this.fb_id = res.authResponse.userID;
            var fb_token = res.authResponse.accessToken;

            // Get user infos from the API
            this.fb.api("/me?fields=name,gender,birthday,email", []).then((user) => {
              console.log("fb user data ============>>>>>>>>>>" , user);

              // this.userdata = user;
                // Get the connected user details
                var gender    = user.gender;
                var birthday  = user.birthday;
                this.userName = user.name;
                this.email = user.email;

                if(this.fb_id){
                  this.fblog();
                }
                console.log("=== USER INFOS ===");
                console.log("Gender : " + gender);
                console.log("Birthday : " + birthday);
                console.log("Name : " + this.userName);
                console.log("Email : " + this.email);
                // => Open user session and redirect to the next page
            });
        } 
        // An error occurred while loging-in
        else {
            console.log("An error occurred...");
        }
    })
    .catch((e) => {
        console.log('Error logging into Facebook', e);
    });
  }

  //Facebook login api call...
  fblog(){
    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();
    let _base = this;
    let fbdata = {
      name:this.userName,
      email:this.email,
      role:"user",
      providerId:this.fb_id
    }
    this.signupprovider.fblogin(fbdata).then(function(success:any){
      console.log("facebook login ----------->>>>>>>>",success);
      loader.dismiss();
      
    },function(err){
      loader.dismiss();
      console.log("fb login error---------->>>>>>>",err);
    })
  }

  
  //Google login....
  googlelogin() {
    alert("coming soon");
    // this.googlePlus.login({})
    //   .then(res => {
    //     console.log("google login responce==========>>>>>>>>");
    //     console.log(res);
    //     this.userName = res.displayName;
    //     this.email = res.email;
    //     // this.familyName = res.familyName;
    //     // this.givenName = res.givenName;
    //     // this.userId = res.userId;
    //     // this.imageUrl = res.imageUrl;

    //     // this.isLoggedIn = true;
    //   })
    //   .catch(err => console.log(err)
    //   );
  }


  signup(){
    this.navCtrl.push('SignupPage');
  }
}
