import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, ModalOptions } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Storage } from '@ionic/storage';
import { get } from 'scriptjs';
import { Socket } from 'ng-socket-io';

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
    public socket: Socket,
    public storage: Storage,
    public alert: AlertController, public modalController: ModalController) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad MorePage');
    this.getnotifications()
  }

  ionViewDidLoad() {
    this.loadGoogle()
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
            _base.storage.clear();
            this.app.getRootNav().setRoot("LoginPage");
            _base.socket.disconnect()
            _base.socket.removeAllListeners()
          }
        }
      ]
    });
    alert.present();

  }
  goto(x) {
    if (x == 'store') {
      window.open('https://www.gocubetech.shop/taptap', "_system");

      return;
    }
    this.navCtrl.push(x)
  }

  getnotifications() {
    let _base = this;
    _base.notiCount = 0;

    _base.storage.get("notifications")
      .then(function (success) {
        if (success) {
          success.forEach(item => {
            if (item.seen == false) {
              _base.notiCount = _base.notiCount + 1
            }
          });
        }
      })


    _base.nfctagpro.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        console.log("Notifications", success)
        _base.storage.remove("notifications")
        _base.storage.set("notifications", success.result)
        _base.notiCount = 0;
        success.result.forEach(item => {
          if (item.seen == false) {
            _base.notiCount = _base.notiCount + 1
          }
        });
      }, function (error) {
        console.log(error)
        _base.storage.get("notifications")
          .then(function (success) {
            if (success) {
              _base.notiCount = 0;

              success.forEach(item => {
                if (item.seen == false) {
                  _base.notiCount = _base.notiCount + 1
                }
              });
            }
          })
      });
  }

  loadGoogle() {
    get("https://maps.googleapis.com/maps/api/js?key=AIzaSyCAUo5wLQ1660_fFrymXUmCgPLaTwdXUgY&libraries=drawing,places,geometry,visualization", () => {
      //Google Maps library has been loaded...
      console.log("Google maps library has been loaded");
    });
  }





  showLoginModal() {

    let modal = this.modalController.create("FeedpopupPage", {}, { showBackdrop: true, enableBackdropDismiss: true });
    modal.present();
  }
}
