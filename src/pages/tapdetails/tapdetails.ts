import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

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
  public userId:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toast: ToastController,
    public alert:AlertController,
    public loading:LoadingController,
    public nfctagPro:NfctagProvider,)
    {
      this.userId = localStorage.getItem("userId");
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

  //mark as favourite api.....
  favourite(item)
  {
    console.log(item._id);
    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();
    let favdata = {
      productId:item._id,
      categoryType:item.purpose,
      userId:this.userId
    }
    console.log(favdata);
    this.nfctagPro.createFav(favdata).then(function(success:any){
      console.log(success);
      loader.dismiss();
    },function(err){
      console.log(err);
      loader.dismiss();
    })
  }
}
