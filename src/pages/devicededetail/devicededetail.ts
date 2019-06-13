import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

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

  public devicedetail:any=[];
  public lostmessage:any;
  public lost:boolean=false;
  islost:boolean=true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public nfctagProvider:NfctagProvider,) 
    {
      this.devicedetail = navParams.get("devicedetail");
      console.log(this.devicedetail);
      console.log(this.lost);
      // this.message = this.devicedetail.message;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicededetailPage');
  }

  // notify(){
  //   console.log(this.lost);
  // }

  updatedetail(){
    let _base = this;
    let ddata = {
      deviceId:this.devicedetail._id,
      device_title:this.devicedetail.device_title,
      message:this.devicedetail.message,
      contact_info:{
        email:this.devicedetail.contact_info.email,
        name:this.devicedetail.contact_info.name,
        phoneNumber:this.devicedetail.contact_info.phoneNumber,
        mobileNumber:this.devicedetail.contact_info.mobileNumber,
        company_name:this.devicedetail.contact_info.company_name,
        website:this.devicedetail.contact_info.website
      }
    }
    console.log(ddata);
    this.nfctagProvider.updateDeviceName(ddata).then(function(success){
      console.log(success);
    },function(err){
      console.log(err);
    })
  }

   //mark as lost...
   notify(id){
    let _base = this;
    let data = {
      deviceId:id,
      is_lost:this.lost
    }
    console.log(this.lost);
    this.nfctagProvider.updateDeviceName(data).then(function(success:any){
      console.log(success);
      // _base.getpairedDevice();
    },function(err){
      console.log(err);
    })
  }
  notifyy(id){
    let _base = this;
    let data = {
      deviceId:id,
      is_lost:this.islost
    }
    console.log(this.islost);
    this.nfctagProvider.updateDeviceName(data).then(function(success:any){
      console.log(success);
      // _base.getpairedDevice();
    },function(err){
      console.log(err);
    })
  }
}
