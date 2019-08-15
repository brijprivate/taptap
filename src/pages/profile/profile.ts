import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { PairdevicePage } from '../pairdevice/pairdevice';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { Storage } from '@ionic/storage';
declare var anychart;
declare var Morris;
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
  totalPtime = 0;
  totalBtime = 0;
  totalPmilage = 0;
  totalBmilage = 0;
  showchart = true;
  type: any;
  base4img: {};
  offline:boolean=false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nfctagProvider: NfctagProvider,
    public loginsignupProvider: LoginsignupProvider,
    public loading: LoadingController,
    public alert: AlertController,
    private storage: Storage ) {
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
    this.offline=false;
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
    // let _base = this;
    // setTimeout(() => {
     
    //   Morris.Donut({
    //     element: 'donut-example',
    //     resize:true,
    //     formatter:function (y, data) {console.log(y,data); return '' + y } ,
    //     data: [
    //       {label: "Business_Milage", value: _base.tbmilage},
    //       {label: "Personal_Milage ", value: _base.tpmilage},
    //       {label: "Business_Time", value: _base.tbtime},

    //       {label: "Personal_Time", value: _base.tptime },
        
    //     ]
    //   });
    // }, 1000);

    console.log('in the chart')
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
    this.offline=false;
    if (this.showchart) {
      this.chart.dispose();
    }
  }

  notifications() {
    this.navCtrl.push("NotificationPage")
  }



  pairDevice() {
    if (this.showchart) {
      this.chart.dispose();
    }
    clearInterval(this.interval);
    this.navCtrl.push('PairdevicePage', { x: 'pair' });

  }
  manageDevice() {
    if (this.showchart) {
      this.chart.dispose();
    }
    clearInterval(this.interval);
    this.navCtrl.push('ManagedevicePage');

  }
  recordMilage() {
    if (this.showchart) {
      this.chart.dispose();
    } clearInterval(this.interval);
    this.navCtrl.push('AnimatetapPage', { key: 'milage' });
    // this.navCtrl.push('RecordmilagePage');



  }
  recordTime() {
    if (this.showchart) {
      this.chart.dispose();
    } clearInterval(this.interval);
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
          _base.type=success.result[i].type;
          _base.storage.set("devices",success.result[i].type);
          break;
        }
      }
      console.log(_base.devices);
      console.log(_base.maindevice);
      // _base.maindevice=_base.maindevice[_base.maindevice.length-1].device_title;
      _base.devicecount = success.result.length;
      _base.storage.set("dcount",success.result.length);

    }, function (err) {
      _base.storage.get("devices").then((devicess)=>{
       _base.maindevice=devicess;
       console.log(devicess)
      });
      _base.storage.get("dcount").then((dcount)=>{
        _base.devicecount = dcount
        console.log(dcount)
       });
      console.log(err);
    })
  }

  //Get profile data...
  getprofiledata() {
    let _base = this;
  
    this.loginsignupProvider.getProfile(this.userId).then(function (success: any) {
      console.log(success);
      if (success) {
        _base.userName = success.result.name;
        _base.uid = success.result.uid;
        _base.storage.set("prodata",success.result);
        if (success.result.imageId) {
          _base.profileImage = _base.API_URL + "/file/getImage?imageId=" + success.result.imageId._id;
          _base.convertToDataURLviaCanvas(_base.profileImage, "image/png").then(base64img=>{
            console.log(base64img);
            _base.base4img = base64img;
             _base.storage.set('uimg',_base.base4img);
          })
        }
        else{
          _base.base4img = "assets/images/avatar.png";
          _base.convertToDataURLviaCanvas(_base.base4img, "image/png").then(base64img=>{
            console.log(base64img);
            _base.base4img = base64img;
             _base.storage.set('uimg',_base.base4img);
          })
          console.log("enterr else image =============")
        }
      }
    }, function (err) {
      // loader.dismiss();
      _base.offline=true;
      _base.storage.get("prodata").then((profdata)=>{
        _base.userName = profdata.name;
        _base.uid = profdata.uid;
      })
      _base.storage.get("uimg").then((uimg)=>{
        _base.base4img=uimg;
        console.log(_base.base4img);
      });
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
      _base.storage.set("fav",success.result.favourite);
      loader.dismiss();
    }, function (err) {
      _base.storage.get("fav").then((favdata)=>{
        _base.favourite = favdata;
      })
      loader.dismiss();
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
        _base.totalPmilage = success.result.personal;
        _base.totalBmilage = success.result.business;
        _base.premilage = true;
        _base.storage.set("milagedata",success.result);
      }

    }, function (err) {
      _base.storage.get("milagedata").then((mdata)=>{
        _base.totalPmilage = mdata.personal;
        _base.totalBmilage = mdata.business;
        _base.premilage = true;
      })
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
        console.log(_base.showchart + 'ddddddddddddddddddddddddddddddddddd')
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
        _base.storage.set("tdata",success);
      }
    }, function (err) {
      _base.storage.get("tdata").then((tdata)=>{
        _base.totalPtime = tdata.result.personal;
        _base.totalBtime = tdata.result.business;
        _base.tptime = tdata.total_personal;
        _base.tbtime = tdata.total_business;
        _base.pretime = true;
      })
      console.log(err);
    })
  }

  //get time data...
  getcount() {
    let _base = this;
    let i = 0;
    this.nfctagProvider.getcount(this.userId).then(function (success: any) {
      console.log(success);
      _base.storage.set("chdata",success);
      if (success) {
        _base.tbmilage = success.total_milage_business;
        _base.tpmilage = success.total_milage_personal;
        _base.tptime = success.total_time_personal;
        _base.tbtime = success.total_time_business;
        if (_base.tbmilage == 0 && _base.tpmilage == 0 && _base.tptime == 0 && _base.tbtime == 0) {
          _base.showchart = false;

        }
        else {
          _base.showchart = true;
          _base.chartfunction();
        }
        console.log(_base.showchart)
      }
    }, function (err) {
      _base.storage.get("chdata").then((chdata)=>{
        if (chdata) {
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
          console.log(_base.showchart)
        }
      })
      console.log(err);
    })
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
  convertToDataURLviaCanvas(url, outputFormat){
    return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
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
