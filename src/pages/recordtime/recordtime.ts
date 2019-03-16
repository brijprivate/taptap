import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { SaveTimePage } from '../save-time/save-time';

/**
 * Generated class for the RecordtimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recordtime',
  templateUrl: 'recordtime.html',
})
export class RecordtimePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  saveTime(){
    this.navCtrl.push('SaveTimePage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordtimePage');
  }

}
