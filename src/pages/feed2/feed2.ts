import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Feed2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed2',
  templateUrl: 'feed2.html',
})
export class Feed2Page {
  feed1data:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.feed1data=this.navParams.get('feed');
    console.log(this.feed1data)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Feed2Page');
  }
  back() {
    this.navCtrl.pop();
  }
}
