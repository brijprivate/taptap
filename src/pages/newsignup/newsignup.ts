
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Slides, Platform } from 'ionic-angular';
// import { RegistrationProvider } from "../../providers/registration/registration";
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ElementsProvider } from '../../providers/elements/elements';
import { MenuController } from 'ionic-angular';
import * as moment from 'moment';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
declare var SMS: any;


/**
 * Generated class for the NewsignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsignup',
  templateUrl: 'newsignup.html',
})
export class NewsignupPage {


  public isChecked: boolean = false;
  public isDone: any;
  currentOTP: number;
  data: any = {};
  options: InAppBrowserOptions =
    {
      location: 'no',
      clearcache: 'yes',
      toolbar: 'no',
      closebuttoncaption: 'back',
      hardwareback: 'no',
      zoom: "no"
    };


  @ViewChild(Slides) slides: Slides;


  constructor
    (
      public menuCtrl: MenuController,
      public navCtrl: NavController,
      public platform: Platform,
      public elem: ElementRef,
      public ep: ElementsProvider,
      public api: LoginsignupProvider,
      private camera: Camera,
      public nav: NavController,
      // public theInAppBrowser:InAppBrowser,
      public navParams: NavParams,
      public androidPermissions: AndroidPermissions,
      public alertCtrl: AlertController
    ) {
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);


  }




  //To slide the form through index

  nextform(index) {

    let _base = this;
    this.slides.lockSwipes(false);
    this.slides.slideTo(index, 250);
    this.slides.lockSwipes(true);


  }



}


