import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

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

  lineChart: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignupProvider:LoginsignupProvider) 
  {
    this.userId = localStorage.getItem("userId");
    if(this.userId){
      this.getprofiledata();
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
}
