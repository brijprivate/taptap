import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ActionlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-actionlist',
  templateUrl: 'actionlist.html',
})
export class ActionlistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActionlistPage');
  }
  changepass(){
    this.navCtrl.push('ChangepasswordPage');
  }
  back() {
    this.navCtrl.pop();
  }
}
