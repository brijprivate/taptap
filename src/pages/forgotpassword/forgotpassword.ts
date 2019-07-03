import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  public state: string = "email"
  public email: String = ""
  public otp: any
  public password: String = ""
  public confirmpassword: String = ""

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  sendcode() {
    let _base = this
    if (_base.email.length != 0) {
      _base.http.forgotPassword({ email: _base.email })
        .then(function (success: any) {
          if (success.error == false) {
            _base.state = "otp"
            alert("O.T.P Send successfully")
          } else {
            alert(success.message)
          }
        }, function (error) {
          console.log(JSON.parse(error._body).message)
          alert(JSON.parse(error._body).message)
        });
    } else {
      alert("Please input your registered email")
    }
  }

  verifycode() {
    let _base = this
    _base.http.verifyUserOTP({ email: _base.email, code: _base.otp })
      .then(function (success: any) {
        if (success.error == false) {
          _base.state = "password"
        } else {
          alert(success.message)
        }
      }, function (error) {
        console.log(error)
        alert(JSON.parse(error._body).message)
      });
  }

  resendOTP() {
    this.sendcode()
    this.otp = null
  }

  setpassword() {
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


    let _base = this
    _base.http.resetpassword({ email: _base.email, password: _base.password })
      .then(function (success: any) {
        if (success.error == false) {
          _base.state = "email"
          alert("Password changed successfully")
          _base.navCtrl.pop()
        } else {
          alert(success.message)
        }
      }, function (error) {
        alert(JSON.parse(error._body).message)
      });
  }
back(){
  this.navCtrl.pop();
}
}
