import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { Subscription } from 'rxjs/Rx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
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

  //NFC read related ....
  readingTag:   boolean   = true;
  writingTag:   boolean   = false;
  isWriting:    boolean   = false;
  ndefMsg:      string    = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();

  //Timer related...
  public timeBegan = null
  public timeStopped:any = null
  public stoppedDuration:any = 0
  public started = null
  public running = false
  public blankTime = "00:00.00"
  public time = "00:00:00"

  public tapData:any;
  public isnetwork= "Online";
  deviceVerify:boolean = false;
  public record:any;
  public userId:any;

  public locations:any=[];
  public chkloc:boolean = false;
  public totaldis=0;
  public currentPosition:any;
  public endLocation:any;
  public checkp:boolean=false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private backgroundGeolocation: BackgroundGeolocation,
    public loading:LoadingController,
    public sharedservice: SharedserviceProvider,
    private nativeGeocoder: NativeGeocoder,
    public nfc: NFC,
    public ndef: Ndef,
    public nfctagpro:NfctagProvider,
    private toast: ToastController,
    public alert:AlertController,) 
    {
      this.userId = localStorage.getItem("userId");
       //Get Network status...
       this.sharedservice.getNetworkStat().subscribe((value)=>{
        console.log("network status------------------>>>>>>",value);
        this.isnetwork = value;
      });
    //  this.locations = [];
    //  this.startBackgroundTracking();
    this.sharedservice.getlocation().subscribe((value)=>{
      console.log("shared location------------>>>>>>>>>>.");
      console.log(value);
      if(Object.keys(value).length==0 || value == null){
        return;
      }else{
        this.locations.push(value);
          console.log("start location------------->>>>>>>",this.locations[0]);

          this.nativeGeocoder.reverseGeocode(this.locations[0].latitude, this.locations[0].longitude)
          .then((result: NativeGeocoderReverseResult[]) =>{
            this.checkp =true;
            console.log("reverse geocode ----------------->>>>>>>",result)
            console.log(JSON.stringify(result[0]));
            this.currentPosition = result[0];
          });
      
        console.log("array of locations------------->>>>>>>>");
        console.log(this.locations);
      }
    });

     //Read tag ....
     this.subscriptions.push(this.nfc.addNdefListener()
     .subscribe(data => {
       if (this.readingTag) {
         let tagid= data.tag.id;
         // let parsedid = this.nfc.bytesToString(tagid);
         let payload = data.tag.ndefMessage[0].payload;
         let tagContent = this.nfc.bytesToString(payload).substring(3);
         this.readingTag = true;

         var s = '';
         tagid.forEach(function(byte) {
           s += ('0' + (byte & 0xFF).toString(16)).slice(-2)+':';
         });
         console.log("tag data", tagContent);
         console.log("whole data", data.tag);
         console.log("tag id", s);
         this.tapData = s.substring(0, s.length - 1);
         if(this.tapData){
          this.verifytag();
         }
         return s.substring(0, s.length - 1);
         
         } 
       },
       err => {
       })
     );

   
     
    // subLocality.thoroughfare
    }

    //Verify user's NFC tag...
  verifytag(){
    let _base= this;
    if(this.isnetwork == "Offline")
    {
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
    else if(!this.tapData){
      let showtoast = this.toast.create({
        message: "Please approach your nfc device to verify",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();
    let data = {
      userid:this.userId,
      nfcId:this.tapData
    } 
    this.nfctagpro.verifyDevice(data).then(function(success:any){
      console.log(success);
      loader.dismiss();
      _base.deviceVerify = true;
      _base.presentAlert();
    },function(err){
      console.log(err);
      loader.dismiss();
      alert("Your device is not paired");
    })
  }
  presentAlert() {
    let alert = this.alert.create({
      title: 'Confirmation',
      subTitle: 'Verified',
      buttons: ['OK']
    });
    alert.present();
  }

    startBackgroundTrack()
    {
      let _base= this;
      if(this.isnetwork == "Offline")
      {
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
  
      else if(!this.tapData)
      {
        let showtoast = this.toast.create({
          message: "Please approach your paired nfc device to verify",
          duration: 60000,
          position: "bottom",
          showCloseButton: true,
          closeButtonText: "Ok"
        })
        showtoast.present();
        return;
      }
      else if(!this.record)
      {
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
      
      if(this.running) return;
    if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
    }
    if (this.timeStopped !== null) {
      let newStoppedDuration:any = (+new Date() - this.timeStopped)
      this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
    }
    this.started = setInterval(this.clockRunning.bind(this), 10);
    this.running = true;
    this.backgroundGeolocation.start();
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
      for(let i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    }
  
    clockRunning()
    {
      let currentTime:any = new Date()
      let timeElapsed:any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
      let hour = timeElapsed.getUTCHours()
      let min = timeElapsed.getUTCMinutes()
      let sec = timeElapsed.getUTCSeconds()
      let ms = timeElapsed.getUTCMilliseconds();
    this.time =
      this.zeroPrefix(hour, 2) + ":" +
      this.zeroPrefix(min, 2) + ":" +
      this.zeroPrefix(sec, 2) + "." +
      this.zeroPrefix(ms, 2);
    };
    ionViewDidLoad() {
      console.log('ionViewDidLoad RecordmilagePage');
      // this.loop();
    }
  startBackgroundTracking(){
    window.app.backgroundGeolocation.start();
  }

  //stop tracking .....
  stopBackgroundTrack(){

    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();
  
    this.backgroundGeolocation.getCurrentLocation().then((location:BackgroundGeolocationResponse)=>{
      console.log("location on stop--------->>>>>>",location);
      this.nativeGeocoder.reverseGeocode(location.latitude,location.longitude)
      .then((result: NativeGeocoderReverseResult[]) =>{
        console.log("reverse geocode end location----------------->>>>>>>",result)
        console.log(JSON.stringify(result[0]));
        this.endLocation = result[0];
      });
        this.sharedservice.locations(location);
    })
    
      this.loop();
      loader.dismiss();
      this.backgroundGeolocation.stop();
      if(this.currentPosition.latitude == this.endLocation.latitude)
      {
        alert("Oops it seems yor are in same position");
        return;
      }
      else {
        this.navCtrl.push('SavemilagePage',
        {
          endtime:this.time,
          nfcid:this.tapData,
          recordtype:this.record,
          distance:this.totaldis,
          startlocation:this.currentPosition,
          endLocation:this.endLocation,
          cords:this.locations
        });
      }
      
  }




//calculate distance locations loop....
public loop(){
  let i=0;

  var laa1=0
  var laa2=0
  var loa1=0
  var loa2=0
 
  for(i=0;i<this.locations.length;i++){
    console.log("first location------->>>>",i[0]);
    if(i==this.locations.length-1){
      return;
    }
    laa1=this.locations[i].latitude;
    laa2=this.locations[i+1].latitude;
    loa1=this.locations[i].longitude;
    loa2=this.locations[i+1].longitude;
    
    var x=this.distance(laa1,loa1,laa2,loa2,'K')
    
    this.totaldis=parseInt( (this.totaldis+x).toFixed(2));
    console.log('total distance',this.totaldis);
    
  }

}
//calculation function....
 distance(lat1, lon1, lat2, lon2, unit) {

	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}


//  GetDistanceFromLatLonInKm(lat1,  lon1,  lat2,  lon2)
// {
//   console.log(lat1,  lon1,  lat2,  lon2)
//     var R = 6371;
//     // Radius of the earth in km
//     var dLat = this.deg2rad(lat2 - lat1);
//     // deg2rad below
//     var dLon = this.deg2rad(lon2 - lon1);
//     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     var d = R * c;
//     // Distance in km
//     console.log('babuwa',d)
//     return d;
// }
//  deg2rad( deg)
// {
//     return deg * (Math.PI / 180);
// }
}
