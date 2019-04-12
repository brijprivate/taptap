import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { PairdevicePage } from '../pages/pairdevice/pairdevice';
import { SharedserviceProvider } from './../providers/sharedservice/sharedservice';
import { Network } from '@ionic-native/network';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = '';
  public disconnectSubscription: any;
  public connectSubscription: any;
  public networkStatus: String = "";

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private network: Network,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController) 
    {
      platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString("#6354cb");
      // statusBar.styleDefault();
      splashScreen.hide();
      
    });

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
   checkNetworkStatus() 
   {
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
  showToast() 
  {
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
}

