import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

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
    private app: App) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad MorePage');
    this.getnotifications()
  }

  Logout() {
    localStorage.clear();
    this.app.getRootNav().setRoot("LoginPage");
  }
  goto(x) {
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
