import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { SharedserviceProvider } from './../../providers/sharedservice/sharedservice';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TaptapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-taptap',
  templateUrl: 'taptap.html',
})
export class TaptapPage {
  @ViewChild('slides') slider: Slides;
  @ViewChild('slider') slider_tab: Slides;


  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthName = "";
  year: String = "2020";
  load: boolean = false;

  public tapItems: any = [];
  public shownItems: any = [];
  public userId: any;
  public ifmerchant: boolean = false;
  public date: String = "";
  public str: String = "";
  public isdata: boolean = false;
  public page = ''
  searchcount: any = 0;
  keyboards: boolean = false;
  constructor(public navCtrl: NavController,
    public loginsignupProvider: LoginsignupProvider,
    public sharedservice: SharedserviceProvider,
    private storage: Storage
  ) {
    this.userId = localStorage.getItem("userId");
    this.page = 'category';

    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {

        if (Object.keys(response).length != 0) {
          _base._showfavourite(response.favourites, response.favcount);
        }
      })
  }

  _showfavourite(favlist, favcount) {
    console.log(favlist)
    this.searchcount = favcount;
    this.tapItems = favlist;
    this.shownItems = favlist.slice(0, 10)
    if (this.tapItems.length == 0) {
      this.isdata = true
    } else {
      this.isdata = false;
    }
  }


  selectedTab(index) {
    this.page = (this.page == 'category') ? "marchent" : "category";
    this.slider_tab.slideTo(index);
    this.storage.remove("selectedFavouriteTab")
    this.storage.set("selectedFavouriteTab", index)
  }

  next() {
    this.slider.slideNext();
  }
  prev() {
    this.slider.slidePrev();
  }


  // for category...
  category() {
    this.ifmerchant = false;
  }

  //Go to details page ....
  gotodetails(item) {
    if (item.purpose == "lost") {
      this.navCtrl.push('LostcardPage', { lostinfo: item.deviceInfo.contact_info });
      // 
    } else if (item.purpose == "Contact_info") {
      // this.createTap(item);
      this.navCtrl.push('TapdetailsPage', { devicedetaill: item, key: 'device' });
    }
    else {
      // 
      this.navCtrl.push('TapdetailsPage', item);
    }
  }


  slide(count: number) {
    for (let i = 1; i <= count - 2; i++) {
      this.slider.slideNext();
    }
  }
  slideChanged() {
    this.page = (this.page == 'category') ? "marchent" : "category";
    // 
  }
}