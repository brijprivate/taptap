import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { HomePage } from '../home/home';
/**
 * Generated class for the SetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setpassword',
  templateUrl: 'setpassword.html',
})
export class SetpasswordPage {

  public password: any = "";
  public confirmpassword: any = "";
  public user: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public signupprovider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,
    private toast: ToastController) {
    this.user = this.navParams.data
  }

  ionViewDidLoad() {
    
  }

  register() {
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

    this.fblog(this.user)

  }

  fblog(data) {
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let _base = this;
    let fbdata = {
      name: this.user.name,
      email: this.user.email,
      role: "user",
      password: this.password
    }
    this.signupprovider.fblogin(fbdata).then(function (success: any) {
      
      loader.dismiss();

      if (success.error) {
        alert(success.message)
      } else {
        
        localStorage.setItem("userId", success.result._id);
        _base.navCtrl.setRoot('SynchroniserPage');
      }

    }, function (err) {
      loader.dismiss();
      alert("Can not register. Please try again later")
      
    })
  }

}
