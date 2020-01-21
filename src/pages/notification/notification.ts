import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Storage } from '@ionic/storage';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  notifications: any = [];
  shownnotification: any = [];

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  constructor(public toastCtrl: ToastController, public sharedservice: SharedserviceProvider, public storage: Storage, public nfctagpro: NfctagProvider, public navCtrl: NavController, public navParams: NavParams, ) {
    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {
        _base.getnotifications(response.notifications)
      })
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }

  eventdetail(productId: String, type: String, notificationId: String, seen: Boolean) {
    if (type == 'Business' || type == 'Event') {
      this.navCtrl.push('EventdetailPage', { productId: productId, type: type, notificationId: notificationId, seen: seen });
    }
  }

  getnotifications(notifications) {
    let _base = this;
    let lastcreateddate = "";
    _base.notifications = notifications.map((item) => {
      let createddate = item.createdDate.split("T")[0]
      let obj: any = item;
      if (lastcreateddate != createddate) {
        lastcreateddate = createddate
        let d = new Date(createddate)
        obj.date = d.getDate() + ' ' + _base.monthNames[d.getMonth() + 1] + ', ' + d.getFullYear()
      }
      return obj
    });
    _base.shownnotification = _base.notifications.slice(0, 10)
  }

  viewNotification(notificationID: String, geo) {
    let _base = this;
    _base.nfctagpro.viewNotification(notificationID)
      .then(function (sucess) {
        _base.sharedservice.triggerNotification(true)
      }, function (error) {
      })
    if (geo) {
      _base.navCtrl.push('MapsPage', geo)
    } else {
      _base.presentToast('This notification does not contain location')
    }
  }

  clearNotification() {
    let _base = this;
    _base.nfctagpro.clearNotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        // _base.presentToast('Notifications will be removed shortly in a moment')
        _base.sharedservice.triggerNotification(true)
      }, function (error) {

      })
  }


  back() {
    this.navCtrl.pop()
  }
}
