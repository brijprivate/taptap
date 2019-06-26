import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { Ndef, NFC } from '@ionic-native/nfc';
import { Subscription } from 'rxjs/Rx';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the TapmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tapmodal',
  templateUrl: 'tapmodal.html',
})
export class TapmodalPage {

  //NFC read related ....
  readingTag: boolean = true;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  public tapData: any;
  public geo: any = {}

  public userId: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nfc: NFC,
    public ndef: Ndef,
    public viewCtrl: ViewController,
    public loading: LoadingController,
    private geolocation: Geolocation,
    public nfctagProvider: NfctagProvider) {
    this.userId = localStorage.getItem("userId");
    //Read tag ....
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
          console.log("tag id", s.substring(0, s.length - 1));
          this.tapData = s.substring(0, s.length - 1);
          if (this.tapData) {
            this.createTap();
          }
          return s.substring(0, s.length - 1);

        }
      },
        err => {
        })
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TapmodalPage');
  }

  ionViewDidEnter() {
    console.log("view enter-------->>>>");
    let _base = this
    _base.geolocation.getCurrentPosition().then((resp) => {
      _base.geo.latitude = resp.coords.latitude
      _base.geo.longitude = resp.coords.longitude
      _base.readingTag = true;
      console.log(_base.geo)
    }).catch((error) => {
      console.log('Error getting location', error);
    })
  }
  ionViewDidLeave(){
    this.readingTag = false;
  }
  closeModal() {
    this.viewCtrl.dismiss();
    // this.navCtrl.setRoot('HomePage');
  }

  //Save tap .....
  createTap() {
    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let data = {
      userId: this.userId,
      nfc_id: this.tapData,
      location: '',
      purpose: '',
      geo: this.geo
    }
    this.nfctagProvider.createTap(data).then(function (success: any) {
      console.log(success);
      loader.dismiss();
      _base.readingTag = false;
      _base.viewCtrl.dismiss();
      if(success.message == 'DEVICE LOST INFO'){
        _base.navCtrl.setRoot('LostcardPage',{lostinfo:success.lostinfo});
      }
      else if(success.message == "DEVICE INFO "){
        console.log("deviceinfo--------------->>>>");
        _base.navCtrl.push('TapdetailsPage',{devicedetail:success.lostinfo,
        key:'device'});
      }
      else if(success.message == 'Item Tapped Successfull'){
        console.log("detail page------->>>>");
        // _base.navCtrl.push('TapdetailsPage',{itemdetails:success.result});
        _base.navCtrl.push('TapdetailsPage',success.result);


      }
    },function(err){
      console.log(err);
      loader.dismiss();
    })
  }

  gotovack() {
    this.navCtrl.pop()
  }
}
