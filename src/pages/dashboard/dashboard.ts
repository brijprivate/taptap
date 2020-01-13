import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
// import { ProfilePage } from '../profile/profile';
// import { SearchPage } from '../search/search';
// import { TaptapPage } from '../taptap/taptap';
// import { HelpPage } from '../help/help';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profilePage = 'ProfilePage';
  // searchPage = 'SearchPage';
  TapmodalPage = 'TapmodalPage';

  taptapPage = 'TaptapPage';
  // taptapPage='Favourite';
  helpPage = 'HelpPage';
  morePage = 'MorePage';
  homePage = 'HomePage';

  public userId: any;
  public userName: any;
  public sharedata: any = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider) {
    this.sharedata = navParams.data;
    
    if (Object.keys(this.sharedata).length != 0) {
      this.navCtrl.push("TapdetailsPage", this.sharedata)
    }
  }

  readTag() {
    this.navCtrl.push('TapmodalPage');
  }
}
