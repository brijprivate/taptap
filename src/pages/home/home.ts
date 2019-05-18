import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { Subscription } from 'rxjs/Rx';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mySlideOptions = {
    initialSlide: 1,
    loop: true
  };
  public images: any;
  @ViewChild('slider') slider: Slides;
  @ViewChild('slides') slides: Slides;
  page = 0;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  doughnutChart: any;
  barChart: any;
  
  public userId:any;
  public userName:any;

  public fashion:"0";
  public general:"0";
  public sports:"0";
  public contact:"0";
  public event:"0";
  public groceries:"0";
  public buisness:"0";
  public favourite:"0";
  public totalcount:"0";
  public todaysTap:"0";
  public tapItems:any;

  lineChart: any;

  //NFC read related ....
  readingTag:   boolean   = false;
  writingTag:   boolean   = false;
  isWriting:    boolean   = false;
  ndefMsg:      string    = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  public tapData:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider:LoginsignupProvider,
    public nfc: NFC,
    public ndef: Ndef,
    public loading:LoadingController,
    public nfctagpro:NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert:AlertController,) 
  {
    let cdate = new Date().toISOString();
    console.log(cdate);
    this.userId = localStorage.getItem("userId");
    console.log(this.userId);
    if(this.userId){
      this.getprofiledata();
      this.getDashboarddata();
      this.getpresentdateCount();
      this. getAllTapItem();
    }

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
         console.log("tag id", s);
         this.tapData = s.substring(0, s.length - 1);
         if(this.tapData){

         }
         return s.substring(0, s.length - 1);
         
         } 
       },
       err => {
       })
     );
  }
  ionViewDidEnter()
  {
    if(this.todaysTap)
    console.log("view enter--------------->>>>>>>>>>>");
    this.userId = localStorage.getItem("userId");
    if(this.userId){
      this.getprofiledata();
      this.getDashboarddata();
      this.getpresentdateCount();
      this. getAllTapItem();
    }
    if(this.totalcount){

    
    var _base = this;
    setTimeout(function () {
      _base.doughnutChart = new Chart(_base.doughnutCanvas.nativeElement, {

        type: 'doughnut',
        data: {
          labels: ["Total", "Total"],
          datasets: [{

            // label: '# of Votes',
            data: [_base.todaysTap, _base.totalcount],
            // data: [0, 1],
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

    }, 3000);
  }
  }

  selectedTab(index) {
    this.slider.slideTo(index);
  }
  merchant() {
    // this.navCtrl.push('MerchantPage');
  }
  category(){
    // this.navCtrl.push('CategoryPage');
  }
  next() {
    this.slides.slideNext();
  }
  prev() {
    this.slides.slidePrev();
  }
  ionViewDidLoad() {
    var _base = this;
    setTimeout(function () {
      _base.doughnutChart = new Chart(_base.doughnutCanvas.nativeElement, {

        type: 'doughnut',
        data: {
          labels: ["Total", "Total"],
          datasets: [{

            // label: '# of Votes',
            data: [_base.todaysTap, _base.totalcount],
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

    }, 3000);
  }

   //Get profile data...
   getprofiledata(){
    let _base = this;
    this.loginsignupProvider.getProfile(this.userId).then(function(success:any){
      console.log(success);
      if(success){
        _base.userName = success.result.name;
      }
    },function(err){
      console.log(err);
    })
  }

  //Tap on product....
  tapItem()
  {
    this.readingTag =true;
    this.navCtrl.push('TapmodalPage');
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

      _base.fashion = success.result.fashion;
      _base.buisness = success.result.buisness;
      _base.contact = success.result.contact;
      _base.event = success.result.event;
      _base.general = success.result.general;
      _base.favourite = success.result.favourite;
      _base.sports = success.result.sport;
      _base.groceries = success.result.groceries;
      _base.totalcount = success.result.totalTap;
      loader.dismiss();
    },function(err){
      console.log(err);
    })
  }

  //get present date tap count....
  getpresentdateCount(){
    let _base = this;
    this.loginsignupProvider.getTapPresentDate(this.userId).then(function(success:any){
      console.log(success.result);
      _base.todaysTap = success.result.length;

    },function(err){
      console.log(err);
    })
  }

  //get all tap items....
  getAllTapItem(){
    let _base  = this;
    this.loginsignupProvider.getTapAll(this.userId).then(function(success:any){
      console.log("All Tapped data ,..........>>>>>");
      // console.log(success.result.length);
      _base.tapItems = success.result;
      console.log(_base.tapItems);
    },function(err){
      console.log(err);
    })
  }

  //go to detail page ...
  gotoDetails(item){
    console.log(item);
    this.navCtrl.push('TapdetailsPage',{itemdetails:item});
  }
}
