import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the Feed3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed3',
  templateUrl: 'feed3.html',
})
export class Feed3Page {
  slideselected: string='discount';
  @ViewChild('slider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Feed3Page');
  }
  selectedTab(index) {

    this.slideselected = (this.slideselected == 'discount') ? "feeds" : "discount";
    this.slider.slideTo(index);

  }
  slideChanged() {
    this.slideselected = (this.slideselected == 'discount') ? "feeds" : "discount";
  }
}
