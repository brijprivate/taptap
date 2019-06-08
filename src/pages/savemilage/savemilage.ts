import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { NativeGeocoder,NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { BackgroundGeolocation,BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

/**
 * Generated class for the SavemilagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-savemilage',
  templateUrl: 'savemilage.html',
})
export class SavemilagePage {

  public nfcid:any;
  public endtime:any;
  public recordtype:any;
  public presentDate:any;
  public title:any;
  public description:any;
  public isnetwork= "Online";
  public userId:any;
  public currentpos:any;
  public endPos:any;
  // public distance:any;
  public cords:any;
  public locations:any=[];
  public endLocation:any=[];
  public totaldis=0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfctagPro:NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert:AlertController,
    public loading:LoadingController,
    private nativeGeocoder: NativeGeocoder,
    private backgroundGeolocation: BackgroundGeolocation,) 
  {
    this.userId = localStorage.getItem("userId");
    this.nfcid = this.navParams.get("nfcid");
    this.endtime = this.navParams.get("endtime");
    this.recordtype = this.navParams.get("recordtype");
    // this.distance = this.navParams.get("distance");
    this.currentpos = this.navParams.get("startlocation");
    // this.endPos = this.navParams.get("endLocation");
    // this.cords = this.navParams.get("cords");
    console.log(this.endtime);
    this.presentDate = Date.now();

     //Get Network status...
     this.sharedservice.getNetworkStat().subscribe((value)=>{
      console.log("network status------------------>>>>>>",value);
      this.isnetwork = value;
    });


    this.sharedservice.getlocation().subscribe((value)=>{
      console.log("shared location------------>>>>>>>>>>.");
      console.log(value);
      if(Object.keys(value).length==0 || value == null){
        return;
      }else{
        this.locations.push(value);
        console.log("array of locations------------->>>>>>>>");
        console.log(this.locations);
        this.loop();
      }
    });

     this.backgroundGeolocation.getCurrentLocation().then((location:BackgroundGeolocationResponse)=>{
      console.log("location on stop--------->>>>>>",location);
      this.nativeGeocoder.reverseGeocode(location.latitude,location.longitude)
      .then((result: NativeGeocoderReverseResult[]) =>{
        console.log("reverse geocode end location----------------->>>>>>>",result)
        console.log(JSON.stringify(result[0]));
        this.endLocation = result[0];
        this.sharedservice.locations(location);
        this.backgroundGeolocation.stop();
      });
    });
  }
  // backprevious(){
  //   // this.navCtrl.pop('RecordtimePage');

  // }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SavemilagePage');
  }

  //save milage....
  saveMilage()
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
    else if(!this.title)
    {
      let showtoast = this.toast.create({
        message: "Please provide title",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if(!this.description)
    {
      let showtoast = this.toast.create({
        message: "Please provide description",
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
    let timedata = {
      recordtype:this.recordtype,
      date:this.presentDate,
      title:this.title,
      description:this.description,
      startTime:"00:00:00",
      endTime:this.endtime,
      userId:this.userId,
      nfc_id:this.nfcid,
      milage:this.totaldis,
      cords:this.locations,
      startLocation:this.currentpos.locality+ this.currentpos.thoroughfare,
      endLocation:this.endLocation.locality+ this.endLocation.thoroughfare
    }
    console.log("milage data -------------------->>>>",timedata);
    console.log(timedata);
    this.nfctagPro.createMilage(timedata).then(function(success:any){
      console.log(success);
      loader.dismiss();
      _base.presentAlert();
      _base.navCtrl.push('ProfilePage');
     
    },function(err){
      console.log(err);
      loader.dismiss();
     
    })
  }
  presentAlert() {
    let alert = this.alert.create({
      title: 'Confirmation',
      subTitle: 'Milage Saved',
      buttons: ['OK']
    });
    alert.present();
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
    
    var x=this.distance(laa1,loa1,laa2,loa2,'K');
    
    this.totaldis=parseInt( (this.totaldis+x).toFixed(2));
    
    console.log('total distance',this.totaldis);
    // if(this.totaldis){
      console.log("in loooooopppppppppp----------->>>>>>>");
     
    // }
    
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

}
