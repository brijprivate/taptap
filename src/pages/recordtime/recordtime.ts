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
  readingTag: boolean = false;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();

  //Timer related...
  public timeBegan = null
  public timeStopped: any = null
  public stoppedDuration: any = 0
  public started = null
  public running = false
  public blankTime = "00:00.00"
  public time = "00:00:00"
  public showTime = ""
  public showtimesub;
  public tapData: any;
  public isnetwork = "Online";
  deviceVerify: boolean = false;
  public record: any;

  public userId: any;
  selected: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nfc: NFC,
    public ndef: Ndef,
    public loading: LoadingController,
    public nfctagpro: NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert: AlertController, ) {
    this.userId = localStorage.getItem("userId");
    this.tapData = navParams.get("tapdata");
    //Get Network status...
    this.sharedservice.getNetworkStat().subscribe((value) => {
      console.log("network status------------------>>>>>>", value);
      this.isnetwork = value;
    });

   
  }
  saveTime() {
    this.navCtrl.push('SaveTimePage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordtimePage');
    let _base = this
    let count = 0;
    _base.showtimesub = setInterval(function () {
      _base.showTime = _base.time;
    }, 1000);
  }

  

  ionViewDidEnter(){
    console.log("didenter=----------------->>>>>>>");
  }
  //Start record time...

  start() {
    this.selected=true;
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

    if (this.running) return;
    if (this.timeBegan === null) {
      this.reset();
      this.timeBegan = new Date();
    }
    if (this.timeStopped !== null) {
      let newStoppedDuration: any = (+new Date() - this.timeStopped)
      this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
    }
    this.started = setInterval(this.clockRunning.bind(this), 100);
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
    for (let i = 0; i < digit; i++) {
      zero += '0';
    }
    return (zero + num).slice(-digit);
  }

  clockRunning() {
    let currentTime: any = new Date()
    let timeElapsed: any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
    let hour = timeElapsed.getUTCHours()
    let min = timeElapsed.getUTCMinutes()
    let sec = timeElapsed.getUTCSeconds()
    let ms = timeElapsed.getUTCMilliseconds();
    this.time =
      this.zeroPrefix(hour, 2) + ":" +
      this.zeroPrefix(min, 2) + ":" +
      this.zeroPrefix(sec, 2)

    console.log(this.time)
  };

  //Stop clock...
  stop() {
    this.selected=false;
    if (!this.time || !this.tapData || !this.record) {
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
    this.navCtrl.push('SaveTimePage', {
      endtime: this.time,
      nfcid: this.tapData,
      recordtype: this.record
    })
  }
}
