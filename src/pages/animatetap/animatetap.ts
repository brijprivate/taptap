import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Subscription } from 'rxjs/Rx';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

/**
 * Generated class for the AnimatetapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-animatetap',
  templateUrl: 'animatetap.html',
})
export class AnimatetapPage {

   //NFC read related ....
   readingTag:   boolean   = true;
   writingTag:   boolean   = false;
   isWriting:    boolean   = false;
   ndefMsg:      string    = '';
   subscriptions: Array<Subscription> = new Array<Subscription>();
   public tapData:any;

   public userId:any;
   public isnetwork= "Online";
   deviceVerify:boolean = false;
   public keyvalue:any;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfc: NFC,
    public ndef: Ndef,
    public viewCtrl: ViewController,
    public loading:LoadingController,
    public nfctagProvider:NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert:AlertController,) 
  {
    this.userId = localStorage.getItem("userId");
    this.keyvalue = navParams.get("key");
    console.log(this.keyvalue);
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
      console.log("tag id", s.substring(0, s.length - 1));
      this.tapData = s.substring(0, s.length - 1);
      if(this.tapData){
        // this.createTap();
        this.readingTag = false;
        this.verifytag();
      }
      return s.substring(0, s.length - 1);
      
      } 
    },
    err => {
    })
  );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnimatetapPage');
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
    this.nfctagProvider.verifyDevice(data).then(function(success:any){
      console.log(success);
      loader.dismiss();
      _base.deviceVerify = true;
      if(_base.keyvalue == 'milage'){
        _base.navCtrl.pop();
        _base.navCtrl.push("RecordmilagePage",{tapdata:_base.tapData});
      }else if(_base.keyvalue == 'time'){
        _base.navCtrl.pop();
        _base.navCtrl.push("RecordtimePage",{tapdata:_base.tapData});
      }
      // _base.presentAlert();
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
}
