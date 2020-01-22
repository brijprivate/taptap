import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { NavController, IonicPage, Slides, ModalController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Subscription } from 'rxjs/Rx';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { isBlank } from 'ionic-angular/umd/util/util';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Storage } from '@ionic/storage';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { ProfilePage } from '../profile/profile';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

declare var Morris;

// import { Diagnostic } from '@ionic-native/diagnostic';
declare var anychart;
@IonicPage()
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
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  public location_watch: any;
  public viewing: any = false;

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
  public restaurant: any = 0;
  public totalcount: 0;
  public todaysTap: 0;
  public tapItems: any = [];
  public allTapItems: any;
  public str: String = "";
  public usrnm: any;
  public graphdata = [];

  lineChart: any;

  public chart;
  public time = new Date();

  public scrollCount = 1;


  //NFC read related ....
  readingTag: boolean = false;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  public tapData: any;
  devicecount: any;
  profileImage: string;
  base4img: any = "assets/images/avatar.png";
  keyboards: boolean = false;
  slideselected: string;
  offline: boolean = false;
  shownItems: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    public nfc: NFC,
    public ndef: Ndef,
    public toastCtrl: ToastController,
    public nativeGeocoder: NativeGeocoder,
    public modalController: ModalController,
    private androidPermissions: AndroidPermissions,
    public loading: LoadingController,
    public nfctagpro: NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert: AlertController,
    private storage: Storage,
    public geolocation: Geolocation
    // private diagnostic: Diagnostic
  ) {
    this.slideselected = 'home';
    var x = new Date().toTimeString().slice(0, 8);
    let cdate = new Date().toISOString();
    this.userId = localStorage.getItem("userId")

    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {

        if (Object.keys(response).length != 0) {
          _base.getDashboarddata(response.chartdata)

          _base.getnotifications(response.noticount)
          _base.getpairedDevice(response.devices)
          _base.getpresentdateCount(response.todayscount)
          _base.getprofiledata(response.profile, response.display_picture)
          _base.getAllTapItem(response.alltaps)
          _base.favourite = response.favcount
        }
      })
    _base.getCurrentPosition();
  }




  shownearbypopup(data: any) {
    let _base = this;
    if (!this.viewing) {
      let modal = this.modalController.create("FeedpopupPage", data, { showBackdrop: true, enableBackdropDismiss: true });
      modal.present();
      this.viewing = true;
      modal.onDidDismiss(function () {
        setTimeout(function () {
          _base.viewing = false;
        }, 60000)
      })
    }
  }


  blur() {
    this.keyboards = false;
  }
  focus() {
    this.keyboards = true;
  }

  updateLocation(lat, lng) {
    let _base = this;
    let data = {
      userId: localStorage.getItem('userId'),
      coordinates: [lng, lat],
      type: "point",
    }
    _base.loginsignupProvider.userUpdateLocationOrSocket(data)
      .then(function (success) {

      }, function (error) {

      });
  }



  isEqual(value: any, other: any) {
    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function (item1, item2) {

      // Get the object type
      var itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        // if (!isEqual(item1, item2)) return false;
      }

      // Otherwise, do a simple comparison
      else {

        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false;
        } else {
          if (item1 !== item2) return false;
        }

      }
    };

    // Compare properties
    if (type === '[object Array]') {
      for (var i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }

    // If nothing failed, return true
    return true;
  }

  appears() {

  }

  chartfunc() {
    let _base = this;
    let data = [];
    let colors = []
    // if no tap
    if (_base.totalcount == 0) {
      _base.isblanck = true
    } else {
      _base.isblanck = false
    }
    if (_base.fashion != null && _base.fashion != 0) {
      data.push({ label: "Fashion", value: _base.fashion })
      colors.push("#bd86b6")
    }
    if (_base.general != null && _base.general != 0) {
      data.push({ label: "General", value: _base.general })
      colors.push("#8769d7")
    }
    if (_base.event != null && _base.event != 0) {
      data.push({ label: "Event", value: _base.event })
      colors.push("#ef95c8")
    }

    if (_base.contact != null && _base.contact != 0) {
      data.push({ label: "Contacts", value: _base.contact })
      colors.push("#80a09d")
    }
    if (_base.buisness != null && _base.buisness != 0) {
      data.push({ label: "Business", value: _base.buisness })
      colors.push("#8baeec")
    }
    if (_base.sports != null && _base.sports != 0) {
      data.push({ label: "Sports", value: _base.sports })
      colors.push("#d98136")
    }
    if (_base.groceries != null && _base.groceries != 0) {
      data.push({ label: "Groceries", value: _base.groceries })
      colors.push("#DA4567")
    }
    if (_base.lost != null && _base.lost != 0) {
      data.push({ label: "Lost", value: _base.lost })
      colors.push("#EC407A")
    }
    if (_base.restaurant != null && _base.restaurant != 0) {
      data.push({ label: "Restaurant", value: _base.restaurant })
      colors.push("#D7761B")
    }
    if (JSON.stringify(_base.graphdata) == JSON.stringify(data)) {
      return
    }
    _base.graphdata = data;
    if (_base.doughnutChart) {
      _base.doughnutChart.setData(data)
    } else {
      (<HTMLElement>document.getElementById('donut-example')).innerHTML = ""
      _base.doughnutChart = Morris.Donut({
        element: 'donut-example',
        // resize: false,
        formatter: function (y, data) { return '' + y },
        colors: colors,
        data: data
      })
    }
  }

  ionViewDidEnter() {
    if (this.doughnutChart) {
      this.doughnutChart.setData(this.graphdata)
    }

    if (document.getElementById('scroll')) {
      this.scrollSubscriber();
    }
  }

  ionViewDidLeave() {
    // this.chart.dispose();
    this.offline = false;
    this.destroyScrollSubscriber()
    // this.chartfunc(1);
  }
  selectedTab(index) {
    this.slideselected = (this.slideselected == 'home') ? "history" : "home";
    this.slider.slideTo(index);
    if (this.slideselected == 'home') {
      let length = this.tapItems.length;
      let slice_end = length >= 10 ? 10 : length - 1
      this.shownItems = this.tapItems.slice(0, slice_end)
      this.scrollCount = 1
      document.getElementById("scroll").scrollTop = 0;
    }
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

  //Get profile data...
  getprofiledata(profile, display_picture) {
    let _base = this;
    _base.userName = profile.name
    _base.uid = profile.uid
    _base.base4img = display_picture;
  }

  imageExists(url, callback) {
    var img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = url;
  }
  goto(page) {

    this.navCtrl.push(page)
  }
  //Tap on product....
  tapItem() {
    let _base = this;
    this.readingTag = true;
    if (localStorage.getItem('lat') != null || localStorage.getItem('lat') != undefined) {
      _base.navCtrl.push('TapmodalPage');
    } else {
      this.presentToast('Please turn on your location.')
    }
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }

  getDashboarddata(chartdata) {
    let _base = this;

    _base.fashion = chartdata.fashion;
    _base.buisness = chartdata.business;
    _base.contact = chartdata.contact;
    _base.event = chartdata.event;
    _base.general = chartdata.general;
    _base.sports = chartdata.sport;
    _base.groceries = chartdata.groceries;
    _base.restaurant = chartdata.restaurant;
    _base.lost = chartdata.lost;
    _base.totalcount = chartdata.totalTap;


    let interval = setInterval(function () {
      let element = (<HTMLElement>document.getElementById('donut-example'));
      if (element) {
        _base.chartfunc();
        clearInterval(interval)
      }
    }, 100)

  }

  getCurrentPosition() {
    let _base = this;
    _base.geolocation.getCurrentPosition().then((resp) => {
      let lat = resp.coords.latitude
      let lng = resp.coords.longitude
      localStorage.setItem("lat", lat.toString())
      localStorage.setItem("lng", lng.toString())
    })
  }

  //get present date tap count....
  getpresentdateCount(tcount) {
    let _base = this;
    _base.todaysTap = tcount;
  }

  //get all tap items....
  getAllTapItem(alltaps) {
    let _base = this;
    if (alltaps.length == _base.tapItems.length) {
      return
    }
    let lastcreateddate = "";
    _base.tapItems = alltaps.map((item) => {
      let createddate = item.createdDate.split("T")[0]
      let obj: any = item;
      if (lastcreateddate != createddate) {
        lastcreateddate = createddate
        let d = new Date(createddate)
        obj.date = d.getDate() + ' ' + _base.monthNames[d.getMonth()] + ', ' + d.getFullYear()
      }
      return obj
    });
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
  onScroll() {

  }

  //go to detail page ...
  gotoDetails(item) {
    if (item.purpose == 'Verification') {
      this.navCtrl.push('TapdetailsPage', { keyy: 'verification' });
      return;
    }
    if (item.purpose == "lost") {
      this.navCtrl.push('LostcardPage', { lostinfo: item.deviceInfo.contact_info });

    } else if (item.purpose == "Contact_info") {
      // this.createTap(item);
      // this.navCtrl.push('TapdetailsPage', { devicedetail: item.deviceInfo, key: 'device' });
      this.navCtrl.push('TapdetailsPage', { devicedetaill: item, key: 'device' });

    }
    else {

      this.navCtrl.push('TapdetailsPage', item);
    }

  }

  //go to edit profile page ...
  gotoedit() {
    this.navCtrl.push('EditprofilePage');
  }

  //Get paired devices...
  getpairedDevice(devices) {
    let _base = this;
    _base.devicecount = devices.length;

  }

  getnotifications(data) {
    let _base = this;
    _base.notiCount = data;
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
    //     
    //     
    //     if (status != this.diagnostic.permissionStatus.GRANTED) {
    //       this.diagnostic.requestRuntimePermission(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((data) => {
    //         
    //         
    //       })
    //     } else {
    //       
    //     }
    //   }, (statusError) => {
    //     
    //     
    //   });
  }
  slideChanged() {
    this.slideselected = (this.slideselected == 'home') ? "history" : "home";
    if (this.slideselected == 'home') {
      let length = this.tapItems.length;
      let slice_end = length >= 10 ? 10 : length - 1
      this.shownItems = this.tapItems.slice(0, slice_end)
      this.scrollCount = 1
      document.getElementById("scroll").scrollTop = 0;
    }
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

  detectBottom() {
    console.log("Bottom Detected")
  }

  scrollSubscriber() {
    console.debug("Scroll Event");
    let _base = this;
    let length = this.tapItems.length;
    let slice_end = length >= 10 ? 10 : length - 1
    this.shownItems = this.tapItems.slice(0, slice_end)
    document.getElementById('scroll').scrollTop = 0;
    document.getElementById('scroll').addEventListener(
      'scroll',
      function () {
        let item = document.querySelectorAll('#scroll-item')[0].scrollHeight;
        let scrollTop = document.getElementById('scroll').scrollTop;
        let scrollHeight = document.getElementById('scroll').scrollHeight; // added
        let offsetHeight = document.getElementById('scroll').offsetHeight;
        // var clientHeight = document.getElementById('box').clientHeight;
        let contentHeight = scrollHeight - offsetHeight; // added
        console.log(contentHeight)
        console.log(scrollTop)
        if (contentHeight <= scrollTop + 200) // modified
        {
          console.log("Scroll Down")
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
    let slice_end = length >= 10 ? 10 : length - 1
    this.shownItems = this.tapItems.slice(0, slice_end)
    document.getElementById("scroll").scrollTop = 0;
    document.getElementById('scroll').removeEventListener('scroll', function () { }, true)
    this.scrollCount = 1;
  }

}
