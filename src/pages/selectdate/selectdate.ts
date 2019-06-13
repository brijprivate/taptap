import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  busi=false;
  pers=false;
  public sdate:String;
  public edate:String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.sdate = new Date().toISOString();
    console.log(this.sdate);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectdatePage');
  }
  select(item){
    this.selected=item;
  }

  selectt(x){
    if(x=='Business'){
      this.busi=!this.busi
    }
    else if(x=='Personal'){
      this.pers=!this.pers

    }
  }
  //get start date...
  startdate(){
    this.sdate = new Date().toISOString();
    console.log(this.sdate);
  }
  enddate(){
    this.edate = new Date().toISOString();
    console.log(this.edate);
  }
}
