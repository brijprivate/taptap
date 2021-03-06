import { Component, ViewChild } from '@angular/core';
import { Platform, App, ToastController, ModalController, NavController } from 'ionic-angular';
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
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modalController: ModalController,
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

    this.arr = [];
    this.initializeApp();
    this.checkNetworkStatus();
    // });

    // _base.deeplinks.route({
    //   '/product': {},
    //   '/company': {}
    // }).subscribe(match => {
    //   // match.$route - the route we matched, which is the matched entry from the arguments to route()
    //   // match.$args - the args passed in the link
    //   // match.$link - the full link data
    //   
    //   
    //   
    //   

    //   if (match.$args.id) {
    //     _base.showProduct(match)
    //   } else if (match.$args.adminId) {
    //     _base.showcompanyProduct(match)
    //   } else {
    //     alert('This link is expired')
    //   }

    //   // alert(match.$args.category+"-"+match.$args.id)
    // }, nomatch => {
    //   // nomatch.$link - the full link data
    //   
    // });


    // });

    if (
      localStorage.getItem("userId") != undefined &&
      localStorage.getItem("userId").length != 0
    ) {
      this.rootPage = "SynchroniserPage";
    } else {
      localStorage.setItem("userId", "");
      this.rootPage = 'SignupPage';
      // this.rootPage = 'NewsignupPage';
      // this.rootPage = 'LoginPage';

    }
  }

  showProduct(match: any) {
    let _base = this
    if (match.$args.id != '' || match.$args.category != null) {

      if (match.$args.category == "Contact_info") {
        let data = {
          userId: localStorage.getItem("userId"),
          nfc_id: match.$args.id,
          location: '',
          purpose: '',
          geo: ''
        }
        _base.nfctagProvider.createTap(data).then(function (success: any) {

          if (!success.lostinfo.deviceInfo) {
            alert("This device is lost.")
          } else {
            // _base.navCtrl.setRoot('TapdetailsPage', {
            //   devicedetaill: success.lostinfo,
            //   key: 'device',
            //   islink: "true"
            // })
            _base.navCtrl.setRoot('SynchroniserPage', {
              devicedetaill: success.lostinfo,
              key: 'device',
              islink: "true"
            })
          }
        }, function (err) {

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
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'Contacts':
                object = {
                  contactId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'Sports':
                object = {
                  sportId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'Fashion':
                object = {
                  fashionId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'General':
                object = {
                  generalId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'Event':
                object = {
                  eventId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'Groceries':
                object = {
                  groceryId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'Restaurant':
                object = {
                  restaurantId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              case 'Verification':
                object = {
                  verificationId: item,
                  storeId: item.storeId,
                  islink: "true"
                }
                break;
              default:
            }

            _base.navCtrl.setRoot('SynchroniserPage', object);
          }, function (error) {
            alert("This link is expired")
            _base.platform.exitApp()
          });
      }
    }
  }

  showcompanyProduct(match: any) {
    let _base = this;
    _base.loginservice.getProductAdminCategory(match.$args.category, match.$args.adminId)
      .then(function (success: any) {
        if (success.result.length != 0) {

          let product = success.result[0]
          _base.showCompanyProduct(match.$args.category, product)
        } else {
          alert("This link is expired")
          _base.platform.exitApp()
        }
      }, function (error: any) {

        alert("This link is expired")
        _base.platform.exitApp()
      });
  }

  showCompanyProduct(categoryName, product) {

    let item = product;
    let object = {}

    switch (categoryName) {
      case 'Business':
        object = {
          businessId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'Contacts':
        object = {
          contactId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'Sports':
        object = {
          sportId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'Fashion':
        object = {
          fashionId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'General':
        object = {
          generalId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'Event':
        object = {
          eventId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'Groceries':
        object = {
          groceryId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'Restaurant':
        object = {
          restaurantId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      case 'Verification':
        object = {
          verificationId: item,
          storeId: item.storeId,
          islink: "true"
        }
        break;
      default:
    }
    this.navCtrl.setRoot('SynchroniserPage', object);
  }

  /**check network status - online/offline */
  checkNetworkStatus() {
    // watch network for a disconnect
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.sharedservice.setnetworkStat('Offline');

      if (this.networkStatus == "" || this.networkStatus == "Online") {
        this.showToast();
        this.networkStatus = "Offline";
      }
    });
    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.sharedservice.setnetworkStat('Online');

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


    let _base = this
    this.platform.ready().then(() => {



      _base.statusBar.styleLightContent();
      _base.statusBar.backgroundColorByHexString("#6354cb");
      _base.splashScreen.hide();


      _base.androidPermissions.checkPermission(_base.androidPermissions.PERMISSION.READ_CONTACTS).then(
        function (result) {

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

          if (!result.hasPermission) {
            _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          }
        },
        function (err) {
          _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        });


      _base.deeplinks.route({
        '/product': {},
        '/company': {}
      }).subscribe(match => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data





        if (localStorage.getItem('userId') != null || localStorage.getItem('userId') != undefined) {
          if (match.$args.id) {
            _base.showProduct(match)
          } else if (match.$args.adminId) {
            _base.showcompanyProduct(match)
          } else {
            alert('This link is expired')
          }
        } else {
          alert('Please login to see shared info')
          _base.navCtrl.setRoot('LoginPage')
        }

        // alert(match.$args.category+"-"+match.$args.id)
      }, nomatch => {
        // nomatch.$link - the full link data

      });


      // listen nfc tags
      _base.nfc.addMimeTypeListener("text/json",
        function (success) {

          alert("Success")
        }, function (error) {

          alert("Error")
        });




    });

  }

  shownearbypopup() {

    let modal = this.modalController.create("FeedpopupPage", {}, { showBackdrop: true, enableBackdropDismiss: true });
    modal.present();
  }

}

