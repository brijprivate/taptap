import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { Subscription } from 'rxjs/Rx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

// import { Diagnostic } from '@ionic-native/diagnostic';
declare var window;
// import { SavemilagePage } from '../savemilage/savemilage';

/**
 * Generated class for the RecordmilagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recordmilage',
  templateUrl: 'recordmilage.html',
})
export class RecordmilagePage {
  unit='KM';
  multiplier=1;
  //NFC read related ....
  readingTag: boolean = false;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  active:boolean=false;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  //Timer related...
  public timeBegan = null
  public timeStopped: any = null
  public stoppedDuration: any = 0
  public started = null
  public running = false
  public blankTime = "00:00.00"
  public time="00:00.00"

  public tapData: any;
  public isnetwork = "Online";
  deviceVerify: boolean = false;
  public record: any;
  public userId: any;

  public locations: any = [];
  public chkloc: boolean = false;
  public totaldis = 0;
  public currentPosition: any;
  public endLocation: any;
  public checkp: boolean = false;
  islocation: boolean = false;
  
  // to display on screen only
  sdistance: any;
  stime: any;
  startTime: any;
  endTime: any;
  value:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private backgroundGeolocation: BackgroundGeolocation,
    public loading: LoadingController,
    public sharedservice: SharedserviceProvider,
    private nativeGeocoder: NativeGeocoder,
    public nfc: NFC,
    public ndef: Ndef,
    public nfctagpro: NfctagProvider,
    private toast: ToastController,
    public alert: AlertController,
    private locationAccuracy: LocationAccuracy
    // private diagnostic: Diagnostic
  ) {
    this.enableLocation();
    this.userId = localStorage.getItem("userId");
    this.tapData = navParams.get("tapdata");

    //Get Network status...
    this.sharedservice.getNetworkStat().subscribe((value) => {
      console.log("network status------------------>>>>>>", value);
      this.isnetwork = value;
    });
    //  this.locations = [];
    //  this.startBackgroundTracking();
    this.sharedservice.getlocation().subscribe((value:any) => {
      console.log("shared location------------>>>>>>>>>>.");
      console.log(value);
      if (Object.keys(value).length == 0 || value == null) {
        return;
      } else {
        this.locations.push(value);
        if(value.latitude && value.longitude){
          this.loop(value);
          console.log("updated location------------->>>>>>>", value);
        }


        let loader = this.loading.create({
          content: "Please wait..."
        });
        loader.present();

        this.nativeGeocoder.reverseGeocode(this.locations[0].latitude, this.locations[0].longitude)
          .then((result: NativeGeocoderReverseResult[]) => {
            console.log("reverse geocode ----------------->>>>>>>", result)
            console.log(JSON.stringify(result[0]));
            this.currentPosition = result[0];
            this.checkp = true;
            loader.dismiss();
          });

        console.log("array of locations------------->>>>>>>>");
        console.log(this.locations);
      }
    });
  }

  ionViewDidLoad() {
    this.enableLocation();
    // to display on screen only
    let _base = this;
    _base.sdistance = _base.totaldis;
    _base.stime = _base.time;
    // setInterval(function () {
    //   console.log("interval location",_base.locations);
    //   // if(_base.locations.length >= 2){
    //     // _base.loop(_base.locations);
    //     _base.sdistance = _base.totaldis;
    //     _base.sdistance=(_base.sdistance*_base.multiplier).toFixed(2);
    //     _base.stime = _base.time;
    //   // }
    //   // }
    //   // _base.sdistance = _base.totaldis;
    //   // _base.sdistance=(_base.sdistance*_base.multiplier).toFixed(2);
    //   // _base.stime = _base.time;
    // }, 500);
  }


  startBackgroundTrack() {
    this.backgroundGeolocation.start();

    let _base = this;
    if (this.isnetwork == "Offline") {
      let showtoast = this.toast.create({
        message: "Please check your internet connection and try again",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if (this.islocation == false) {

      this.enableLocation();
      return;
    }

    else if (!this.record) {
      let showtoast = this.toast.create({
        message: "Please select one record type before start",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }

    this.startTime = new Date().toTimeString().slice(0,8);
    if (this.running) return;
    else if (this.timeBegan === null) {
      this.reset();
      this.timeBegan = new Date();
    }
    else if (this.timeStopped != null) {
      let newStoppedDuration: any = (+new Date() - this.timeStopped)
      this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
    }
    this.active=!this.active;
    this.started = setInterval(this.clockRunning.bind(this), 100);
    this.running = true;
    // this.loop();
  }
  reset() {
    this.running = false;
    clearInterval(this.started);
    this.stoppedDuration = 0;
    this.timeBegan = null;
    this.timeStopped = null;
    this.time = this.blankTime;
  }

  zeroPrefix(num, digit) {
    let zero = '';
    for (let i = 0; i < digit; i++) {
      zero += '0';
    }
    return (zero + num).slice(-digit);
  }

  clockRunning() {
    let currentTime: any = new Date();
    // this.time = new Date().getTime();
    let timeElapsed: any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
    let hour = timeElapsed.getUTCHours()
    let min = timeElapsed.getUTCMinutes()
    let sec = timeElapsed.getUTCSeconds()
    let ms = timeElapsed.getUTCMilliseconds();
    this.time =
      this.zeroPrefix(hour, 2) + ":" +
      this.zeroPrefix(min, 2) + ":" +
      this.zeroPrefix(sec, 2)
      // this.zeroPrefix(ms, 2);
  }


  //stop tracking .....
  stopBackgroundTrack() {
    this.endTime = new Date().toTimeString().slice(0,8);
    this.navCtrl.push('SavemilagePage',
      {
        endtime: this.endTime,
        starttime:this.startTime,
        nfcid: this.tapData,
        recordtype: this.record,
        distance: this.totaldis,
        startlocation: this.currentPosition,
        endLocation: this.endLocation,
        cords: this.locations,
        unit:this.unit
      });
      this.active=!this.active;
console.log(this.totaldis);
  }




  //calculate distance locations loop....
  public loop(value) {

    // var loca=[{
    //   latitude: 23.69001,
    //   longitude: 86.922403,
    // },{
    //   latitude: 23.510462,
    //   longitude: 87.342106,
    // },{
    //   latitude: 23.512262,
    //   longitude: 87.338405,
    // },{
    //   latitude: 23.514485,
    //   longitude: 87.334950,
    // },{
    //   latitude: 23.516758,
    //   longitude: 87.330852,
    // },{
    //   latitude: 23.520909,
    //   longitude: 87.323277,
    // }]

    // console.log(this.value,value,'oooooooooooooooooooooooooooooooooooo  ')
    // let i = 0;

    // var laa1 = 0
    // var laa2 = 0
    // var loa1 = 0
    // var loa2 = 0

    //   var _base=this;
    // var u=0;
    // var xx=setInterval(function(){
    //   if(u==5){
    //     clearTimeout(xx)
    //   }
    //      laa1 = loca[u].latitude;
    //   laa2 = (loca[u + 1].latitude);
    //   loa1 = (loca[u].longitude);
    //   loa2 = (loca[u + 1].longitude);
    //   var x = _base.distance(laa1, loa1, laa2, loa2, 'K');
    //   console.log(x)
    //   _base.totaldis = _base.totaldis+x
    //   console.log(_base.totaldis)
    //   u=u+1;
      
    //    }, 2000);
    if(this.locations.length==1){
      this.value=this.locations[0];
    }
    console.log(this.value.latitude, this.value.longitude, value.latitude, value.longitude, 'K')
    var x = this.distance(this.value.latitude, this.value.longitude, value.latitude, value.longitude, 'K');
      this.value=value;
      this.totaldis = (this.totaldis + x);
      console.log('total distance-------------------->>>>>>>>',this.totaldis)
      this.sdistance=(this.sdistance*this.multiplier).toFixed(2);

    // for (i = 0; i < this.locations.length; i++) {
    //   console.log("first location------->>>>", i[0]);
    //   if (i == this.locations.length - 1) {
    //     return;
    //   }
    //   laa1 = this.locations[i].latitude;
    //   laa2 = (this.locations[i + 1].latitude);
    //   loa1 = (this.locations[i].longitude);
    //   loa2 = (this.locations[i + 1].longitude);

      
      // var x = this.distance(laa1, loa1, laa2, loa2, 'K');
    //   console.log(x,this.totaldis+"------------------------------------------>>>>>>>>>")
    //   this.totaldis = parseInt((this.totaldis + x).toFixed(2));

    //   console.log('total distance', this.totaldis);
      

    // }


  }
  //calculation function....
  distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }


  enableLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      console.log("in condition");
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => this.islocation = true,

          error => this.islocation = true
        );
      }

    });
  }
  change(event){
    console.log(event.target.checked);
    if(event.target.checked){
      this.unit='MPH';
      this.multiplier=0.621371;
    }
    else if(!event.target.checked){
  
      this.unit='KM';
      this.multiplier=1;
    }
 
  }
 
 

  back(){
    this.navCtrl.pop()
  }
}
