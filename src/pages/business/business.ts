import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

/**
 * Generated class for the BusinessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-business',
  templateUrl: 'business.html',
})
export class BusinessPage {

  public business: any = {};
  public permission: any = "";
  public milage: any = false;
  public timer: any = false;


  constructor(public http: NfctagProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.business = this.navParams.data;
    console.log(typeof this.business.user)
    this.permission = this.getPermission(this.business.user)
    console.log(this.permission)
    if (this.permission == 'all') {
      this.milage = true;
      this.timer = true
    } else if (this.permission == 'timer') {
      this.milage = false;
      this.timer = true
    } else if (this.permission == 'milage') {
      this.milage = true;
      this.timer = false
    }
    console.log(this.milage, this.timer)
  }

  back() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessPage');
  }

  getPermission(users: any) {
    console.log(users)
    let permission = "";
    permission = users.permission;
    return permission;
  }

  savePermission() {
    console.log(this.timer, this.milage);
    if (this.timer == false && this.milage == false) {
      alert("You can not revoke the permission completely")
      this.permission = this.getPermission(this.business.user)
      if (this.permission == 'all') {
        this.milage = true;
        this.timer = true
      } else if (this.permission == 'timer') {
        this.milage = false;
        this.timer = true
      } else {
        this.milage = true;
        this.timer = false
      }
      return;
    }

    if (this.timer == true && this.milage == true) {
      this.permission = "all"
    }
    if (this.timer == true && this.milage == false) {
      this.permission = "timer"
    }
    if (this.timer == false && this.milage == true) {
      this.permission = "milage"
    }

    let permission = {
      businessId: this.business._id,
      userUid: localStorage.getItem("uid"),
      status: "confirmed",
      permission: this.permission
    }

    let _base = this;
    _base.http.updatePermission(permission)
      .then(function (success) {
        alert("permission updated")
      }, function (error) {

      })

  }

  deleteBusiness() {
    let _base = this;
    let data = {
      businessId: _base.business._id,
      userUid: localStorage.getItem('uid')
    }
    _base.http.removebusiness(data)
      .then(function (success) {
        _base.navCtrl.pop()
      }, function (error) {

      });
  }
}
