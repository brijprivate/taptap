import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { PairdevicePage } from '../pages/pairdevice/pairdevice';
import { SharedserviceProvider } from './../providers/sharedservice/sharedservice';
import { Network } from '@ionic-native/network';
import { BackgroundGeolocation, BackgroundGeolocationConfig, 
  BackgroundGeolocationResponse,BackgroundGeolocationEvents } from '@ionic-native/background-geolocation';
import { platformBrowser } from '@angular/platform-browser';
  declare var window;
import { Deeplinks } from '@ionic-native/deeplinks';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string = '';
  public disconnectSubscription: any;
  public connectSubscription: any;
  public networkStatus: String = "";
  public arr;

  constructor(private platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private network: Network,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    private deeplinks: Deeplinks,
    private backgroundGeolocation: BackgroundGeolocation) 
    {
      // platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString("#6354cb");
      // statusBar.styleDefault();
      splashScreen.hide();
      this.arr = [];
      this.initializeApp();
      
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
        this.sharedservice.setlinkid(match.$args.id);
        if(match.$args.id!='' || match.$args.id!=null){
          this.rootPage="TapdetailsPage";
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
      this.rootPage = 'LoginPage';
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
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Retry"
      })
      .present();
  }

  initializeApp(){
    this.platform.ready().then(()=>{

      console.log("initialized------------------------>>>>>>>>>>>>>>");
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  };
  
    this.backgroundGeolocation.configure(config)
    .then(() => {
  
      console.log(location);
      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
      .subscribe((location:BackgroundGeolocationResponse)=>{
        var locationstr = localStorage.getItem("location");
        // console.log(locationstr);
        console.log("original locationn-------------->>>>>>>>>>>>>");
        console.log(location);
        // if(locationstr == null){
          this.arr.push(location);
          this.sharedservice.locations(location);
          // console.log(location);
        // }
        // else{
        //   var locationarr = (locationstr);
        //   this.arr = locationstr;
        // }
        // localStorage.setItem("location",this.arr);
      })
    })
    window.app = this;
    });
   
  }
}

