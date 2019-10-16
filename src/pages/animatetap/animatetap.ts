import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Subscription } from 'rxjs/Rx';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import * as CryptoJS from 'crypto-js';
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

  public encryptSecretKey = "the_quick_brown_fox_jumps_over_the_lazy_dog";
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

      console.log(tagContent)
      
      let nfc_regex = /^(((([0-9]|[a-z]){2}):){6})(([0-9]|[a-z]){2})/i;
      let res = nfc_regex.test(tagContent);

      if (res) {
        // nfc id
        this.readingTag = false;
        this.verifytag(tagContent);
      } else {
        // encrypted data
        this.readingTag = false;
        this.decryptData(tagContent);
      }
      // let payload = data.tag.ndefMessage[0].payload;
      // let tagContent = this.nfc.bytesToString(payload).substring(3);
      // this.readingTag = true;

      // var s = '';
      // tagid.forEach(function(byte) {
      //   s += ('0' + (byte & 0xFF).toString(16)).slice(-2)+':';
      // });
      // console.log("tag data", tagContent);
      // console.log("whole data", data.tag);
      // console.log("tag id", s.substring(0, s.length - 1));
      // this.tapData = s.substring(0, s.length - 1);
      // if(this.tapData){
      //   // this.createTap();
      //   this.readingTag = false;
      //   this.verifytag();
      // }
      // return s.substring(0, s.length - 1);
      
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
   verifytag(tagdata){
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
    else if(!tagdata){
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
      nfcId:tagdata
    } 
    this.nfctagProvider.verifyDevice(data).then(function(success:any){
      console.log(success);
      loader.dismiss();
      if(success.message == 'Device not found with user'){
        alert("This is not a paired device");
        _base.readingTag = true;
        return;
      }
      // _base.deviceVerify = true;
      else if(_base.keyvalue == 'milage'){
        // _base.navCtrl.pop();
        _base.navCtrl.push("RecordmilagePage",{tapdata:_base.tapData});
      }else if(_base.keyvalue == 'time'){
        // _base.navCtrl.pop();
        _base.navCtrl.push("RecordtimePage",{tapdata:_base.tapData});
      }else if(_base.keyvalue == 'delete'){
        _base.delete(_base.tapData);
      }
      // _base.presentAlert();
    },function(err){
      console.log(err);
      loader.dismiss();
      alert("Your device is not paired");
      _base.readingTag = true;
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

  delete(nfcid) {
    let alert = this.alert.create({
      title: 'Are you sure want to delete',
     
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            this.navCtrl.pop();
          }
        },
        {
          text: 'Yes',
          handler: data => {
              this.deleteDevice(nfcid);
          }
        }
      ]
    });
    alert.present();
  }

  deleteDevice(nfcid){
    // this.navCtrl.push('AnimatetapPage',{key:"delete"})
    var _base=this;
    this.nfctagProvider.deletedevice(nfcid).then(function(success:any){
      // _base.getpairedDevice();
      // _base.navCtrl.setRoot('ManagedevicePage');
      _base.navCtrl.pop();
    },function(err){
      alert("unable to delete device please try again");
    })
  }
  back(){
    this.navCtrl.pop();
  }

  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        this.tapData= JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log(this.tapData)
        this.verifytag(this.tapData)
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

}
