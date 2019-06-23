import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {
  alllist:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
    this.getuserslist();
  }
  back() {
    this.navCtrl.pop();
  }


  getuserslist() {
    let _base = this;
    let date = new Date()
    let dateString = date.toISOString()
    this.loginsignupProvider.getuserslist().then(function (success: any) {
    
      _base.alllist = success.result.length;
      console.log(_base.alllist);
    }, function (err) {
      console.log(err);
    })
  }
}
