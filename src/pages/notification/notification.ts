import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    // this.getnotifications();

  }
  eventdetail(){
    this.navCtrl.push('EventdetailPage');
  }
  // getnotifications() {
  //   let _base = this;
  //   let loader = this.loading.create({
  //     content: "Please wait..."
  //   });
  //   loader.present();
  //   _base.store.getNotifications(localStorage.getItem('userId'))
  //     .then(function (success: any) {
  //       loader.dismiss();
  //       _base.notifications = success.result;
  //     }, function (error) {
  //       console.log(error);
  //       loader.dismiss();
  //     });
  // }


  // viewNotification(notificationId, seen) {
  //   let _base = this;
  //   if (seen) {
  //     return;
  //   }
  //   let loader = this.loading.create({
  //     content: "Please wait..."
  //   });
  //   loader.present();
  //   _base.store.viewNotification(notificationId)
  //     .then(function (success: any) {
  //       loader.dismiss();
  //       _base.getnotifications();
  //     }, function (error) {
  //       console.log(error);
  //       loader.dismiss();
  //     });
  // }
}
