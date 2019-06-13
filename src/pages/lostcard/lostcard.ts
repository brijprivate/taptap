import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LostcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lostcard',
  templateUrl: 'lostcard.html',
})
export class LostcardPage {
  public lostinformation:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
    this.lostinformation = navParams.get("lostinfo");
    console.log(this.lostinformation);
  }
  back() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LostcardPage');
  }

}
