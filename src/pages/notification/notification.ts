import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

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

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  constructor(public nfctagpro: NfctagProvider, public navCtrl: NavController, public navParams: NavParams, ) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad NotificationPage');
    this.getnotifications();

  }

  eventdetail(productId: String, type: String, notificationId: String, seen: Boolean) {
    if (type == 'Business' || type == 'Event') {
      this.navCtrl.push('EventdetailPage', { productId: productId, type: type, notificationId: notificationId, seen: seen });
    }
  }

  getnotifications() {
    let _base = this;
    _base.nfctagpro.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        let lastcreateddate = "";
        _base.notifications = success.result.map((item) => {
          let createddate = item.createdDate.split("T")[0]
          let obj: any = item;
          if (lastcreateddate != createddate) {
            lastcreateddate = createddate
            let d = new Date(createddate)
            obj.date = d.getDate() + ' ' + _base.monthNames[d.getMonth() + 1] + ', ' + d.getFullYear()
          }
          return obj
        });
      }, function (error) {
        console.log(error);
      });
  }

  viewNotification(notificationID: String) {
    let _base = this;
    _base.nfctagpro.viewNotification(notificationID)
      .then(function (sucess) {
        _base.getnotifications()
      }, function (error) {

      })
  }
  back(){
    this.navCtrl.pop()
  }
}
