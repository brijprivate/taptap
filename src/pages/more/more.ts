import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, ModalOptions } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Storage } from '@ionic/storage';
import { get } from 'scriptjs';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

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
    public storage: Storage,
    public sharedservice: SharedserviceProvider,
    public alert: AlertController, public modalController: ModalController) {
    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {
        _base.notiCount = response.noticount
      })
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

          }
        },
        {
          text: 'Yes',
          handler: data => {
            localStorage.clear();
            _base.storage.remove("app_state")
              .then(function () {
                _base.app.getRootNav().setRoot("LoginPage");
              });
          }
        }
      ]
    });
    alert.present();

  }
  goto(x) {
    if (x == 'store') {
      window.open('https://taptap.org.uk/shop', "_system");

      return;
    }
    if (x == 'HelpPage') {
      window.open('https://www.thingtap.com/help', "_system");

      return;
    }



    


    this.navCtrl.push(x)
  }





  showLoginModal() {

    let modal = this.modalController.create("FeedpopupPage", {}, { showBackdrop: true, enableBackdropDismiss: true });
    modal.present();
  }
}
