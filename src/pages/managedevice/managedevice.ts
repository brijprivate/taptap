import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the ManagedevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-managedevice',
  templateUrl: 'managedevice.html',
})
export class ManagedevicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  backProfile(){
    this.navCtrl.setRoot(ProfilePage);

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ManagedevicePage');
  }

}
