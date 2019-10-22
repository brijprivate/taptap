import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { NavController, Slides, ModalController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
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
import { Socket } from 'ng-socket-io';

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
  base4img: any = "assets/images/avatar.png";
  keyboards: boolean = false;
  slideselected: string;
  offline: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider: LoginsignupProvider,
    public nfc: NFC,
    public ndef: Ndef,
    public socket: Socket,
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

      // console.log('check 1', this.socket.ioSocket.connected);
      // if (this.socket.ioSocket.connected) {
      //   this.InitSocket()
      //   this.socket.connect()
      // }
      // console.log('check 1', this.socket.ioSocket.connected);

      // let _base = this;

    }

  }
  ionViewWillLeave() {
    // this.chart.dispose();

  }

  InitSocket() {
    let _base = this;

    console.log('check 1', this.socket.ioSocket.connected);
    if (!this.socket.ioSocket.connected) {
      this.socket.removeAllListeners();
      if (_base.location_watch) {
        _base.location_watch.unsubscribe();
      }
      this.socket.connect()
    }
    console.log('check 1', this.socket.ioSocket.connected);

    // this.socket.on("connect", function (socket) {
    //   console.log("socket emit user connected", _base.socket.ioSocket.id)
    //   _base.socket.emit("user_connected", { userId: localStorage.getItem('userId') })
    // })

    this.socket.on("connect", function (socket) {
      console.log("user has been connected")

      _base.socket.emit("user_connected", { userId: localStorage.getItem('userId') })

      // test - remove later
      // _base.socket.emit("location", {
      //   latitude: 23.3558763,
      //   longitude: 87.6878509
      // })

      // test end upto this

      if (_base.location_watch) {
        _base.location_watch.unsubscribe();
      }

      _base.location_watch = _base.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe((resp) => {
        _base.socket.emit("location", {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        })
      })
    })

    this.socket.on('nearby', function (nearby: any) {
      console.log('Found Nearby')
      if (nearby) {
        // console.log("Nearby", nearby)
        _base.shownearbypopup(nearby.data[0]);
      }
    })

    this.socket.on('disconnect', function () {
      console.log('Got disconnect!');
      // _base.geolocation.clearWatch(_base.location_watch)
      _base.location_watch.unsubscribe();
      _base.socket.removeAllListeners()
    });
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


  ionViewDidEnter() {

    // this.InitSocket();  //initialize scoket

    this.chartfunc()
    // this.chart.dispose();
    this.offline = false;
    console.log("view enter--------------->>>>>>>>>>>");
    this.userId = localStorage.getItem("userId");
    if (this.userId) {
      this.getAllTapItem();
      this.getprofiledata();
      this.getpresentdateCount();
      this.getpairedDevice();
      this.getnotifications();
      this.getDashboarddata();
    }
    if (this.totalcount) {
      // var _base = this;
    }

    let _base = this;
    _base.storage.get("homeSelectedTab")
      .then(function (index) {
        if (index) {
          _base.slideselected = (index == 0) ? "history" : "home";

          _base.slider.slideTo(index);
          _base.getAllTapItem();
        }
      })

    //update Location
    _base.androidPermissions.checkPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      function (result) {
        console.log('Has permission?', result.hasPermission)
        if (!result.hasPermission) {
          _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        } else {
          _base.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
            _base.updateLocation(resp.coords.latitude, resp.coords.longitude)
          }).catch((error) => {
            console.log('Error getting location', error);
            alert("Please turn on your location service")
          })
        }
      },
      function (err) {
        // alert('Please turn on location service for better experience with TapTap.')
        _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
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

  chartfunc() {
    let _base = this;

    let data = [];
    let colors = []
    console.log(_base.restaurant, typeof _base.restaurant)

    console.log("totalcount", _base.totalcount)

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
      console.log("Inside restaurant")
      data.push({ label: "Restaurant", value: _base.restaurant })
      colors.push("#D7761B")
    }

    console.log(data)

    setTimeout(() => {
      if ((<HTMLElement>document.getElementById('donut-example'))) {
        (<HTMLElement>document.getElementById('donut-example')).innerHTML = "";
      }


      Morris.Donut({
        element: 'donut-example',
        resize: false,
        formatter: function (y, data) { console.log(y, data); return '' + y },
        colors: colors,
        data: data
      });
    }, 1);

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
    this.storage.remove("homeSelectedTap")
    this.storage.set("homeSelectedTap", index)
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

    console.log("USERNAME", _base.storage.get('username'))

    // if user exists
    _base.storage.get('profile')
      .then(function (profile) {
        if (profile) {
          _base.userName = profile.name
          _base.uid = profile.uid
        }
      })

    _base.storage.get('uimg')
      .then(function (image) {
        if (image) {
          _base.base4img = image;
        }
      });



    this.loginsignupProvider.getProfile(this.userId).then(function (success: any) {
      console.log(success);
      if (success) {
        _base.userName = success.result.name
        _base.storage.remove("profile")
        _base.storage.set("profile", success.result);
        localStorage.setItem('uid', success.result.uid);
        _base.uid = success.result.uid
        if (success.result.imageId) {
          _base.profileImage = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id + "&select=thumbnail";
          _base.base4img = _base.profileImage;
          _base.convertToDataURLviaCanvas(_base.profileImage, "image/png").then(base64img => {
            console.log(base64img);
            _base.base4img = base64img;
            _base.storage.remove("uimg")
            _base.storage.set('uimg', _base.base4img);
          })
        } else {
          _base.base4img = "assets/images/avatar.png";
          _base.convertToDataURLviaCanvas(_base.base4img, "image/png").then(base64img => {
            console.log(base64img);
            _base.base4img = base64img;
            _base.storage.remove("uimg")
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
        if (name) {
          _base.userName = name;
          console.log(_base.userName);
          console.log(name);
        }
      });
      _base.storage.get("uid").then((uid) => {
        if (uid) {
          _base.uid = uid;
          console.log(_base.uid);
        }
      });
      _base.storage.get("uimg").then((uimg) => {
        if (uimg) {
          _base.base4img = uimg;
          console.log(_base.base4img);
        }
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

    _base.nfc.enabled()
      .then(function (success) {
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
            alert('Please turn on location service to use this feature.')
            _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          });
      }, function (error) {

        if (error == 'NO_NFC') {
          alert('This phone is not NFC Supported')
        } else if (error == 'NFC_DISABLED') {
          alert('NFC is disabled on this phone.Please enable NFC to use this feature')
        } else {
          alert('Unsupported NFC')
        }

      })
  }

  getDashboarddata() {
    let _base = this;
    // let loader = this.loading.create({
    //   content: "Please wait..."
    // });
    // loader.present();

    let cd = {};

    if (_base.storage.get('chartdata')) {
      _base.storage.get("chartdata").then((chartdata) => {
        // _base.totalcount=chartdata;
        if (chartdata) {
          cd = chartdata
          _base.fashion = chartdata.fashion;
          _base.buisness = chartdata.business;
          _base.contact = chartdata.contact;
          _base.event = chartdata.event;
          _base.general = chartdata.general;
          _base.favourite = chartdata.favourite;
          _base.sports = chartdata.sport;
          _base.groceries = chartdata.groceries;
          _base.restaurant = chartdata.restaurant;
          _base.lost = chartdata.lost;
          _base.totalcount = chartdata.totalTap;
          console.log(chartdata);

          if ((<HTMLElement>document.getElementById('donut-example')).innerHTML == "") {
            _base.chartfunc();
          }
        }
      });
    }


    this.loginsignupProvider.getDashboard(this.userId).then(function (success: any) {
      console.log("dashboard data ---------->>>>>>" + success);
      console.log(success);


      if (!_base.isEqual(cd, success.result)) {
        console.log("NOT Equal", cd)
        console.log(success.result)
        _base.storage.remove("chartdata")
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
        _base.restaurant = success.result.restaurant;
        _base.totalcount = success.result.totalTap;
        _base.storage.remove("totalcount")
        _base.storage.set("totalcount", success.result.totalTap)
        _base.chartfunc();
      } else {
        console.log("Equal")
      }
      // loader.dismiss();
    }, function (err) {

      let cdata;

      _base.storage.get("chartdata").then((chartdata) => {
        // _base.totalcount=chartdata;
        if (chartdata) {
          console.log(chartdata)
          cdata = chartdata
          console.log(chartdata);
          if (!_base.isEqual(chartdata, cdata)) {
            console.log("NOT Equal", cd, cdata)
            _base.fashion = chartdata.fashion;
            _base.buisness = chartdata.business;
            _base.contact = chartdata.contact;
            _base.event = chartdata.event;
            _base.general = chartdata.general;
            _base.favourite = chartdata.favourite;
            _base.sports = chartdata.sport;
            _base.groceries = chartdata.groceries;
            _base.restaurant = chartdata.restaurant;
            _base.lost = chartdata.lost;
            _base.totalcount = chartdata.totalTap;
            _base.chartfunc();
          } else {
            console.log("Equal")
          }
        }
      });
      console.log(err);
    })
  }

  //get present date tap count....
  getpresentdateCount() {
    let _base = this;

    _base.storage.get("todayscount").then((tcount) => {
      if (tcount) {
        _base.todaysTap = tcount;
        console.log(_base.totalcount);
      }
    });

    this.loginsignupProvider.getTapPresentDate(this.userId).then(function (success: any) {
      console.log(success.result);
      _base.todaysTap = success.result.length;
      _base.storage.remove("todayscount")
      _base.storage.set('todayscount', success.result.length)

    }, function (err) {
      _base.storage.get("todayscount").then((tcount) => {
        if (tcount) {
          _base.todaysTap = tcount;
          console.log(_base.totalcount);
        }
      });
      console.log(err);
    })
  }

  //get all tap items....
  getAllTapItem() {
    let _base = this;

    _base.storage.get("alltp").then((tcount) => {
      if (tcount) {
        _base.tapItems = tcount;
        console.log(_base.tapItems);
      }
    });


    this.loginsignupProvider.getTapAll(this.userId).then(function (success: any) {
      console.log("All Tapped data ,..........>>>>>");
      // console.log(success.result.length);
      _base.tapItems = success.result;
      // _base.allTapItems = success.result;
      _base.storage.remove("alltp")
      _base.storage.set('alltp', success.result);
      if (success.result.length == 0) {
        _base.blankmsg = "There Is No Tap Yet";
      } else {
      }
      console.log(_base.tapItems);
    }, function (err) {
      _base.storage.get("alltp").then((tcount) => {
        if (tcount) {
          _base.tapItems = tcount;
          console.log(_base.tapItems);
        }
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
    if (item.purpose == 'Verification') {
      this.navCtrl.push('TapdetailsPage', { keyy: 'verification' });
      return;
    }
    if (item.purpose == "lost") {
      this.navCtrl.push('LostcardPage', { lostinfo: item.deviceInfo.contact_info });
      console.log(item);
    } else if (item.purpose == "Contact_info") {
      // this.createTap(item);
      // this.navCtrl.push('TapdetailsPage', { devicedetail: item.deviceInfo, key: 'device' });
      this.navCtrl.push('TapdetailsPage', { devicedetaill: item, key: 'device' });

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

    _base.storage.get("devices").then((devices) => {
      if (devices) {
        _base.devicecount = devices;
        console.log(_base.devicecount);
      }
    });


    this.nfctagpro.getpairdevice(this.userId).then(function (success: any) {
      console.log("paired devices--------------?>>>>>>>>>");
      console.log(success.result.length);
      // _base.devices = success.result;
      _base.devicecount = success.result.length;
      _base.storage.remove("devices")
      _base.storage.set('devices', success.result.length);
    }, function (err) {
      _base.storage.get("devices").then((devices) => {
        if (devices) {
          _base.devicecount = devices;
          console.log(_base.devicecount);
        }
      });
      console.log(err);
    })
  }

  getnotifications() {
    let _base = this;
    _base.notiCount = 0;

    _base.storage.get("notifications")
      .then(function (success) {
        if (success) {
          success.forEach(item => {
            if (item.seen == false) {
              _base.notiCount = _base.notiCount + 1
            }
          });
        }
      })


    _base.nfctagpro.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        console.log("Notifications", success)
        _base.storage.remove("notifications")
        _base.storage.set("notifications", success.result)
        _base.notiCount = 0;
        success.result.forEach(item => {
          if (item.seen == false) {
            _base.notiCount = _base.notiCount + 1
          }
        });
      }, function (error) {
        console.log(error)
        _base.storage.get("notifications")
          .then(function (success) {
            if (success) {
              _base.notiCount = 0;

              success.forEach(item => {
                if (item.seen == false) {
                  _base.notiCount = _base.notiCount + 1
                }
              });
            }
          })
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
