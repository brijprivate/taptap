import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
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

  public name: any;
  public email: any;
  public password: any;
  public confirmpassword: any;
  public isnetwork = "Online";
  userName: any;
  public fb_id: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public signupprovider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,
    private toast: ToastController,
    public fb: Facebook,
    private googlePlus: GooglePlus,
    public sharedservice: SharedserviceProvider, ) {
  }

  //Go to Verify page...
  verify() {

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
    else if (!this.name) {
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
    } else if (this.password != this.confirmpassword) {
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
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let _base = this;
    let signupdata = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: "user"
    }
    this.signupprovider.register(signupdata).then(function (success: any) {
      console.log(success);
      loader.dismiss();
      if (success.error == true) {
        alert("user already registered with that email");
        return;
      }

      _base.navCtrl.setRoot('VerifyotpPage', signupdata);
    }, function (err) {
      loader.dismiss();
      alert("Somethig went wrong, Please try again");
      console.log(err);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  login() {
    this.navCtrl.push('LoginPage')
  }


  //Facebook Login...
  fbLogin() {
    // Login with permissions
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log("res==========>>>>>>", res);

        // The connection was successful
        if (res.status == "connected") {

          // Get user ID and Token
          this.fb_id = res.authResponse.userID;
          var fb_token = res.authResponse.accessToken;

          // Get user infos from the API
          this.fb.api("/me?fields=name,gender,birthday,email", []).then((user) => {
            console.log("fb user data ============>>>>>>>>>>", user);

            if (!user.email) {
              alert("This account has no email associated")
              return
            }

            // this.userdata = user;
            // Get the connected user details

            let localVar = {
              userName: user.name,
              email: user.email,
              fb_id: res.authResponse.userID
            }

            if (res.authResponse.userID) {
              this.fblog(localVar);
            }
            console.log("=== USER INFOS ===");
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
  //Facebook login api call...
  fblog(data) {
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let _base = this;
    let fbdata = {
      name: data.userName,
      email: data.email,
      role: "user"
    }
    this.signupprovider.fblogin(fbdata).then(function (success: any) {
      console.log("facebook login ----------->>>>>>>>", success);
      loader.dismiss();

      if (success.error) {
        alert(success.message)
      } else {

        if (success.message == 'password') {
          _base.navCtrl.push('SetpasswordPage', fbdata)

        }
        console.log(success.result._id);
        localStorage.setItem("userId", success.result._id);
        _base.navCtrl.setRoot('DashboardPage');
      }

    }, function (err) {
      loader.dismiss();
      alert("This email is already registered")
      console.log("fb login error---------->>>>>>>", err);
    })
  }


  //Google login....
  googlelogin() {
    console.log("Clicked on google login")
    this.googlePlus.getSigningCertificateFingerprint()
      .then(function (success) {
        console.log(success)
      }, function (error) {
        console.log(error)
      });
    this.googlePlus.login({})
      .then(res => {
        console.log("google login responce==========>>>>>>>>");
        console.log(res);

        let localVar = {
          userName: res.displayName,
          email: res.email,
          fb_id: res.userId
        }

        if (res.userId) {
          this.fblog(localVar)
        }
        // this.isLoggedIn = true;
      })
      .catch(err => {
        console.log(err)
      });
  }
}
