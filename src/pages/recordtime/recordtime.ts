import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Subscription } from 'rxjs/Rx';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
// import { SaveTimePage } from '../save-time/save-time';

/**
 * Generated class for the RecordtimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recordtime',
  templateUrl: 'recordtime.html',
})
export class RecordtimePage {

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfc: NFC,
    public ndef: Ndef,
    public loading:LoadingController,
    public nfctagpro:NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert:AlertController,)
    {
       //Get Network status...
       this.sharedservice.getNetworkStat().subscribe((value)=>{
        console.log("network status------------------>>>>>>",value);
        this.isnetwork = value;
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
    }
  saveTime(){
    this.navCtrl.push('SaveTimePage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordtimePage');
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
    this.nfctagpro.verifyDevice(this.tapData).then(function(success:any){
      console.log(success);
      loader.dismiss();
      _base.deviceVerify = true;
    },function(err){
      console.log(err);
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

  //Start record time...

  start() {
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

    else if(!this.tapData || this.deviceVerify ==false)
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

  //Stop clock...
  stop() 
  {
    if(!this.time || !this.tapData || !this.record){
      let showtoast = this.toast.create({
        message: "Please start ",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    this.running = false;
    this.timeStopped = new Date();
    clearInterval(this.started);
    console.log(this.time);
    this.navCtrl.push('SaveTimePage',{
      endtime:this.time,
      nfcid:this.tapData,
      recordtype:this.record
    })
  }
}
