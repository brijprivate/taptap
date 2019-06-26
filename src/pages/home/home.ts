import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { NavController, Slides, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Subscription } from 'rxjs/Rx';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { isBlank } from 'ionic-angular/umd/util/util';
// import { Diagnostic } from '@ionic-native/diagnostic';
declare var anychart;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mySlideOptions = {
    initialSlide: 1,
    loop: true
  };
  public images: any;
  API_URL = "http://ec2-18-225-10-142.us-east-2.compute.amazonaws.com:5450";

  @ViewChild('slider') slider: Slides;
  @ViewChild('slides') slides: Slides;
  page = 0;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  doughnutChart: any;
  barChart: any;

  public notiCount = 0;

  public userId: any;
  public userName: any;
  public uid: any = "";
  public blankmsg: String;
  public isblanck: boolean = false;

  public fashion = 0;
  public general = 0;
  public sports = 0;
  public contact = 0;
  public lost=0;
  public event: "0";
  public groceries: "0";
  public buisness: "0";
  public favourite: "0";
  public totalcount: "0";
  public todaysTap: "0";
  public tapItems: any;

  lineChart: any;

  public chart;
  public time = new Date();

  
  //NFC read related ....
  readingTag: boolean = false;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  public tapData: any;
  devicecount: any;
  profileImage: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    public nfc: NFC,
    public ndef: Ndef,
    public loading: LoadingController,
    public nfctagpro: NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert: AlertController,
    // private diagnostic: Diagnostic
  ) {
    var x = new Date().toTimeString().slice(0, 8);
    console.log(x);
    let cdate = new Date().toISOString();
    console.log(cdate);
    this.userId = localStorage.getItem("userId")
    console.log(this.userId);
    if (this.userId) {
      // this.getPermission();
      this.getprofiledata();
      // this.getDashboarddata();
      this.getpresentdateCount();
      this.getAllTapItem();
      this.getpairedDevice();
      this.getnotifications();
    }

  }

  ionViewDidEnter() {
    // this.chart.dispose();
    if (this.todaysTap)
      console.log("view enter--------------->>>>>>>>>>>");
    this.userId = localStorage.getItem("userId");
    if (this.userId) {
      this.getprofiledata();
      this.getDashboarddata();
      this.getpresentdateCount();
      this.getAllTapItem();
    }
    if (this.totalcount) {
      var _base = this;
    }
  }

  chartfunc() {
    let _base = this;
    anychart.onDocumentReady(function () {

     
        _base.chart = anychart.pie([
          { x: "Fashion", value: _base.fashion },
          { x: "General", value: _base.general },
          { x: "Event", value: _base.event },
          { x: "Contacts", value: _base.contact },
          { x: "Business", value: _base.buisness },
          { x: "Sports", value: _base.sports },
          { x: "Groceries", value: _base.groceries },
          { x: "Lost", value: _base.lost }
        ]);
      


      var label = anychart.standalones.label();


      // if(_base.isblanck==true){
      //   _base.chart.innerRadius("75%");
      //   label.text("No Tap Data");


      // }
      // else{
      //   _base.chart.innerRadius("25%");
      //   label.text("TapTap");

      // }
      _base.chart.innerRadius("25%");
      label.text("TapTap");
      label.width("100%");
      label.height("100%");
      label.adjustFontSize(true);
      label.fontColor("#60727b");
      label.hAlign("center");
      label.vAlign("middle");
      _base.chart.legend(false);

      // set the label as the center content
      _base.chart.center().content(label);

      // chart.title("Donut Chart: Label in the center");
      _base.chart.container("container");
      _base.chart.draw();

    });
  }
  ionViewDidLeave() {
    this.chart.dispose();
    // this.chartfunc(1);
  }
  selectedTab(index) {
    this.slider.slideTo(index);
  }
  merchant() {
    // this.navCtrl.push('MerchantPage');
  }
  category() {
    // this.navCtrl.push('CategoryPage');
  }
  next() {
    this.slides.slideNext();
  }
  prev() {
    this.slides.slidePrev();
  }
  ionViewDidLoad() {
    // this.chartfunc(0);

  }

  //Get profile data...
  getprofiledata() {
    let _base = this;
    this.loginsignupProvider.getProfile(this.userId).then(function (success: any) {
      console.log(success);
      if (success) {
        _base.userName = success.result.name;
        localStorage.setItem('uid', success.result.uid)
        _base.uid = success.result.uid
        if (success.result.imageId) {
          _base.profileImage = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id
        }
      }
    }, function (err) {
      console.log(err);
    })
  }

  //Tap on product....
  tapItem() {
    this.readingTag = true;
    this.navCtrl.push('TapmodalPage');
  }

  getDashboarddata() {
    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();

    this.loginsignupProvider.getDashboard(this.userId).then(function (success: any) {
      console.log("dashboard data ---------->>>>>>" + success);
      console.log(success);

      _base.fashion = success.result.fashion;
      _base.buisness = success.result.buisness;
      _base.contact = success.result.contact;
      _base.event = success.result.event;
      _base.general = success.result.general;
      _base.favourite = success.result.favourite;
      _base.sports = success.result.sport;
      _base.groceries = success.result.groceries;
      _base.lost = success.result.lost;
      _base.totalcount = success.result.totalTap;
      _base.chartfunc();
      loader.dismiss();
    }, function (err) {
      console.log(err);
    })
  }

  //get present date tap count....
  getpresentdateCount() {
    let _base = this;
    this.loginsignupProvider.getTapPresentDate(this.userId).then(function (success: any) {
      console.log(success.result);
      _base.todaysTap = success.result.length;

    }, function (err) {
      console.log(err);
    })
  }

  //get all tap items....
  getAllTapItem() {
    let _base = this;
    this.loginsignupProvider.getTapAll(this.userId).then(function (success: any) {
      console.log("All Tapped data ,..........>>>>>");
      // console.log(success.result.length);
      _base.tapItems = success.result;
      if (success.result.length == 0) {
        _base.isblanck = true;
        _base.blankmsg = "There Is No Tap Yet";
      }
      console.log(_base.tapItems);
    }, function (err) {
      console.log(err);
    })
  }

  //go to detail page ...
  gotoDetails(item) {
    if (item.purpose == "lost") {
      this.navCtrl.push('LostcardPage', { lostinfo: item.deviceInfo.contact_info });
      console.log(item);
    } else {
      console.log("=====================", item);
      this.navCtrl.push('TapdetailsPage', item);
    }

  }

  //go to edit profile page ...
  gotoedit() {
    this.navCtrl.push('EditprofilePage');
  }

  //Get paired devices...
  getpairedDevice() {
    let _base = this;
    this.nfctagpro.getpairdevice(this.userId).then(function (success: any) {
      console.log("paired devices--------------?>>>>>>>>>");
      console.log(success.result.length);
      // _base.devices = success.result;
      _base.devicecount = success.result.length;
    }, function (err) {
      console.log(err);
    })
  }

  getnotifications() {
    let _base = this;
    _base.notiCount = 0;
    _base.nfctagpro.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        console.log("Notifications", success)
        success.result.forEach(item => {
          if (item.seen == false) {
            _base.notiCount = _base.notiCount + 1
          }
        });
      }, function (error) {
        console.log(error)
      });
  }

  notifications() {
    this.navCtrl.push("NotificationPage")
  }

  //go to profiledetails page....
  detail() {
    this.navCtrl.push('ProfiledetailPage');
  }

  getPermission() {
    //   this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((status) => {
    //     console.log(`AuthorizationStatus`);
    //     console.log(status);
    //     if (status != this.diagnostic.permissionStatus.GRANTED) {
    //       this.diagnostic.requestRuntimePermission(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((data) => {
    //         console.log(`getCameraAuthorizationStatus`);
    //         console.log(data);
    //       })
    //     } else {
    //       console.log("We have the permission");
    //     }
    //   }, (statusError) => {
    //     console.log(`statusError`);
    //     console.log(statusError);
    //   });
  }
}
