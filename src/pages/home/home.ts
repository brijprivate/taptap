import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { NavController, Slides, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Subscription } from 'rxjs/Rx';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { isBlank } from 'ionic-angular/umd/util/util';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Storage } from '@ionic/storage';
import { ImageLoader } from 'ionic-image-loader';
import { toBase64String } from '@angular/compiler/src/output/source_map';
declare var Morris;
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
  API_URL = "https://api.taptap.org.uk";

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
  public lost = 0;
  public event: 0;
  public groceries: 0;
  public buisness: 0;
  public favourite: 0;
  public totalcount: 0;
  public todaysTap: 0;
  public tapItems: any;
  public allTapItems: any;
  public str: String = "";
  public usrnm: any;

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
  base4img: any;
  keyboards: boolean = false;
  slideselected: string;
  offline: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    public nfc: NFC,
    public ndef: Ndef,
    private androidPermissions: AndroidPermissions,
    public loading: LoadingController,
    public nfctagpro: NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert: AlertController,
    private storage: Storage,
    public imageLoader: ImageLoader
    // private diagnostic: Diagnostic
  ) {
    this.slideselected = 'home';

    var x = new Date().toTimeString().slice(0, 8);
    console.log(x);
    let cdate = new Date().toISOString();
    console.log(cdate);
    this.userId = localStorage.getItem("userId")
    console.log(this.userId);
    if (this.userId) {
      // this.getPermission();
      // this.getprofiledata();
      // this.getpresentdateCount();
      // this.getAllTapItem();
    }

  }
  ionViewWillLeave() {
    // this.chart.dispose();

  }


  blur() {
    this.keyboards = false;
  }
  focus() {
    this.keyboards = true;
  }


  ionViewDidEnter() {
    this.chartfunc()
    // this.chart.dispose();
    this.offline = false;
    console.log("view enter--------------->>>>>>>>>>>");
    this.userId = localStorage.getItem("userId");
    if (this.userId) {
      this.getprofiledata();
      this.getDashboarddata();
      this.getpresentdateCount();
      this.getAllTapItem();
      this.getpairedDevice();
      this.getnotifications();
    }
    if (this.totalcount) {
      var _base = this;
    }
  }

  chartfunc() {
    let _base = this;
    setTimeout(() => {

      (<HTMLElement>document.getElementById('donut-example')).innerHTML = "";

      Morris.Donut({
        element: 'donut-example',
        resize: true,
        formatter: function (y, data) { console.log(y, data); return '' + y },
        colors:["#bd86b6","#8769d7","#ef95c8","#80a09d","#8baeec","#d98136","#DA4567","#EC407A"],
        data: [
          { label: "Fashion", value: _base.fashion},
          { label: "General", value: _base.general},
          { label: "Event", value: _base.event },

          { label: "Contacts", value: _base.contact},
          { label: "Business", value: _base.buisness },
          { label: "Sports", value: _base.sports},
          { label: "Groceries", value: _base.groceries},
          { label: "Lost", value: _base.lost},
          // { label: "Fashion", value: 33, labelColor:"#bd86b6"},
          // { label: "General", value: 33, labelColor:"#8769d7"},
          // { label: "Event", value: 33 ,labelColor:"#ef95c8"},
        ]
      });
    }, 1000);



    // anychart.onDocumentReady(function () {

    //   if (_base.chart) {
    //     _base.chart.dispose()
    //   }


    //   _base.chart = anychart.pie([
    //     { x: "Fashion", value: _base.fashion },
    //     { x: "General", value: _base.general },
    //     { x: "Event", value: _base.event },
    //     { x: "Contacts", value: _base.contact },
    //     { x: "Business", value: _base.buisness },
    //     { x: "Sports", value: _base.sports },
    //     { x: "Groceries", value: _base.groceries },
    //     { x: "Lost", value: _base.lost }       
    //   ]);

    //   var label = anychart.standalones.label();
    //   _base.chart.innerRadius("25%");
    //   label.text("TapTap");
    //   label.width("100%");
    //   label.height("100%");
    //   label.adjustFontSize(true);
    //   label.fontColor("#60727b");
    //   label.hAlign("center");
    //   label.vAlign("middle");
    //   _base.chart.legend(false);

    //   _base.chart.center().content(label);
    //   _base.chart.container("container");
    //   _base.chart.draw();

    // });

  }
  ionViewDidLeave() {
    // this.chart.dispose();
    this.offline = false;
    // this.chartfunc(1);
  }
  selectedTab(index) {

    this.slideselected = (this.slideselected == 'home') ? "history" : "home";

    this.slider.slideTo(index);
    this.getAllTapItem();
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
    // this.chartfunc();

  }

  //Get profile data...
  getprofiledata() {
    let _base = this;
    this.loginsignupProvider.getProfile(this.userId).then(function (success: any) {
      console.log(success);
      if (success) {
        _base.userName = success.result.name
        _base.storage.set("username", _base.userName);
        localStorage.setItem('uid', success.result.uid);
        _base.storage.set('uid', success.result.uid);
        _base.uid = success.result.uid
        if (success.result.imageId) {
          _base.profileImage = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id;
          _base.convertToDataURLviaCanvas(_base.profileImage, "image/png").then(base64img => {
            console.log(base64img);
            _base.base4img = base64img;
            _base.storage.set('uimg', _base.base4img);
          })
        } else {
          _base.base4img = "assets/images/avatar.png";
          _base.convertToDataURLviaCanvas(_base.base4img, "image/png").then(base64img => {
            console.log(base64img);
            _base.base4img = base64img;
            _base.storage.set('uimg', _base.base4img);
          })
          console.log("enterr else image =============")
        }

        console.log(success.result)

        if (!success.result.phoneNumber) {

          setTimeout(function () {
            _base.navCtrl.push("SetphonePage")
          }, 2000)
        }

      }
    }, function (err) {
      _base.offline = true;
      _base.storage.get("username").then((name) => {
        _base.userName = name;
        console.log(_base.userName);
        console.log(name);
      });
      _base.storage.get("uid").then((uid) => {
        _base.uid = uid;
        console.log(_base.uid);
      });
      _base.storage.get("uimg").then((uimg) => {
        _base.base4img = uimg;
        console.log(_base.base4img);
      });

      // console.log(_base.userName);
      console.log(err);
    })
    // _base.userName=_base.storage.get("username").then(value=>{
    //   console.log(value);
    // });
    // console.log(_base.userName);
  }

  imageExists(url, callback) {
    var img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = url;
  }

  //Tap on product....
  tapItem() {
    let _base = this;
    this.readingTag = true;

    _base.androidPermissions.checkPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      function (result) {
        console.log('Has permission?', result.hasPermission)
        if (!result.hasPermission) {
          _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        } else {
          _base.navCtrl.push('TapmodalPage');
        }
      },
      function (err) {
        _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      });
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

      _base.storage.set('chartdata', success.result);
      _base.fashion = success.result.fashion;
      _base.buisness = success.result.business;
      _base.contact = success.result.contact;
      _base.event = success.result.event;
      _base.general = success.result.general;
      _base.favourite = success.result.favourite;
      _base.sports = success.result.sport;
      _base.groceries = success.result.groceries;
      _base.lost = success.result.lost;
      _base.totalcount = success.result.totalTap;
      _base.storage.set("totalcount", success.result.totalTap)
      _base.chartfunc();
      loader.dismiss();
    }, function (err) {

      _base.storage.get("chartdata").then((chartdata) => {
        // _base.totalcount=chartdata;
        console.log(chartdata)
        _base.fashion = chartdata.fashion;
        _base.buisness = chartdata.business;
        _base.contact = chartdata.contact;
        _base.event = chartdata.event;
        _base.general = chartdata.general;
        _base.favourite = chartdata.favourite;
        _base.sports = chartdata.sport;
        _base.groceries = chartdata.groceries;
        _base.lost = chartdata.lost;
        _base.totalcount = chartdata.totalTap;
        console.log(chartdata);
        _base.chartfunc();
      });
      // _base.chartfunc();
      loader.dismiss();
      console.log(err);
    })
  }

  //get present date tap count....
  getpresentdateCount() {
    let _base = this;
    this.loginsignupProvider.getTapPresentDate(this.userId).then(function (success: any) {
      console.log(success.result);
      _base.todaysTap = success.result.length;
      _base.storage.set('todayscount', success.result.length)

    }, function (err) {
      _base.storage.get("todayscount").then((tcount) => {
        _base.todaysTap = tcount;
        console.log(_base.totalcount);
      });
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
      _base.allTapItems = success.result;
      _base.storage.set('alltp', success.result.slice(0, 10));
      if (success.result.length == 0) {
        _base.isblanck = true;
        _base.blankmsg = "There Is No Tap Yet";
      }
      console.log(_base.tapItems);
    }, function (err) {
      _base.storage.get("alltp").then((tcount) => {
        _base.tapItems = tcount;
        console.log(_base.tapItems);
      });
      console.log(err);
    })
  }

  search() {
    let _base = this
    if (_base.str == '') {
      _base.tapItems = _base.allTapItems
    } else {
      _base.tapItems = _base.allTapItems.filter(item => {
        let case_1 = item.purpose.toLowerCase().includes(_base.str.toLowerCase())
        let case_2 = false;
        if (item.deviceInfo.device_title) {
          case_2 = (item.deviceInfo.device_title.toLowerCase().includes(_base.str.toLowerCase()))
        }
        if (case_1 || case_2) {
          return item
        }
      })
    }
  }

  //go to detail page ...
  gotoDetails(item) {
    if (item == 'Verification') {
      this.navCtrl.push('TapdetailsPage', { keyy: 'verification' });
      return;
    }
    if (item.purpose == "lost") {
      this.navCtrl.push('LostcardPage', { lostinfo: item.deviceInfo.contact_info });
      console.log(item);
    } else if (item.purpose == "Contact_info") {
      // this.createTap(item);
      this.navCtrl.push('TapdetailsPage', { devicedetail: item.deviceInfo, key: 'device' });
      // this.navCtrl.push('TapdetailsPage', { devicedetaill: item, key: 'devicee' });

    }
    else {
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
      _base.storage.set('devices', success.result.length);
    }, function (err) {
      _base.storage.get("devices").then((devices) => {
        _base.devicecount = devices;
        console.log(_base.devicecount);
      });
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
  slideChanged() {
    this.slideselected = (this.slideselected == 'home') ? "history" : "home";
  }

  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
        canvas = null;
      };
      img.src = url;
    });
  }

}
