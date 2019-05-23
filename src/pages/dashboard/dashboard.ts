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
  profilePage= 'ProfilePage';
  searchPage='SearchPage';
  taptapPage='TaptapPage';
  helpPage='HelpPage';
  morePage = 'MorePage';
  homePage=HomePage;

  public userId:any;
  public userName:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loginsignupProvider:LoginsignupProvider) 
    {
      this.userId = localStorage.getItem("userId");
      if(this.userId){
        this.getprofiledata();
      }
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

    //Get profile data...
    getprofiledata(){
      let _base = this;
      this.loginsignupProvider.getProfile(this.userId).then(function(success:any){
        console.log(success);
        if(success){
          _base.userName = success.result.name;
        }
      },function(err){
        console.log(err);
      })
    }
}
