import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

/**
 * Generated class for the SaveTimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-save-time',
  templateUrl: 'save-time.html',
})
export class SaveTimePage {
  public nfcid:any;
  public endtime:any;
  public recordtype:any;
  public presentDate:any;
  public title:any;
  public description:any;
  public isnetwork= "Online";
  public userId:any;

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
      console.log(this.endtime);
      this.presentDate = Date.now();

       //Get Network status...
       this.sharedservice.getNetworkStat().subscribe((value)=>{
        console.log("network status------------------>>>>>>",value);
        this.isnetwork = value;
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaveTimePage');
  }

  //API call for save time and data....
  saveTime()
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
      recordType:this.recordtype,
      date:this.presentDate,
      title:this.title,
      description:this.description,
      startTime:"00:00:00",
      endTime:this.endtime,
      userId:this.userId,
      nfc_id:this.nfcid
    }
    console.log(timedata);
    this.nfctagPro.recordTime(timedata).then(function(success:any){
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
      subTitle: 'Time Saved',
      buttons: ['OK']
    });
    alert.present();
  }
  back(){
    this.navCtrl.pop()
  }
}
