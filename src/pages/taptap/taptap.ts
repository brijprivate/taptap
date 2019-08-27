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
  year: String = "2019";
  load: boolean = false;

  public tapItems: any;
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
    private storage: Storage
  ) {
    this.userId = localStorage.getItem("userId");

    this.page = 'category';
    // this.keyboard.onKeyboardShow().subscribe(() => {
    //   console.log("onKeyboardShow");
    // });

  }
  blur() {
    this.keyboards = false;
  }
  focus() {
    this.keyboards = true;
  }
  ionViewDidEnter() {
    // console.log("wowowowowoowowowowowowoow");
    this.load == false;
    let _base = this;
    if (this.userId) {
      // this.getAllTapItem();
      _base.storage.get('favourite_month')
        .then(function (month) {
          console.log(month)
          if (month) {
            if (month != 'all') {
              _base.getmonth(month, 1)
            } else {
              _base.getmonth(null, 1)
            }
          } else {
            _base.getmonth(null, 1)
          }
        })

      _base.storage.get("selectedFavouriteTab")
        .then(function (index) {
          if (index) {
            _base.slider_tab.slideTo(index)
            _base.page = (index == 1) ? "marchent" : "category";
          }
        })
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchPage');
  }
  selectedTab(index) {
    this.page = (this.page == 'category') ? "marchent" : "category";

    // if(index==0){
    //   this.page='category'
    // }
    // if(index==1){
    //   this.page='marchent'
    // }
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

  //get all tap items....
  getAllTapItem() {
    let _base = this;
    let date = new Date()
    let dateString = date.toISOString()
    // this.loginsignupProvider.getusermonthlytaps(this.userId, dateString).then(function (success: any) {
    //   console.log("All Tapped data ,..........>>>>>");
    //   // console.log(success.result.length);
    //   _base.tapItems = success.result;
    //   console.log(_base.tapItems);
    // }, function (err) {
    //   console.log(err);
    // })
  }

  //for merchant...
  merchant() {

    let _base = this;
    this.ifmerchant = true;

    // console.log("favouriteTaps", _base.storage.get('favouriteTaps'))

    _base.storage.get('favouriteTaps')
      .then(function (success) {

        if (success) {
          let lastcreateddate = "";
          _base.tapItems = success.map((item) => {
            let obj: any = {};
            let createddate = item.createdDate.split("T")[0]
            // console.log(createddate, lastcreateddate)
            if (lastcreateddate != createddate) {
              // console.log("here")
              lastcreateddate = createddate
              obj.date = createddate
            }
            Object.assign(obj, item)
            return obj
          });
          _base.searchcount = _base.tapItems.length
          // console.log("=============================", _base.tapItems);
          if (_base.tapItems.length == 0) {
            _base.isdata = true;
          } else {
            _base.isdata = false;
          }
        }
      })

    this.loginsignupProvider.searchfavourite(this.userId, this.date, this.str).then(function (success: any) {
      // console.log("All Tapped data merchant,..........>>>>>");
      // console.log(success.result.length);
      _base.storage.remove("favouriteTaps")
      _base.storage.set("favouriteTaps", success.result)
      let lastcreateddate = "";
      _base.tapItems = success.result.map((item) => {
        let obj: any = {};
        let createddate = item.createdDate.split("T")[0]
        // console.log(createddate, lastcreateddate)
        if (lastcreateddate != createddate) {
          // console.log("here")
          lastcreateddate = createddate
          obj.date = createddate
        }
        Object.assign(obj, item)
        return obj
      });
      _base.searchcount = _base.tapItems.length
      // console.log("=============================", _base.tapItems);
      if (_base.tapItems.length == 0) {
        _base.isdata = true;
      } else {
        _base.isdata = false;
      }
    }, function (err) {
      // console.log(err);
      _base.storage.get('favouriteTaps')
        .then(function (success) {

          if (success) {
            let lastcreateddate = "";
            _base.tapItems = success.map((item) => {
              let obj: any = {};
              let createddate = item.createdDate.split("T")[0]
              // console.log(createddate, lastcreateddate)
              if (lastcreateddate != createddate) {
                // console.log("here")
                lastcreateddate = createddate
                obj.date = createddate
              }
              Object.assign(obj, item)
              return obj
            });
            _base.searchcount = _base.tapItems.length
            // console.log("=============================", _base.tapItems);
            if (_base.tapItems.length == 0) {
              _base.isdata = true;
            } else {
              _base.isdata = false;
            }
          }
        })
    })
  }

  // for category...
  category() {
    this.ifmerchant = false;

  }
  //Go to details page ....
  gotodetails(item) {
    if (item.purpose == "lost") {
      this.navCtrl.push('LostcardPage', { lostinfo: item.deviceInfo.contact_info });
      // console.log(item);
    } else if (item.purpose == "Contact_info") {
      // this.createTap(item);
      this.navCtrl.push('TapdetailsPage', { devicedetail: item.deviceInfo, key: 'device' });
    }
    else {
      // console.log("=====================", item);
      this.navCtrl.push('TapdetailsPage', item);
    }
  }

  getmonth(month: string, from: any) {
    let _base = this;
    console.log("Month", month)

    if (month == null) {
      console.log("Here")
      // let date = new Date()
      // month = (date.getMonth() + 1).toString()

      _base.storage.get('favourite_month')
        .then(function (success) {
          if (success) {

            console.log(success)

            if (success != 'all') {
              // (<HTMLElement>document.getElementById(month)).click()
            } else if (success == 'all') {
              _base.merchant()
            }

          } else {

            let date = new Date()
            month = (date.getMonth() + 1 + 20).toString()

            _base.monthName = _base.monthNames[parseInt(month) - 21]

            console.log("MonthName", _base.monthName)
            console.log("Month", month)

            _base.markactive(month, null)

            if (_base.load == false) {
              _base.slide(parseInt(month) - 20)
              _base.load = true
            }

          }
        })

    } else {
      console.log("There")
      _base.monthName = _base.monthNames[parseInt(month) - 21]

      console.log("MonthName", _base.monthName)
      console.log("Month", month)

      _base.markactive(month, from)

      if (_base.load == false) {
        _base.slide(parseInt(month) - 20)
        _base.load = true
      }
    }


    // setTimeout(function () {
    //   (<HTMLButtonElement>document.getElementById("category")).click()
    // }, 1000);

    let year = this.year;
  }

  markactive(month: string, from: any) {
    let _base = this
    let isactive = (<HTMLElement>document.getElementById(month)).classList.contains("active")
    console.log("active", isactive)
    for (let i = 21; i <= 32; i++) {
      let element = <HTMLElement>document.getElementById(i.toString())
      console.log(element)
      element.className = element.className.replace(" active", "");
      if (i == 32) {
        let activeelement = <HTMLElement>document.getElementById(month)
        if (!isactive) {
          let date = new Date((parseInt(month) - 20).toString() + '/' + '15/' + this.year)
          let isoDate = date.toISOString();
          this.date = isoDate
          activeelement.className = activeelement.className + " active"
          _base.storage.remove("favourite_month")
          _base.storage.set("favourite_month", month)
          _base.merchant()
        } else {
          console.log("here")
          if (from != null) {
            let date = new Date((parseInt(month) - 20).toString()  + '/' + '15/' + this.year)
            let isoDate = date.toISOString();
            this.date = isoDate
            activeelement.className = activeelement.className + " active"
            _base.storage.remove("favourite_month")
            _base.storage.set("favourite_month", month)
            _base.merchant()
          } else {
            this.date = ""
            _base.storage.remove("favourite_month")
            _base.storage.set("favourite_month", "all")
            _base.merchant()
          }
        }
      }
    }
  }

  slide(count: number) {
    for (let i = 1; i <= count - 2; i++) {
      this.slider.slideNext();
    }
  }
  slideChanged() {
    // console.log(this.page)
    this.page = (this.page == 'category') ? "marchent" : "category";
    // console.log(this.page)
  }
}