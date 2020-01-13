import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

/**
 * Generated class for the FeedpopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedpopup',
  templateUrl: 'feedpopup.html',
})
export class FeedpopupPage {
  counter = 5;
  feed: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController, public renderer: Renderer, public viewCtrl: ViewController, ) {
    let _base = this;
    // 
    _base.feed = this.navParams.data;
    setTimeout(() => {
      _base.renderer.setElementClass(_base.viewCtrl.pageRef().nativeElement, 'feed-popup', true);
    }, 10);
  }

  goto() {
    let _base = this;
    // clearInterval(x);
    _base.viewCtrl.dismiss({});
    this.navCtrl.push('Feed2Page', { feed: this.feed })
  }

  ionViewDidLoad() {
    
    let _base = this;
    var x = setInterval(() => {
      _base.counter = _base.counter - 1;;
      if (_base.counter == 0) {
        clearInterval(x);
        _base.viewCtrl.dismiss({});
      }
    }, 1000);
  }

}
