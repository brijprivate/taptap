import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  dashboard(){
    console.log("hi");
    this.navCtrl.setRoot('DashboardPage');
  }
  verifyOtp(){
    this.navCtrl.push('VerifyotpPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  login(){
    this.navCtrl.push('LoginPage')
  }
}
