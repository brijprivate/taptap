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
  public edate: String;
  userId: string;
  data:any;
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
    console.log(this.edate);
  }
  back() {
    this.navCtrl.pop()
  }
  submit() {
    this.data={};
    
    if(this.selected==undefined) {
      alert('please select type');
      return;
    }

    if (this.busi ==false && this.pers==false) {
      alert('please select the '+this.selected+ 'Type');
      return
    }
    if (this.pers) {
      console.log('personnal')
    }

    if (this.selected == 'time') {
      this.calltime('time/timeHistory?userId=')
    }
    else if (this.selected == 'milage') {
      this.calltime('milage/milageHistory?userId=')
    }


  }
  calltime(timeurl) {
    let _base = this;
    _base.loginsignupProvider.selectdate(_base.userId, timeurl, _base.sdate, _base.edate).then(function (success: any) {
      if (success) {

        if (_base.selected == 'time') {
          if (success.Business.length != 0 && (_base.busi)) {            
            Object.assign(_base.data,{business:success.Business})
          }
           if (success.Personal.length != 0 && (_base.pers)) {
            Object.assign(_base.data,{personal:success.Personal})
          }
          
        }
        _base.gotopage()
      }
    },
      function (err) {
        console.log(err);
      })
  }



gotopage(){
  if (this.busi ==true && this.pers==true) {
    this.data=this.data.business.concat(this.data.personal);
  }
  var data={
    date:{start:this.sdate,end:this.edate},
    data:this.data
  }
  console.log(this.data);
  this.navCtrl.push('MilagelistPage',{data:data})
}

}
