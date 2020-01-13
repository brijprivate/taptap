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
    
  }
  back() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    
  }
  //call 
  callNumber(number){
    window.open("tel:"+number);
  }
  // email....
  emailto(email){
    window.open("mailto:"+email);
  }
}
