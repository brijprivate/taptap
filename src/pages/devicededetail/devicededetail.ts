import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DevicededetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-devicededetail',
  templateUrl: 'devicededetail.html',
})
export class DevicededetailPage {

  public devicedetail:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) 
    {
      this.devicedetail = navParams.get("devicedetail");
      console.log(this.devicedetail);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicededetailPage');
  }

}
