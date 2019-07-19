import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(private googlePlus: GooglePlus
    , public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }
  back() {
    this.navCtrl.pop();
  }
  emailto(email) {
    window.open("mailto:" + email);
  }
  website(url) {
    window.open(url, "_system")
  }

  showsh1() {
    console.log("Clicked on google login")
    this.googlePlus.getSigningCertificateFingerprint()
      .then(function (success) {
        alert(success)
      }, function (error) {
        alert(error)
      });
  }
}
