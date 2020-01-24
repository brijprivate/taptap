import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { HomePage } from '../home/home';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  public userName = "";
  public password: any = "";
  public confirmpassword: any = "";
  public user: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public signupprovider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController) {
    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {

        if (Object.keys(response).length != 0) {

          _base.getUser(response.profile)
        }
      })
  }


  getUser(user: any) {
    let _base = this;
    _base.user = user;
    _base.userName = user.name.split(" ")[0];
  }


  updatePassword() {
    let _base = this;

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

    let updateData = {
      password: this.password,
      email: this.user.email
    }
    _base.signupprovider.resetpassword(updateData)
      .then(function (success) {
        alert("password reset successfull");
        _base.navCtrl.pop();
      }, function (error) {
        alert("Can not reset password");
      });
  }

  skip() {
    this.navCtrl.pop();
  }

}
