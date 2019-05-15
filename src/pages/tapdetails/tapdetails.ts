import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TapdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tapdetails',
  templateUrl: 'tapdetails.html',
})
export class TapdetailsPage {

  public eventdata:any;
  public thisMonth:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams)
    {
      this.eventdata = navParams.get("itemdetails");
      console.log("item details----", this.eventdata);

      if(this.eventdata.eventId)
      {
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.thisMonth = monthNames[(new Date()).getMonth()];
        console.log(this.thisMonth);
      }
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TapdetailsPage');
  }

}
