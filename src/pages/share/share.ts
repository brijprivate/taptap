import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

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
  alllist: any = 0;
  constructor(public sharedservice: SharedserviceProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    private socialsharing: SocialSharing
  ) {
    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {
        _base.alllist = response.user_count;
      })
  }

  // http://onelink.to/pxu5ar

  ionViewDidLoad() {
    
    // this.getuserslist();
  }
  back() {
    this.navCtrl.pop();
  }

  socialshare() {
    let link = "http://onelink.to/pxu5ar"
    this.socialsharing.share(link).then(() => {
      alert("Thank your for sharing TapTap.")
    }).catch(() => {

    })
  }
}
