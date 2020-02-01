import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ArtPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-art',
  templateUrl: 'art.html',
})
export class ArtPage {
 public art:boolean=true;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtPage');
  }
  back(){ 
    console.log(this.art)
    this.art=!this.art
  }
  openURL(url) {
    window.open(url,'_system','location=yes');
}
goback(){
  this.navCtrl.pop()
}
}
