import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild('slides') slider: Slides;
  @ViewChild('slider1') slider1: Slides;


  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthName = "";
  year: String = "2019";

  public tapItems: any;
  public userId: any;
  public ifmerchant: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    public loading: LoadingController,
    private toast: ToastController,
    public alert: AlertController, ) {
    this.userId = localStorage.getItem("userId");

  }

  ionViewDidEnter() {
    console.log("wowowowowoowowowowowowoow");
    if (this.userId) {
      // this.getAllTapItem();
      this.getmonth(null)
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  selectedTab(index) {
    this.slider.slideTo(index);
  }
  next() {
    this.slider1.slideNext();
  }
  prev() {
    this.slider1.slidePrev();
  }

  //get all tap items....
  getAllTapItem() {
    let _base = this;
    let date = new Date()
    let dateString = date.toISOString()
    this.loginsignupProvider.getusermonthlytaps(this.userId, dateString).then(function (success: any) {
      console.log("All Tapped data ,..........>>>>>");
      // console.log(success.result.length);
      _base.tapItems = success.result;
      console.log(_base.tapItems);
    }, function (err) {
      console.log(err);
    })
  }

  //for merchant...
  merchant(dateString: String) {

    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    this.ifmerchant = true;
    // loader.dismiss();
    this.loginsignupProvider.getusermonthlytaps(this.userId, dateString).then(function (success: any) {
      console.log("All Tapped data merchant,..........>>>>>");
      // console.log(success.result.length);

      let lastcreateddate = "";
      _base.tapItems = success.result.map((item) => {
        let obj: any = {};
        let createddate = item.createdDate.split("T")[0]
        console.log(createddate, lastcreateddate)
        if (lastcreateddate != createddate) {
          console.log("here")
          lastcreateddate = createddate
          obj.date = createddate
        }
        Object.assign(obj, item)
        return obj
      });
      loader.dismiss();
      console.log("=============================", _base.tapItems);
    }, function (err) {
      loader.dismiss();
      console.log(err);
    })
  }

  // for category...
  category() {
    this.ifmerchant = false;

  }
  //Go to details page ....
  gotodetails(item) {
    // this.navCtrl.push('TapdetailsPage', { itemdetails: item });
  }

  getmonth(month: string) {
    let _base = this;
    if (month == null) {
      let date = new Date()
      month = (date.getMonth() + 1).toString()
    }

    _base.monthName = _base.monthNames[parseInt(month) - 1]

    _base.markactive(month)
    _base.slide(parseInt(month))

    setTimeout(function () {
      (<HTMLButtonElement>document.getElementById("category")).click()
    }, 3000);

    let year = this.year;
    let date = new Date(month + '/' + '15/' + this.year)
    let isoDate = date.toISOString();
    this.merchant(isoDate)
  }

  markactive(month: string) {
    for (let i = 1; i <= 12; i++) {
      let element = <HTMLElement>document.getElementById(i.toString())
      console.log(element)
      element.className = element.className.replace(" active", "");
      if (i == 12) {
        let activeelement = <HTMLElement>document.getElementById(month)
        activeelement.className = activeelement.className + " active"
      }
    }
  }

  slide(count: number) {
    for (let i = 1; i <= count - 2; i++) {
      this.slider.slideNext();
    }
  }

}
