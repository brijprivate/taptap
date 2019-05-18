import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

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
  public distance:any;
  public cords:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfctagPro:NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert:AlertController,
    public loading:LoadingController,) 
  {
    this.userId = localStorage.getItem("userId");
    this.nfcid = this.navParams.get("nfcid");
    this.endtime = this.navParams.get("endtime");
    this.recordtype = this.navParams.get("recordtype");
    this.distance = this.navParams.get("distance");
    this.currentpos = this.navParams.get("startlocation");
    this.endPos = this.navParams.get("endLocation");
    this.cords = this.navParams.get("cords");
    console.log(this.endtime);
    this.presentDate = Date.now();

     //Get Network status...
     this.sharedservice.getNetworkStat().subscribe((value)=>{
      console.log("network status------------------>>>>>>",value);
      this.isnetwork = value;
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
      Nfc_id:this.nfcid,
      milage:this.distance,
      cords:this.cords,
      startLocation:this.currentpos.locality+ this.currentpos.thoroughfare,
      endLocation:this.endPos.locality+ this.endPos.thoroughfare
    }
    console.log("milage data -------------------->>>>",timedata);
    console.log(timedata);
    this.nfctagPro.createMilage(timedata).then(function(success:any){
      console.log(success);
      loader.dismiss();
      alert("hshwhskc bkbckc bckabckbc j,bckabcks");
    },function(err){
      console.log(err);
      loader.dismiss();
      alert("error");
    })
  }

}
