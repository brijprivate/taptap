import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';

/**
 * Generated class for the Feed1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed1',
  templateUrl: 'feed1.html',
})
export class Feed1Page {
  @ViewChild('slides') slider: Slides;
  @ViewChild('slider') slider_tab: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Feed1Page');
  }
  back() {
    this.navCtrl.pop();
  }
  goto(x){
    this.navCtrl.push('Feed2Page',{feed:x})
  }
}
