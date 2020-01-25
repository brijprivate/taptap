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

  public scrollCount: any = 1;

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
    this.slider_tab.slideTo(index);
  }



  //Go to details page ....
  gotodetails(item) {
    
    if (item.purpose == "lost") {
      this.navCtrl.push('LostcardPage', { lostinfo: item.deviceInfo.contact_info });
    } else if (item.purpose == "Contact_info") {
      this.navCtrl.push('TapdetailsPage', { devicedetaill: item, key: 'device' });
    }
    else {
      this.navCtrl.push('TapdetailsPage', item);
    }
  }

  slideChanged($event) {
    this.page = ($event.realIndex == 1) ? "marchent" : "category";
    this.destroyScrollSubscriber();
    if (document.getElementById('category_scroll')) {
      this.scrollCategorySubscriber();
      this.scrollMarchantSubscriber();
    }
  }


  scrollCategorySubscriber() {

    let _base = this;
    let length = this.tapItems.length;
    let slice_end = length >= 10 ? 10 : length - 1
    this.shownItems = this.tapItems.slice(0, slice_end)
    document.querySelectorAll("#category_scroll")[0].scrollTop = 0;
    document.querySelectorAll("#category_scroll")[0].addEventListener(
      'scroll',
      function () {
        let scrollTop = document.querySelectorAll("#category_scroll")[0].scrollTop;
        let scrollHeight = document.querySelectorAll("#category_scroll")[0].scrollHeight; // added
        let offsetHeight = (<HTMLElement>document.querySelectorAll("#category_scroll")[0]).offsetHeight;
        // var clientHeight = document.getElementById('box').clientHeight;
        let contentHeight = scrollHeight - offsetHeight; // added
        if (contentHeight <= scrollTop + 50) // modified
        {
          // Now this is called when scroll end!
          if (_base.scrollCount < _base.tapItems.length / 10) {
            let slength = _base.shownItems.length;
            let tlength = _base.tapItems.length;
            let difference = tlength - slength;
            let slice_start = _base.scrollCount * 10;
            let slice_end = 0;
            if (difference < 10) {
              slice_end = slice_start + difference
            } else {
              slice_end = slice_start + 10
            }
            _base.shownItems = _base.tapItems.slice(0, slice_end)
            _base.scrollCount = _base.scrollCount + 1;
            // document.getElementById('scroll').scrollTop = 0
          }
        }
      },
      false
    )
  }

  scrollMarchantSubscriber() {

    let _base = this;
    let length = this.tapItems.length;
    let slice_end = length >= 10 ? 10 : length
    this.shownItems = this.tapItems.slice(0, slice_end)
    document.querySelectorAll("#marchant_scroll")[0].scrollTop = 0;
    document.querySelectorAll("#marchant_scroll")[0].addEventListener(
      'scroll',
      function () {
        let scrollTop = document.querySelectorAll("#marchant_scroll")[0].scrollTop;
        let scrollHeight = document.querySelectorAll("#marchant_scroll")[0].scrollHeight; // added
        let offsetHeight = (<HTMLElement>document.querySelectorAll("#marchant_scroll")[0]).offsetHeight;
        // var clientHeight = document.getElementById('box').clientHeight;
        let contentHeight = scrollHeight - offsetHeight; // added
        if (contentHeight <= scrollTop + 50) // modified
        {
          // Now this is called when scroll end!
          if (_base.scrollCount < _base.tapItems.length / 10) {
            let slength = _base.shownItems.length;
            let tlength = _base.tapItems.length;
            let difference = tlength - slength;
            let slice_start = _base.scrollCount * 10;
            let slice_end = 0;
            if (difference < 10) {
              slice_end = slice_start + difference
            } else {
              slice_end = slice_start + 10
            }
            _base.shownItems = _base.tapItems.slice(0, slice_end)
            _base.scrollCount = _base.scrollCount + 1;
            // document.getElementById('scroll').scrollTop = 0
          }
        }
      },
      false
    )
  }

  destroyScrollSubscriber() {

    let length = this.tapItems.length;
    let slice_end = length >= 10 ? 10 : length
    this.shownItems = this.tapItems.slice(0, slice_end)
    document.querySelectorAll("#category_scroll")[0].scrollTop = 0;
    document.querySelectorAll("#category_scroll")[0].removeEventListener('scroll', function () { }, true)
    document.querySelectorAll("#marchant_scroll")[0].scrollTop = 0;
    document.querySelectorAll("#marchant_scroll")[0].removeEventListener('scroll', function () { }, true)
    this.scrollCount = 1;
  }

  ionViewDidEnter() {

    if (document.getElementById('category_scroll')) {
      this.scrollCategorySubscriber();
      this.scrollMarchantSubscriber();
    }
  }

  ionViewDidLeave() {

    if (document.getElementById('category_scroll')) {
      this.destroyScrollSubscriber()
    }
  }
}