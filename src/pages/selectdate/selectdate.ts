import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

/**
 * Generated class for the SelectdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-selectdate',
  templateUrl: 'selectdate.html',
})
export class SelectdatePage {
  selected: any;
  busi = false;
  pers = false;
  public sdate: String;
  public edate: any;
  userId: string;
  data: any;
  loading: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loginsignupProvider: LoginsignupProvider) {
    this.edate = new Date().toISOString();
    this.sdate = new Date().toISOString();

    this.userId = localStorage.getItem("userId");

  }

  ionViewDidEnter() {

  }

  select(item) {
    this.selected = item;
  }

  selectt(x) {
    if (x == 'Business') {
      this.busi = !this.busi
    }
    else if (x == 'Personal') {
      this.pers = !this.pers
    }

  }
  //get start date...
  startdate() {
    // this.sdate = this.sdate;

  }
  enddate() {
    // this.edate = new Date().toISOString();


  }
  back() {
    this.navCtrl.pop()
  }

  submit() {
    this.data = {};
    if (this.edate == undefined || this.sdate == undefined) {
      alert('please select time');
      return;
    }

    if (this.edate < this.sdate) {
      alert('End date is smaller than Start date');
      return;
    }
    else {

    }

    if (this.selected == undefined) {
      alert('please select type');
      return;
    }

    if (this.busi == false && this.pers == false) {
      alert('please select the ' + this.selected + ' ' + 'Type');
      return
    }
    if (this.pers) {

    }

    if (this.selected == 'time') {
      this.calltime('time/timeHistory?userId=')
    }
    else if (this.selected == 'mileage') {
      this.calltime('milage/milageHistory?userId=')
    }


  }
  calltime(timeurl) {
    this.data = [];
    let _base = this;
    _base.loading = true;
    _base.loginsignupProvider.selectdate(_base.userId, timeurl, _base.sdate, _base.edate).then(function (success: any) {
      if (success) {
        _base.loading = false;

        if (!success.result) {

          if (_base.selected == 'time') {
            if (success.Business.length != 0 && (_base.busi)) {
              Object.assign(_base.data, { business: success.Business })
            }
            if (success.Personal.length != 0 && (_base.pers)) {
              Object.assign(_base.data, { personal: success.Personal })
            }
            if (success.Business.length == 0 && _base.busi && !_base.pers) {
              alert('no data business type');
              return;
            }
            else if (success.Personal.length == 0 && _base.pers && !_base.busi) {
              alert('no data in personal type');
              return;
            }
            else if (success.Personal.length == 0 && success.Business.length == 0) {
              alert('no data in Selected type');
              return;
            }

          }

          if (_base.selected == 'mileage') {
            if (success.Business.length != 0 && (_base.busi)) {
              Object.assign(_base.data, { business: success.Business })
            }
            if (success.personal.length != 0 && (_base.pers)) {
              Object.assign(_base.data, { personal: success.personal })
            }
            if (success.Business.length == 0 && _base.busi && !_base.pers) {
              alert('no data business type');
              return;
            }
            else if (success.personal.length == 0 && _base.pers && !_base.busi) {
              alert('no data in personal type');
              return;
            }
            else if (success.personal.length == 0 && success.Business.length == 0) {
              alert('no data in Selected type');
              return;
            }
          }
        }
        else {
          alert('no data found')
          return;
        }

        _base.gotopage()
      } else {
        _base.loading = false;
      }
    },
      function (err) {
        _base.loading = false;
      })
  }



  gotopage() {


    if (this.busi == true && this.pers == true) {
      if (this.data.business && this.data.personal) {
        this.data = this.data.business.concat(this.data.personal);
      }
    }

    let edate = new Date(this.edate)
    edate.setHours(edate.getHours() + 12)

    var data = {
      type: this.selected,
      date: { start: new Date(this.sdate.toString()).toISOString(), end: edate.toISOString() },
      data: this.data
    }

    
    this.navCtrl.push('MilagelistPage', { data: data })

  }

}
