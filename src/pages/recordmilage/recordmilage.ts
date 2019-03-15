import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SavemilagePage } from '../savemilage/savemilage';

/**
 * Generated class for the RecordmilagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recordmilage',
  templateUrl: 'recordmilage.html',
})
export class RecordmilagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  saveMilage(){
    this.navCtrl.setRoot(SavemilagePage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordmilagePage');
  }

}
