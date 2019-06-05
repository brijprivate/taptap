import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

/**
 * Generated class for the MilagelistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-milagelist',
  templateUrl: 'milagelist.html',
})
export class MilagelistPage {
  milagelist=[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loginsignpro:LoginsignupProvider)
    {
      this.getMilageList();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MilagelistPage');
  }

  getMilageList(){
    let _base = this;
    this.loginsignpro.getmilage(localStorage.getItem("userId")).then(function(success:any){
      console.log(success);
      _base.milagelist = success.result;
    },function(err){
      console.log(err);
    })
  }

}
