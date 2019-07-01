import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { SocialSharing } from '@ionic-native/social-sharing';

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
  alllist: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    private socialsharing: SocialSharing
  ) {
  }

  // http://onelink.to/pxu5ar

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
    this.getuserslist();
  }
  back() {
    this.navCtrl.pop();
  }

  socialshare() {
    let link = "http://onelink.to/pxu5ar"
    this.socialsharing.share(link).then(() => {
      alert("Thank your for sharing TapTap")
    }).catch(() => {

    })
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
