import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfiledetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profiledetail',
  templateUrl: 'profiledetail.html',
})
export class ProfiledetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  gotoedit(){
    this.navCtrl.push('EditprofilePage');
  }
  changepass(){
    // this.navCtrl.push('ChangepasswordPage');
    this.navCtrl.push('ActionlistPage')
  }
  back() {
    this.navCtrl.pop();
  }
}
