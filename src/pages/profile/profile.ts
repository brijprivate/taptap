import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

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



  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
              '#ef4745',
              '#6cdd4d',

            ],

          }]
        },
        options: {
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
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ProfilePage');
  // }

}
