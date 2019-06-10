import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

/**
 * Generated class for the EventdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eventdetail',
  templateUrl: 'eventdetail.html',
})
export class EventdetailPage {

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  public product: any = {

  }

  public type: String = "";
  public seen: boolean;
  public notificationId = ""
  sdate: string;
  stime: any;
  edate: string;
  etime: any;

  constructor(public http: NfctagProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.product = this.navParams.data.productId
    this.type = this.navParams.data.type
    this.seen = this.navParams.data.seen
    this.notificationId = this.navParams.data.notificationId

    if (this.type == 'Event') {
      let s = new Date(this.product.startTime)
      this.sdate = + s.getDate() + ' ' + this.monthNames[s.getMonth() + 1] + ', ' + s.getFullYear()
      this.stime = this.product.startTime.split("T")[1].split("Z")[0]
      let e = new Date(this.product.endTime)
      this.edate = e.getDate() + ' ' + this.monthNames[s.getMonth() + 1] + ', ' + e.getFullYear()
      this.etime = this.product.endTime.split("T")[1].split("Z")[0]
      this.product.image = this.product.imageId
    } else {
      this.product.image = this.product.logo
    }

    console.log(this.navParams.data)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventdetailPage');
    let _base = this;

    if (_base.type == 'Event')
      _base.http.viewNotification(_base.notificationId)
        .then(function (sucess) {
          // alert("permission updated")
          _base.navCtrl.pop()
        }, function (error) {

        })
  }

  acceptInvitation(status: String) {

    let permission = {
      businessId: this.product._id._id,
      userUid: localStorage.getItem("uid"),
      status: status,
      permission: "all"
    }

    let _base = this;
    _base.http.updatePermission(permission)
      .then(function (success) {

        _base.http.viewNotification(_base.notificationId)
          .then(function (sucess) {
            alert("permission updated")
            _base.navCtrl.pop()
          }, function (error) {

          })
      }, function (error) {

      })

  }

  viewNotification(notificationID: String) {
    let _base = this;
    _base.http.viewNotification(notificationID)
      .then(function (sucess) {
      }, function (error) {

      })
  }

}
