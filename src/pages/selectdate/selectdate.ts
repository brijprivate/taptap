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
  constructor(public navCtrl: NavController, public navParams: NavParams, public loginsignupProvider: LoginsignupProvider) {
    this.edate = new Date().toISOString();
    console.log(this.sdate);
    this.userId = localStorage.getItem("userId");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectdatePage');
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
    console.log(this.sdate);
  }
  enddate() {
    // this.edate = new Date().toISOString();
    console.log(this.edate)
    console.log(this.edate.slice(0,-16));
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
    else{
      console.log('ok you can go');
    } 
    
    if (this.selected == undefined) {
      alert('please select type');
      return;
    }

    if (this.busi == false && this.pers == false) {
      alert('please select the ' + this.selected + 'Type');
      return
    }
    if (this.pers) {
      console.log('personal')
    }

    if (this.selected == 'time') {
      this.calltime('time/timeHistory?userId=')
    }
    else if (this.selected == 'milage') {
      this.calltime('milage/milageHistory?userId=')
    }


  }
  calltime(timeurl) {
    this.data = [];
    let _base = this;
    _base.loginsignupProvider.selectdate(_base.userId, timeurl, _base.sdate, _base.edate).then(function (success: any) {
      if (success) {
        console.log(success);
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

          if (_base.selected == 'milage') {
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
      }
    },
      function (err) {
        console.log(err);
      })
  }



  gotopage() {

    if (this.busi == true && this.pers == true) {
      if (this.data.business && this.data.personal) {
        this.data = this.data.business.concat(this.data.personal);
      }
    }
    var data = {
      type: this.selected,
      date: { start: this.sdate, end: this.edate },
      data: this.data
    }
    console.log(this.data);
    this.navCtrl.push('MilagelistPage', { data: data })

  }

}
