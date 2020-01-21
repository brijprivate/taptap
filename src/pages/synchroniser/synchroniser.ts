import { Component } from '@angular/core';
import { NavController, IonicPage, Slides, ModalController, NavParams, LoadingController, ToastController, AlertController, Button } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
/**
 * Generated class for the SynchroniserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-synchroniser',
  templateUrl: 'synchroniser.html',
})
export class SynchroniserPage {

  public userId: String = ""
  public API_URL = "https://api.taptap.org.uk";
  public count = 0;
  public total_load = 8;
  public app_state: any = {};
  public sharedata: any = {};

  constructor(public navCtrl: NavController,
    public loginHttp: LoginsignupProvider,
    public nfcHttp: NfctagProvider,
    public sharedHttp: SharedserviceProvider,
    public storage: Storage,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public navParams: NavParams) {
    let _base = this;
    _base.userId = localStorage.getItem("userId")
    _base.count = 0;
    // this.getCurrentPosition();

    _base.sharedata = navParams.data;


    if (_base.userId != "") {

      _base.storage.get('app_state')
        .then(function (app_state) {
          if (app_state) {

            _base.app_state = JSON.parse(app_state)
            _base.share_app_state();
            _base.app();
            _base.loadHttp();
          } else {
            _base.loadHttp();
          }
        });
    }



    _base.sharedHttp.triggerhttp
      .subscribe(function (data: any) {
        if (data) {
          if (data.value == true) {
            _base.loadHttp();
          }
        }
      })

    _base.sharedHttp.fetchNotification
      .subscribe(function (data: any) {
        if (data) {
          if (data.value) {
            _base.singlegetnotifications();
          }
        }
      });

    _base.sharedHttp.fetchProfile
      .subscribe(function (data: any) {
        if (data) {
          if (data.value) {
            _base.singlegetprofiledata();
          }
        }
      });
  }

  loadHttp() {
    if (localStorage.getItem("userId") != null || localStorage.getItem("userId") != undefined) {
      this.userId = localStorage.getItem("userId");
    } else {
      this.userId = '';
    }
    let _base = this;
    setTimeout(function () {
      _base.getAllTapItem();
      _base.getCurrentPosition();
    }, 3000);
  }

  //get all tap items....
  getAllTapItem() {
    let _base = this;
    this.loginHttp.getTapAll(this.userId).then(function (success: any) {
      _base.count = 1;
      _base.app_state.alltaps = success.result;
      _base.getprofiledata();
    }, function (err) {
      _base.loadHttp()
    })
  }

  getprofiledata() {
    let _base = this;
    this.loginHttp.getProfile(this.userId).then(function (success: any) {
      if (success) {
        _base.count = 2;
        localStorage.setItem('uid', success.result.uid);
        _base.app_state.profile = success.result;
        if (success.result.imageId) {
          let profileImage = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id;
          let base4img = profileImage;
          _base.convertToDataURLviaCanvas(profileImage, "image/png").then(base64img => {
            let base4img = base64img;
            _base.storage.remove("uimg")
            _base.app_state.display_picture = base4img;
            _base.storage.set('uimg', base4img);
          })
        } else {
          let base4img = "assets/images/avatar.png";
          _base.convertToDataURLviaCanvas(base4img, "image/png").then(base64img => {
            let base4img = base64img;
            _base.storage.remove("uimg")
            _base.storage.set('uimg', base4img);
            _base.app_state.alltaps = base4img;
          })
        }

      }
      _base.getpresentdateCount();
    }, function (err) {
      _base.loadHttp()
    })
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

  converttobase64(url) {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL("image/png");
      canvas = null;
      return dataURL;
    };
    img.src = url;
  }

  //get present date tap count....
  getpresentdateCount() {
    let _base = this;
    _base.count = 3;
    this.loginHttp.getTapPresentDate(this.userId).then(function (success: any) {
      _base.app_state.todayscount = success.result.length;
      _base.getpairedDevice();
    }, function (err) {
      _base.loadHttp()
    })
  }

  //Get paired devices...
  getpairedDevice() {
    let _base = this;
    this.nfcHttp.getpairdevice(this.userId).then(function (success: any) {
      _base.count = 4;
      _base.app_state.devices = success.result.map(device => {
        if (device.imageId) {
          let image = _base.API_URL + "/file/getImage?imageId=" + device.imageId._id + "&select=thumbnail";
          device.image = image
        }
        return device;
      });
      _base.getnotifications();
    }, function (err) {
      _base.loadHttp()
    })
  }


  getnotifications() {
    let _base = this;

    _base.count = 5;
    let notiCount = 0;
    _base.nfcHttp.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        _base.app_state.notifications = success.result;
        success.result.forEach(item => {
          if (item.seen == false) {
            notiCount = notiCount + 1
          }
        });
        _base.app_state.noticount = notiCount;
        _base.getDashboarddata();
      }, function (error) {
        _base.loadHttp()
      });
  }


  getDashboarddata() {
    let _base = this;
    this.loginHttp.getDashboard(this.userId).then(function (success: any) {
      _base.count = 6;
      _base.app_state.chartdata = success.result;
      // _base.share_app_state();
      _base.getcount()
    }, function (err) {
      _base.loadHttp()
    })
  }

  getcount() {
    let _base = this;
    _base.count = 7;
    this.nfcHttp.getcount(this.userId).then(function (success: any) {
      _base.app_state.chdata = success;
      _base.getmyfeeds();
    }, function (err) {
      _base.loadHttp()
    })
  }

  getmyfeeds() {
    let _base = this;
    if (localStorage.getItem('lat') != null && localStorage.getItem('lat') != undefined) {
      let query = {
        userId: _base.userId,
        location: {
          latitude: localStorage.getItem('lat'),
          longitude: localStorage.getItem('lng')
        }
      };
      _base.loginHttp.getMyFeeds(query)
        .then(function (success: any) {
          _base.app_state.feeds = success.result.slice(0, 30)
            .map(function (feed) {
              let date = new Date(feed.createdDate)
              let dateString = date.toLocaleDateString()
              feed.createdDate = dateString;
              feed.picture = "https://api.taptap.org.uk/file/getImage?imageId=" + feed.imageId[0]
              feed.thumbnail = "https://api.taptap.org.uk/file/getImage?imageId=" + feed.imageId[0] + "&select=thumbnail"

              let favourites = feed.favourites;
              if (favourites.includes(localStorage.getItem('userId'))) {
                feed.like = true
              } else {
                feed.like = false;
              }
              return feed;
            }).filter(feed => {
              if (feed.product) {
                return true
              }
            });;
          _base.getuserslist();
        }, function (error: any) {
          _base.app_state.feeds = [];
          _base.getuserslist();
        });
    } else {
      _base.app_state.feeds = [];
      _base.getuserslist();
    }
  }


  getuserslist() {
    let _base = this;
    this.loginHttp.getuserslist().then(function (success: any) {
      let count = success.result.length;
      _base.app_state.user_count = count;
      _base.getfavourites();
    }, function (err) {
      _base.app_state.user_count = _base.app_state.user_count;
      _base.getfavourites();
    })
  }

  //for merchant...
  getfavourites() {
    let _base = this;

    this.loginHttp.searchfavourite(this.userId, '', '').then(function (success: any) {
      let lastcreateddate = "";
      let fav_items = success.result.map((item) => {
        let obj: any = {};
        let createddate = item.createdDate.split("T")[0]
        // 
        if (lastcreateddate != createddate) {
          // 
          lastcreateddate = createddate
          obj.date = createddate
        }
        Object.assign(obj, item)
        return obj
      });
      _base.app_state.favourites = fav_items.slice(0, 50);
      _base.app_state.favcount = fav_items.length;
      _base.getcategories();
    }, function (err) {
      _base.app_state.favourites = [];
      _base.app_state.favcount = 0;
      _base.getcategories();
    })
  }

  getcategories() {
    let _base = this
    _base.loginHttp.getallcategories()
      .then(function (success: any) {
        _base.app_state.categories = success.result
        _base.getcompanies();
      }, function (error) {
        _base.loadHttp()
      })
  }

  getcompanies() {
    let _base = this;
    _base.nfcHttp.getcompanies()
      .then(function (comp: any) {
        _base.count = 8;
        let companies = comp.result
          .filter(company => {
            if (company.display_picture && company.discount) {
              return true
            }
          })
        companies = companies.map(company => {
          company.picture = "https://api.taptap.org.uk/file/getImage?imageId=" + company.display_picture
          company.thumbnail = "https://api.taptap.org.uk/file/getImage?imageId=" + company.display_picture + "&select=thumbnail"
          return company
        })
        _base.app_state.companies = companies;
        _base.share_app_state()
        _base.app();
        _base.loadHttp();
      }, function () {
        _base.loadHttp()
      });
  }


  /** SIngle Events **/
  singlegetnotifications() {
    let _base = this;
    _base.count = 5;
    let notiCount = 0;
    _base.nfcHttp.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        _base.app_state.notifications = success.result;
        success.result.forEach(item => {
          if (item.seen == false) {
            notiCount = notiCount + 1
          }
        });
        _base.app_state.noticount = notiCount;
        _base.share_app_state();
      }, function (error) {
      });
  }

  singlegetprofiledata() {
    let _base = this;
    this.loginHttp.getProfile(this.userId).then(function (success: any) {
      if (success) {
        _base.count = 2;
        localStorage.setItem('uid', success.result.uid);
        _base.app_state.profile = success.result;
        if (success.result.imageId) {
          let profileImage = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id;
          let base4img = profileImage;
          _base.convertToDataURLviaCanvas(profileImage, "image/png").then(base64img => {
            let base4img = base64img;
            _base.storage.remove("uimg")
            _base.app_state.display_picture = base4img;
            _base.storage.set('uimg', base4img);
          })
        } else {
          let base4img = "assets/images/avatar.png";
          _base.convertToDataURLviaCanvas(base4img, "image/png").then(base64img => {
            let base4img = base64img;
            _base.storage.remove("uimg")
            _base.storage.set('uimg', base4img);
            _base.app_state.alltaps = base4img;
          })
        }
        _base.share_app_state();
      }
    }, function (err) {
    })
  }

  share_app_state() {
    let _base = this;
    this.storage.remove("app_state")
      .then(function () {
        _base.storage.set("app_state", JSON.stringify(_base.app_state))
        _base.sharedHttp.httpLoad(_base.app_state)
      })
  }

  app() {
    let view = this.navCtrl.getActive();
    if (view.id == 'SynchroniserPage') {
      if (Object.keys(this.sharedata).length != 0) {
        this.navCtrl.setRoot("DashboardPage", this.sharedata)
        this.sharedata = {};
      } else {
        this.navCtrl.setRoot("DashboardPage");
      }
    }
  }

  ionViewDidLoad() {
    this.runtheshow();
  }

  runtheshow() {
    let _base = this;
    let interval = setInterval(function () {
      let button = document.querySelector('button');
      if (button) {
        button.click();
        clearInterval(interval)
      }
    })
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

}
