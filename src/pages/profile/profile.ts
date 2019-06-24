import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { PairdevicePage } from '../pairdevice/pairdevice';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
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
  API_URL = "http://ec2-18-225-10-142.us-east-2.compute.amazonaws.com:5450";

  doughnutChart: any;
  barChart: any;
  lineChart: any;
  public userId: any;
  public userName: any;
  favourite: "0";
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
  totalPtime=0;
  totalBtime=0;
  totalPmilage=0;
  totalBmilage=0;
  showchart=false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nfctagProvider: NfctagProvider,
    public loginsignupProvider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,) {
    var time = new Date().toTimeString();
    console.log(time);
    this.userId = localStorage.getItem("userId");
    console.log(this.userId);
    if (this.userId) {
      // this.getpairedDevice();
      // this.getprofiledata();
    }
  }

  ionViewDidEnter() {
    let _base = this;
    this.userId = localStorage.getItem("userId");
    if (this.userId) {
      // this.gettime();
      this.getpairedDevice();
      this.getprofiledata();
      this.getDashboarddata();
      this.getnotifications();
      this.getmilage();
      this.gettime();
      // this.chartfunction();
      this.getcount();
      // let putgraph = setTimeout(()=>{
      //   _base.chartfunction();
      // },5000)
    }

  }
  ionViewDidLoad() {
    // this.chartfunction()
    let _base = this;

  }
  chartfunction() {
    console.log('in the chart')
    let _base = this;
    // anychart.onDocumentReady(function () {
    _base.chart = anychart.pie([

      { x: "Business_Milage", value: _base.tbmilage },
      { x: "Personal_Milage ", value: _base.tpmilage },
      { x: "Business_Time", value: _base.tbtime },
      { x: "Personal_Time", value: _base.tptime },
      // { x: "Business_Milage", value:0},
      // { x: "Personal_Milage ", value: 0},
      // { x: "Business_Time", value: 0 },
      // { x: "Personal_Time", value:0 },
    ]);

    _base.chart.innerRadius("25%");

    var label = anychart.standalones.label();

    label.text("TapTap");
    label.width("100%");
    label.height("100%");
    label.adjustFontSize(true);
    label.fontColor("#60727b");
    label.hAlign("center");
    label.vAlign("middle");
    _base.chart.legend(false);


    // set the label as the center content
    _base.chart.center().content(label);

    // chart.title("Donut Chart: Label in the center");
    _base.chart.container("container1");

    console.log('printing chart')
    _base.chart.draw();



    // });
  }
  ionViewDidLeave() {
    this.chart.dispose();
  }



  pairDevice() {
    this.chart.dispose();
    clearInterval(this.interval);
    this.navCtrl.push('PairdevicePage', { x: 'pair' });

  }
  manageDevice() {
    this.chart.dispose();
    clearInterval(this.interval);
    this.navCtrl.push('ManagedevicePage');

  }
  recordMilage() {
    this.chart.dispose();
    clearInterval(this.interval);
    // this.navCtrl.push('AnimatetapPage', { key: 'milage' });
    this.navCtrl.push('RecordmilagePage');



  }
  recordTime() {
    this.chart.dispose();
    clearInterval(this.interval);
    this.navCtrl.push('AnimatetapPage', { key: 'time' });

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

  //Get paired devices...
  getpairedDevice() {
    let _base = this;
    this.nfctagProvider.getpairdevice(this.userId).then(function (success: any) {
      console.log("paired devices--------------?>>>>>>>>>");
      console.log(success.result);

      _base.devices = success.result;
      var i = 0;
      for (i = 0; i < success.result.length; i++) {
        if (success.result[i].is_active) {
          _base.maindevice = success.result[i].device_title;
          break;
        }
      }
      console.log(_base.maindevice);
      // _base.maindevice=_base.maindevice[_base.maindevice.length-1].device_title;
      _base.devicecount = success.result.length;
    }, function (err) {
      console.log(err);
    })
  }

  //Get profile data...
  getprofiledata() {
    let _base = this;
    // let loader = this.loading.create({
    //   content:"Please wait..."
    // });
    // loader.present();
    this.loginsignupProvider.getProfile(this.userId).then(function (success: any) {
      console.log(success);
      // loader.dismiss();
      if (success) {
        _base.userName = success.result.name;
        _base.uid = success.result.uid;
        if (success.result.imageId) {
          _base.profileImage = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id
        }
      }
    }, function (err) {
      // loader.dismiss();
      console.log(err);
    })
  }
  getDashboarddata() {
    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();

    this.loginsignupProvider.getDashboard(this.userId).then(function (success: any) {
      console.log("dashboard data ---------->>>>>>" + success);
      console.log(success);

      _base.favourite = success.result.favourite;
      loader.dismiss();
    }, function (err) {
      console.log(err);
    })
  }
  //go to profiledetails page....
  detail() {
    this.navCtrl.push('ProfiledetailPage');

  }

  getnotifications() {
    let _base = this;
    _base.notiCount = 0;
    _base.nfctagProvider.getnotifications(localStorage.getItem('userId'))
      .then(function (success: any) {
        console.log("Notifications", success)
        success.result.forEach(item => {
          if (item.seen == false) {
            _base.notiCount = _base.notiCount + 1
          }
        });
      }, function (error) {
        console.log(error)
      });
  }

  //get time data....
  getmilage() {
    let _base = this;
    let i = 0;
    this.nfctagProvider.getmilage(this.userId).then(function (success: any) {
      console.log(success);
      if (success.result.records.length != 0) {
        // _base.tpmilage = success.total_personal;
        // _base.tbmilage = success.total_business;
        // if(_base.tpmilage || _base.tbmilage){
        // _base.chartfunction();
        _base.totalPmilage = success.result.personal;
        _base.totalBmilage = success.result.business;
        _base.premilage = true;

        // _base.callchart()
        // }
      }

    }, function (err) {
      console.log(err);
    })
  }

  callchart() {
    var _base = this;
    console.log('calling chart function');
    var x = 0;
    _base.interval = setInterval(function () {
      x = x + 1;
      console.log(x, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      if (_base.pretime && _base.premilage) {
        clearInterval(_base.interval);
        

        console.log('call chart llll');
        _base.premilage = false;
        _base.pretime = false;
        console.log(_base.showchart+'ddddddddddddddddddddddddddddddddddd')
      }

    }, 50)
  }

  //get time data...
  gettime() {
    let _base = this;
    let i = 0;
    this.nfctagProvider.gettime(this.userId).then(function (success: any) {
      console.log(success);
      if (success.result.records.length != 0) {
        _base.totalPtime = success.result.personal;
        _base.totalBtime = success.result.business;
        _base.tptime = success.total_personal;
        _base.tbtime = success.total_business;
        _base.pretime = true;
      }
    }, function (err) {
      console.log(err);
    })
  }

  //get time data...
  getcount() {
    let _base = this;
    let i = 0;
    this.nfctagProvider.getcount(this.userId).then(function (success: any) {
      console.log(success);
      if (success) {
        _base.tbmilage = success.total_milage_business;
        _base.tpmilage = success.total_milage_personal;
        _base.tptime = success.total_time_personal;
        _base.tbtime = success.total_time_business;
        if (_base.tbmilage || _base.tpmilage || _base.tptime || _base.tbtime) {
          _base.showchart=true;
          _base.chartfunction();
        }
      else{
        _base.showchart=false;
      }
console.log(_base.showchart)


      }
    }, function (err) {
      console.log(err);
    })
  }

  presentPrompt() {
    let alert = this.alert.create({
      title: 'Total Personal Time='+this.totalPtime,
      subTitle:'Total Business Time='+ this.totalBtime,
      cssClass: 'alertDanger',

      
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        // {
        //   text: 'OK',
        //   handler: data => {
        //     // console.log(data[0]);
        //     alert.dismiss();
            
        //   }
        // }
      ]
    });
    alert.present();
  }
  presentPromptt(){
    let alert = this.alert.create({
      title: 'Total Personal milage='+this.totalPmilage,
      subTitle:'Total Business milage='+ this.totalBmilage,
      cssClass: 'alertDanger1',

      
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        // {
        //   text: 'OK',
        //   handler: data => {
        //     // console.log(data[0]);
        //     alert.dismiss();
            
        //   }
        // }
      ]
    });
    alert.present();
  }
}
