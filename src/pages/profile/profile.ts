import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { PairdevicePage } from '../pairdevice/pairdevice';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Storage } from '@ionic/storage';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';


declare var anychart;
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  profileImage: string;
  API_URL = "https://api.taptap.org.uk";

  doughnutChart: any;
  barChart: any;
  lineChart: any;
  public userId: any;
  public userName: any;
  public favourite: any = "0";
  public devices: any = [];
  devicecount: any;
  public chart;
  notiCount: number = 0;
  uid: any;
  public tpmilage = 0;
  public tbmilage = 0;
  public tptime = 0;
  public tbtime = 0;
  showtimesub: number;
  pretime: boolean = false;
  premilage: boolean = false;
  interval: any;
  maindevice: any;
  totalPtime = 0;
  totalBtime = 0;
  totalPmilage = 0;
  totalBmilage = 0;
  showchart = true;
  type: any;
  base4img: any;

  constructor(public navCtrl: NavController,
    public sharedservice: SharedserviceProvider,
    public navParams: NavParams,
    public nfc: NFC,
    public nfctagProvider: NfctagProvider,
    public loginsignupProvider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,
    public storage: Storage, ) {
    var time = new Date().toTimeString();

    this.userId = localStorage.getItem("userId");


    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {

        _base.getnotifications(response.noticount)
        _base.getpairedDevice(response.devices)
        _base.getprofiledata(response.profile, response.display_picture)
        _base.favourite = response.favcount;
        _base.getcount(response.chdata)
      })

  }
  goto(page) {

    this.navCtrl.push(page)
  }


  chartfunction() {

    let _base = this;


    if (_base.chart) {
      _base.chart.dispose()
    }
    _base.chart = anychart.pie([
      { x: "Business_Milage", value: _base.tbmilage },
      { x: "Personal_Milage ", value: _base.tpmilage },
      { x: "Business_Time", value: _base.tbtime },
      { x: "Personal_Time", value: _base.tptime },
    ]);

    _base.chart.innerRadius("25%");

    var label = anychart.standalones.label();

    label.text("ThingTap");
    label.width("100%");
    label.height("100%");
    label.adjustFontSize(true);
    label.fontColor("#60727b");
    label.hAlign("center");
    label.vAlign("middle");
    _base.chart.legend(false);

    let interval = setInterval(function () {
      let element = (<HTMLElement>document.getElementById('donut-example'));
      if (element) {

        _base.chart.center().content(label);
        _base.chart.container("container1");
        _base.chart.draw();
        clearInterval(interval)
      }
    }, 100)

  }


  notifications() {
    this.navCtrl.push("NotificationPage")
  }



  pairDevice() {
    this.navCtrl.push('PairdevicePage', { x: 'pair' });
  }
  manageDevice() {
    clearInterval(this.interval);
    this.navCtrl.push('ManagedevicePage');

  }
  recordMilage() {

    let _base = this

    _base.nfc.enabled().then(function (success) {
      _base.navCtrl.push('AnimatetapPage', { key: 'milage' });
    }, function (error) {
      if (error == 'NO_NFC') {
        alert('This device do not support nfc read')
      } else if (error == 'NFC_DISABLED') {
        alert('NFC Read is disabled. Please enable NFC')
      } else {
        alert('Unsupported NFC')
      }
      return
    })
    // this.navCtrl.push('RecordmilagePage');



  }


  recordTime() {
    let _base = this
    _base.nfc.enabled().then(function (success) {
      _base.navCtrl.push('AnimatetapPage', { key: 'time' });
    }, function (error) {

      if (error == 'NO_NFC') {
        alert('This device do not support nfc read')
      } else if (error == 'NFC_DISABLED') {
        alert('NFC Read is disabled. Please enable NFC')
      } else {
        alert('Unsupported NFC')
      }
      return
    })

    // this.navCtrl.push('RecordtimePage');
  }
  editprofile() {
    this.navCtrl.push('EditprofilePage');

  }
  merchant() {
    this.navCtrl.push('MerchantPage');

  }
  category() {
    this.navCtrl.push('CategoryPage');

  }
  profileDetail() {
    this.navCtrl.push('ProfiledetailPage');

  }

  findMainDevice(devices) {
    let _base = this;
    var i = 0;
    for (i = 0; i < devices.length; i++) {
      if (devices[i].is_active) {
        let maindevice = devices[i].device_title;
        let type = devices[i].type;
        return {
          title: maindevice,
          type: type
        }
      }
    }
  }

  //Get paired devices...
  getpairedDevice(devices) {
    let _base = this;

    _base.devicecount = devices.length;
    let mdevice = _base.findMainDevice(devices);
    _base.maindevice = mdevice.title;
    _base.type = mdevice.type;
  }

  //Get profile data...
  getprofiledata(profile, display_picture) {
    let _base = this;
    _base.userName = profile.name
    _base.uid = profile.uid
    _base.base4img = display_picture;
  }

  //go to profiledetails page....
  detail() {
    this.navCtrl.push('ProfiledetailPage');

  }

  getnotifications(count) {
    let _base = this;
    _base.notiCount = count;
  }


  //get time data...
  getcount(chdata) {
    let _base = this;     


    if (_base.tbmilage == chdata.total_milage_business && _base.tpmilage == chdata.total_milage_personal && _base.tptime == chdata.total_time_personal && _base.tbtime == chdata.total_time_business) {
      return
    }
    _base.tbmilage = chdata.total_milage_business;
    _base.tpmilage = chdata.total_milage_personal;
    _base.tptime = chdata.total_time_personal;
    _base.tbtime = chdata.total_time_business;
    if (_base.tbmilage == 0 && _base.tpmilage == 0 && _base.tptime == 0 && _base.tbtime == 0) {
      _base.showchart = false;
    }
    else {
      _base.showchart = true;
      _base.chartfunction();
    }
  }

  presentPrompt() {
    let alert = this.alert.create({
      title: 'Total Personal Time=' + this.totalPtime,
      subTitle: 'Total Business Time=' + this.totalBtime,
      cssClass: 'alertDanger',


      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: data => {

          }
        }
      ]
    });
    alert.present();
  }
  presentPromptt() {
    let alert = this.alert.create({
      title: 'Total Personal mileage=' + this.totalPmilage,
      subTitle: 'Total Business mileage=' + this.totalBmilage,
      cssClass: 'alertDanger1',


      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: data => {

          }
        }
      ]
    });
    alert.present();
  }

  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
        canvas = null;
      };
      img.src = url;
    });
  }
}
