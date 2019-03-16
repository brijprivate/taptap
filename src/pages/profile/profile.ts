import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { PairdevicePage } from '../pairdevice/pairdevice';
// import { ManagedevicePage } from '../managedevice/managedevice';
// import { RecordmilagePage } from '../recordmilage/recordmilage';
// import { RecordtimePage } from '../recordtime/recordtime';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  pairDevice(){
    this.navCtrl.setRoot('PairdevicePage');
  }
  manageDevice(){
    this.navCtrl.push('ManagedevicePage');
  }
  recordMilage(){
    this.navCtrl.push('RecordmilagePage');
  }
  recordTime(){
    this.navCtrl.push('RecordtimePage');  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
