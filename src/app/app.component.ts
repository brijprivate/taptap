import { Component, ViewChild } from '@angular/core';
import { Platform, App, ToastController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { PairdevicePage } from '../pages/pairdevice/pairdevice';
import { SharedserviceProvider } from './../providers/sharedservice/sharedservice';
import { LoginsignupProvider } from './../providers/loginsignup/loginsignup';
import { Network } from '@ionic-native/network';
import {
  BackgroundGeolocation, BackgroundGeolocationConfig,
  BackgroundGeolocationResponse, BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation';
import { platformBrowser } from '@angular/platform-browser';
declare var window;
import { Deeplinks } from '@ionic-native/deeplinks';
import { generate } from 'rxjs/observable/generate';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { NfctagProvider } from '../providers/nfctag/nfctag';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Socket } from 'ng-socket-io';
import { Geolocation } from '@ionic-native/geolocation';

declare let cordova: any;
declare let plugin: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('nav') navCtrl: NavController;


  location_watch: any;
  rootPage: string = '';
  params: any = {}
  public disconnectSubscription: any;
  public connectSubscription: any;
  public networkStatus: String = "";
  public arr;

  constructor(private platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public socket: Socket,
    private network: Network,
    private androidPermissions: AndroidPermissions,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    private deeplinks: Deeplinks,
    private loginservice: LoginsignupProvider,
    public nfc: NFC,
    public app: App,
    public geolocation: Geolocation,
    private backgroundGeolocation: BackgroundGeolocation,
    private locationAccuracy: LocationAccuracy,
    public nfctagProvider: NfctagProvider) {
    let _base = this;

    // platform.ready().then(() => {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    statusBar.styleLightContent();
    statusBar.backgroundColorByHexString("#6354cb");
    // statusBar.styleDefault();
    splashScreen.hide();
    this.arr = [];
    this.initializeApp();
    this.checkNetworkStatus();
    // });

    this.deeplinks.route({
      '/product': {},
    }).subscribe(match => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      console.log('Successfully matched route', match);
      console.log(match.$args.category);
      console.log(match.$args.id);

      if (match.$args.id != '' || match.$args.category != null) {
        console.log("========================================")
        if (match.$args.category == "Contact_info") {
          let data = {
            userId: localStorage.getItem("userId"),
            nfc_id: match.$args.id,
            location: '',
            purpose: '',
            geo: ''
          }
          _base.nfctagProvider.createTap(data).then(function (success: any) {
            console.log("suc------------", success)
            _base.navCtrl.setRoot('TapdetailsPage', {
              devicedetail: success.lostinfo,
              key: 'device'
            })
          }, function (err) {
            console.log("err---------------->", err);
            alert("Link is expired");
            _base.platform.exitApp();
          })
        } else {
          _base.loginservice.getProduct(match.$args.category, match.$args.id)
            .then(function (success: any) {
              if (success.error) {
                _base.platform.exitApp();
              }
              let item = success.result;

              let object = {}

              switch (match.$args.category) {
                case 'Business':
                  object = {
                    businessId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'Contacts':
                  object = {
                    contactId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'Sports':
                  object = {
                    sportId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'Fashion':
                  object = {
                    fashionId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'General':
                  object = {
                    generalId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'Event':
                  object = {
                    eventId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'Groceries':
                  object = {
                    groceryId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'Restaurant':
                  object = {
                    restaurantId: item,
                    storeId: item.storeId
                  }
                  break;
                case 'Verification':
                  object = {
                    verificationId: item,
                    storeId: item.storeId
                  }
                  break;
                default:
              }

              _base.navCtrl.setRoot('TapdetailsPage', object);
            }, function (error) {
              alert("This link is expired")
              _base.platform.exitApp()
            });
        }
      }

      // alert(match.$args.category+"-"+match.$args.id)
    }, nomatch => {
      // nomatch.$link - the full link data
      console.error('Got a deeplink that didn\'t match', nomatch);
    });


    // });

    if (
      localStorage.getItem("userId") != undefined &&
      localStorage.getItem("userId").length != 0
    ) {
      this.rootPage = "DashboardPage";
    } else {
      localStorage.setItem("userId", "");
      this.rootPage = 'SignupPage';
    }
  }

  /**check network status - online/offline */
  checkNetworkStatus() {
    // watch network for a disconnect
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.sharedservice.setnetworkStat('Offline');
      console.log("network was disconnected :-(");
      if (this.networkStatus == "" || this.networkStatus == "Online") {
        this.showToast();
        this.networkStatus = "Offline";
      }
    });
    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.sharedservice.setnetworkStat('Online');
      console.log("network connected!");
      if (this.networkStatus == "" || this.networkStatus == "Offline") {
        this.networkStatus = "Online";
      }
    });
  }
  showToast() {
    this.toast
      .create({
        message: "No Internet Connection, Turn on data to access all features",
        duration: 6000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Retry"
      })
      .present();
  }

  initializeApp() {

    this.InitSocket()

    let _base = this
    this.platform.ready().then(() => {

      _base.InitSocket()

      console.log("Cordova", plugin)


      _base.androidPermissions.checkPermission(_base.androidPermissions.PERMISSION.READ_CONTACTS).then(
        function (result) {
          console.log('Has permission?', result.hasPermission)
          if (!result.hasPermission) {
            _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.READ_CONTACTS)
          }
        },
        function (err) {
          _base.androidPermissions.requestPermissions([_base.androidPermissions.PERMISSION.READ_CONTACTS
          ])
        });

      _base.androidPermissions.checkPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        function (result) {
          console.log('Has permission?', result.hasPermission)
          if (!result.hasPermission) {
            _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          }
        },
        function (err) {
          _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        });


      // listen nfc tags
      _base.nfc.addMimeTypeListener("text/json",
        function (success) {
          console.log(success)
          alert("Success")
        }, function (error) {
          console.log(error)
          alert("Error")
        });



      console.log("initialized------------------------>>>>>>>>>>>>>>");
    });

  }

  InitSocket() {
    let _base = this;
    this.socket.on("connect", function (socket) {
      console.log(_base.socket.ioSocket.id)
      _base.socket.emit("user_connected", {})
    })

    this.socket.on("connect", function (socket) {
      console.log(_base.socket.ioSocket.id)
      _base.socket.emit("user_connected", { userId: localStorage.getItem('userId') })
    })

    this.socket.on("connected", function (socket) {
      console.log("user has been connected")

      // test - remove later
      _base.socket.emit("location", {
        latitude: 23.3558763,
        longitude: 87.6878509
      })

      // test end upto this

      _base.location_watch = _base.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe((resp) => {
        _base.socket.emit("location", {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        })
      })
    })

    this.socket.on('nearby', function (nearby: any) {
      console.log('Found Nearby')
    })

    this.socket.on('disconnect', function () {
      console.log('Got disconnect!');
      // _base.geolocation.clearWatch(_base.location_watch)
      _base.location_watch.unsubscribe()
    });
  }

}

