import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public images: any;
  @ViewChild('slider') slider: Slides;
  page = 0;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;


  doughnutChart: any;
  barChart: any;

  lineChart: any;
  constructor(public navCtrl: NavController) {

  }
  selectedTab(index) {
    this.slider.slideTo(index);
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

}
