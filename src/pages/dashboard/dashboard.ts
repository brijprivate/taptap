import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  profilePage= 'ProfilePage';
  searchPage='SearchPage';
  taptapPage='TaptapPage';
  helpPage='HelpPage';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

}
