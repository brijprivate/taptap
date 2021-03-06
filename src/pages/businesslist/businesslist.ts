import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

/**
 * Generated class for the BusinesslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-businesslist',
  templateUrl: 'businesslist.html',
})
export class BusinesslistPage {

  public businessList: any = [];
  public business: any = {};

  constructor(public http: NfctagProvider, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidEnter() {
    
    this.getBusinesses();
  }
  goPage(business: any) {
    this.navCtrl.push('BusinessPage', business)
  }

  back() {
    this.navCtrl.pop()
  }

  getBusinesses() {
    let _base = this;
    _base.http.getbusinesses(localStorage.getItem('userId'))
      .then(function (success: any) {
        _base.businessList = success.result.map((business) => {
          
          
          business.imageId = (business.logo) ? 'https://api.thingtap.com/file/getImage?imageId=' + business.logo : '../../assets/images/Logo_after.png'
          return business;
        });
      }, function (error) {
        
      });
  }
}
