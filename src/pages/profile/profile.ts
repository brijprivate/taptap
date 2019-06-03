import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
  public userId:any;
  public userName:any;
  favourite:"0";
  public devices:any=[];
  devicecount: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfctagProvider:NfctagProvider,
    public loginsignupProvider:LoginsignupProvider,
    public loading:LoadingController) 
    {
      this.userId = localStorage.getItem("userId");
      if(this.userId){
        this.getpairedDevice();
        this.getprofiledata();
      }
    }

    ionViewDidEnter(){
      this.userId = localStorage.getItem("userId");
      if(this.userId){
        this.getpairedDevice();
        this.getprofiledata();
        this.getDashboarddata();
      }
    
    }
  ionViewDidLoad() {
    this.chartfunction(0)
   
  }
chartfunction(s){
  
  anychart.onDocumentReady(function () {
    var chart = anychart.pie([
      
      { x: "Business_Milage", value: 9 },
      { x: "Personal_Milage ", value: 9 },
      { x: " Business_Time", value: 9 },
      { x: " Personal_Time", value: 9 },

    ]);

    chart.innerRadius("25%");

    var label = anychart.standalones.label();

    label.text("taptap");

    label.width("100%");
    label.height("100%");
    label.adjustFontSize(true);
    label.fontColor("#60727b");
    label.hAlign("center");
    label.vAlign("middle");
    chart.legend(false);

    

    // set the label as the center content
    chart.center().content(label);

    // chart.title("Donut Chart: Label in the center");
    chart.container("container1");
    chart.draw();
    if(s==1){
      chart.dispose();
    }
  });
}
  ionViewDidLeave(){
    this.chartfunction(1)

  }



  pairDevice() {
    this.navCtrl.push('PairdevicePage');
  }
  manageDevice() {
    this.navCtrl.push('ManagedevicePage');
  }
  recordMilage() {
    this.navCtrl.push('AnimatetapPage',{key:'milage'});
  }
  recordTime() {
    this.navCtrl.push('AnimatetapPage',{key:'time'});
    // this.navCtrl.push('RecordtimePage');
  }
  editprofile() {
    this.navCtrl.push('EditprofilePage');
  }
  merchant() {
    this.navCtrl.push('MerchantPage');
  }
  category(){
    this.navCtrl.push('CategoryPage');
  }   
  profileDetail(){
    this.navCtrl.push('ProfiledetailPage');
  }
  
 //Get paired devices...
 getpairedDevice(){
   let _base  = this;
   this.nfctagProvider.getpairdevice(this.userId).then(function(success:any){
     console.log("paired devices--------------?>>>>>>>>>");
     console.log(success.result.length);
     _base.devices = success.result;
     _base.devicecount = success.result.length;
   },function(err){
     console.log(err);
   })
 }

  //Get profile data...
  getprofiledata(){
    let _base = this;
    // let loader = this.loading.create({
    //   content:"Please wait..."
    // });
    // loader.present();
    this.loginsignupProvider.getProfile(this.userId).then(function(success:any){
      console.log(success);
      // loader.dismiss();
      if(success){
        _base.userName = success.result.name;
        if(success.result.imageId){
          _base.profileImage = _base.API_URL+"/file/getImage?imageId="+success.result.imageId._id
        }
      }
    },function(err){
      // loader.dismiss();
      console.log(err);
    })
  }
  getDashboarddata()
  {
    let _base = this;
    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();

    this.loginsignupProvider.getDashboard(this.userId).then(function(success:any){
      console.log("dashboard data ---------->>>>>>"+ success);
      console.log(success);

      // _base.fashion = success.result.fashion;
      // _base.buisness = success.result.buisness;
      // _base.contact = success.result.contact;
      // _base.event = success.result.event;
      // _base.general = success.result.general;
      _base.favourite = success.result.favourite;
      // _base.sports = success.result.sport;
      // _base.groceries = success.result.groceries;
      // _base.totalcount = success.result.totalTap;
      loader.dismiss();
    },function(err){
      console.log(err);
    })
  }
   //go to profiledetails page....
   detail(){
    this.navCtrl.push('ProfiledetailPage');
  }
}
