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
  public deviceName:any;

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
    this.navCtrl.push('DevicededetailPage',{devicedetail:device});
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

presentPrompt(nfcid) {
  let alert = this.alert.create({
    title: 'Device',
    inputs: [
      {
        
        placeholder: 'Username'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          console.log(data[0]);
          this.deviceName = data[0];
          if(this.deviceName){
            this.changedevicename(nfcid);
          }
          
        }
      }
    ]
  });
  alert.present();
}

  changedevicename(nfcid)
  {
    let _base = this;
    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();
    let data = {
      deviceId:nfcid,
      device_title:_base.deviceName
    }
    console.log(data);
    this.nfctagProvider.updateDeviceName(data).then(function(success:any){
      loader.dismiss();
      console.log(success);
      _base.getpairedDevice();
    },function(err){
      console.log(err);
      loader.dismiss();
    })
  }


  delete(nfcid) {
    let alert = this.alert.create({
      title: 'Are you sure want to delete',
     
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
              this.deleteDevice(nfcid);
          }
        }
      ]
    });
    alert.present();
  }

  deleteDevice(nfcid){
    // console.log(nfcid)
    // let _base = this;
    // this.nfctagProvider.deletedevice(nfcid).subscribe(data=>{
    //   console.log(data);
    // },
    // err=>{
    //   console.log(err);
    // })
    var _base=this;
    this.nfctagProvider.deletedevice(nfcid).then(function(success:any){
      _base.getpairedDevice();
    },function(err){
      alert("unable to delete device please try again");
    })
  }
}
