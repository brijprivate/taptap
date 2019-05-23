import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
// import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the ManagedevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-managedevice',
  templateUrl: 'managedevice.html',
})
export class ManagedevicePage {
  userId: any;
  public devices:any=[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfctagProvider:NfctagProvider,
    private toast: ToastController,
    public alert:AlertController,
    public loading:LoadingController,) 
    {
      this.userId = localStorage.getItem("userId");
      if(this.userId){
        this.getpairedDevice();
      }
  }
  backProfile(){
    this.navCtrl.push('ProfilePage');

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ManagedevicePage');
  }
  gotodevice(device){
    this.navCtrl.push('DevicededetailPage',{devicedetail:device})
  }

  //get paired devices....
  //Get paired devices...
 getpairedDevice(){
  let _base  = this;
  let loader = this.loading.create({
    content:"Please wait..."
  });
  loader.present();
  this.nfctagProvider.getpairdevice(this.userId).then(function(success:any){
    console.log("paired devices--------------?>>>>>>>>>");
    console.log(success);
    loader.dismiss();
    _base.devices = success.result;

  },function(err){
    console.log(err);
  })
}
}
