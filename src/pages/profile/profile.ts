import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { PairdevicePage } from '../pairdevice/pairdevice';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

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

  doughnutChart: any;
  barChart: any;
  lineChart: any;
  public userId:any;
  public userName:any;
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

  ionViewDidLoad() {
    var _base = this;
    setTimeout(function () {
      _base.doughnutChart = new Chart(_base.doughnutCanvas.nativeElement, {

        type: 'doughnut',
        data: {
          labels: ["Milage", "Time"],
          datasets: [{

            // label: '# of Votes',
            data: [12, 19],
            backgroundColor: [
              '#a25757',
              '#93ca79',
            ],
          }]
        },
        options: {
          cutoutPercentage: 80,
          legend: {
              display: false,            
          }
        }
      });

    }, 1000);
  }





  pairDevice() {
    this.navCtrl.push('PairdevicePage');
  }
  manageDevice() {
    this.navCtrl.push('ManagedevicePage');
  }
  recordMilage() {
    this.navCtrl.push('RecordmilagePage');
  }
  recordTime() {
    this.navCtrl.push('RecordtimePage');
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
     console.log(success);
   },function(err){
     console.log(err);
   })
 }

  //Get profile data...
  getprofiledata(){
    let _base = this;
    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();
    this.loginsignupProvider.getProfile(this.userId).then(function(success:any){
      console.log(success);
      loader.dismiss();
      if(success){
        _base.userName = success.result.name;
      }
    },function(err){
      loader.dismiss();
      console.log(err);
    })
  }
}
