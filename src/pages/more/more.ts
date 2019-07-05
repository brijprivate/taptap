import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  notiCount = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nfctagpro: NfctagProvider,
    private app: App,
    public fb: Facebook,
    private googlePlus: GooglePlus,
    public alert: AlertController, ) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad MorePage');
    this.getnotifications()
  }

  Logout() {
    let _base = this

    let alert = this.alert.create({
      title: 'Are you sure want to logout',

      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            localStorage.clear();
            _base.googlePlus.logout()
            _base.fb.logout()
            this.app.getRootNav().setRoot("LoginPage");
          }
        }
      ]
    });
    alert.present();

  }
  goto(x) {
    if(x=='store'){
      window.open('https://www.gocubetech.shop/taptap',"_system");

      return;
    }
    this.navCtrl.push(x)
  }

  getnotifications() {
    let _base = this;
    _base.notiCount = 0;
    _base.nfctagpro.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        console.log("Notifications", success)
        success.result.forEach(item => {
          if (item.seen == false) {
            _base.notiCount = _base.notiCount + 1
          }
        });
      }, function (error) {
        console.log(error)
      });
  }
}
