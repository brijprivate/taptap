import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

/**
 * Generated class for the PairdevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pairdevice',
  templateUrl: 'pairdevice.html',
})
export class PairdevicePage {
  page='';
  public userId: any;
  public paircode: any;
  public tapData: any;
  public isnetwork = "Online";

  alertcs:any;
  readingTag: boolean = true;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(public navCtrl: NavController,
    public alert:AlertController,
    public navParams: NavParams,
    public nfc: NFC,
    public ndef: Ndef,
    public loading: LoadingController,
    public nfctagpro: NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController, ) {
    //Get Network status...
    this.sharedservice.getNetworkStat().subscribe((value) => {
      console.log("network status------------------>>>>>>", value);
      this.isnetwork = value;
    });

    this.page=this.navParams.get('x');
    console.log(this.page)
    this.userId = localStorage.getItem("userId");
    this.subscriptions.push(this.nfc.addNdefListener()
      .subscribe(data => {
        if (this.readingTag) {
          let tagid = data.tag.id;
          // let parsedid = this.nfc.bytesToString(tagid);
          let payload = data.tag.ndefMessage[0].payload;
          let tagContent = this.nfc.bytesToString(payload).substring(3);
          this.readingTag = true;

          var s = '';
          tagid.forEach(function (byte) {
            s += ('0' + (byte & 0xFF).toString(16)).slice(-2) + ':';
          });
          console.log("tag data", tagContent);
          console.log("whole data", data.tag);
          console.log("tag id", s);
          this.tapData = s.substring(0, s.length - 1);
          if(this.tapData){
            this.presentPrompt()
            
            
          }
          return s.substring(0, s.length - 1);

        }
      },
        err => {
        })
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PairdevicePage');
  }
  //Pair Device...
  pairDevice() {
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
    else if (!this.tapData) {
      let showtoast = this.toast.create({
        message: "please approach a TapTap device first",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    else if (!this.paircode) {
      let showtoast = this.toast.create({
        message: "Please enter your pair code",
        duration: 60000,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "Ok"
      })
      showtoast.present();
      return;
    }
    
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let pairdata = {
      nfc_id: this.tapData,
      secret_code: this.paircode,
      owner: this.userId
    }
    this.nfctagpro.pairDevice(pairdata).then(function (success: any) {
      console.log(success);
      loader.dismiss();
      if (success.error) {
        alert(success.message)
      } else {
        // _base.navCtrl.pop();
        _base.navCtrl.setRoot('ProfilePage');
      }
    }, function (err) {
      console.log(err);
      alert(JSON.parse(err._body).message)
      loader.dismiss();
    })
  }


  gotovack(){
    this.navCtrl.pop()
  }

ionViewDidLeave(){
  this.readingTag = false;
// this.alertcs.dismiss();
}

  presentPrompt() {
   


    // if(this.page=='page'){
      console.log('in promptwa 11111111111111111111111111111111111111');
      this.alertcs = this.alert.create({
       title: 'Provide Pairing Code',
       inputs: [
         {
           
           placeholder: 'Pairing code'
         },
       ],
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           handler: data => {
             console.log('Cancel clicked');
           }
         },
         {
           text: 'Save',
           handler: data => {
             console.log(data[0]);
             this.paircode=data[0]
             this.pairDevice();
           }
         }
       ]
     });
     this.alertcs.present();
    }
  //   this.page=''
  // }
}
