import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
// import { ProfilePage } from '../profile/profile';
import { Storage } from '@ionic/storage';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

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
  public devices: any = [];
  public deviceName: any;
  public lost: boolean = false;
  public islost: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nfctagProvider: NfctagProvider,
    public sharedservice: SharedserviceProvider,
    private toast: ToastController,
    public alert: AlertController,
    public storage: Storage,
    public loading: LoadingController, ) {
    this.userId = localStorage.getItem("userId");
    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {
        _base.getpairedDevice(response.devices)
      })
  }
  backProfile() {
    this.navCtrl.push('ProfilePage');

  }

  getpairedDevice(devices: any) {
    if (JSON.stringify(this.devices) == JSON.stringify(devices)) {
      return
    }
    this.devices = devices;
  }

  gotodevice(device) {
    this.navCtrl.push('DevicededetailPage', { devicedetail: device });
  }


  presentPrompt(nfcid) {
    let alert = this.alert.create({
      title: 'Device',
      inputs: [
        {

          placeholder: 'Device Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Save',
          handler: data => {

            this.deviceName = data[0];
            if (this.deviceName) {
              this.changedevicename(nfcid);
            }

          }
        }
      ]
    });
    alert.present();
  }

  changedevicename(nfcid) {
    let _base = this;
    let data = {
      deviceId: nfcid,
      device_title: _base.deviceName
    }

    this.nfctagProvider.updateDeviceName(data).then(function (success: any) {
      _base.sharedservice.triggerDevices(true)
    }, function (err) {

    })
  }


  delete(nfcid) {
    this.navCtrl.push('AnimatetapPage', { key: "delete" })

  }

  deleteDevice(nfcid) {
    this.navCtrl.push('AnimatetapPage', { key: "delete" })
  }

  //mark as lost...
  notify(device) {
    let _base = this;
    console.log(device.is_lost)

    let data = {
      deviceId: device._id,
      is_lost: device.is_lost
    }

    this.nfctagProvider.updateDeviceName(data).then(function (success: any) {
      _base.sharedservice.triggerDevices(true)
    }, function (err) {

    })
  }

  back() {
    this.navCtrl.pop();
  }



  setdefault(nfcid, i) {
    let _base = this;
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let data = {
      deviceId: nfcid,
      is_active: true
    }

    this.nfctagProvider.updateDeviceName(data).then(function (success: any) {
      loader.dismiss();

      _base.sharedservice.triggerDevices(true)
    }, function (err) {

      loader.dismiss();
    })
  }

  localdefault(i) {
    let k = 0;
    for (k = 0; k <= this.devices.length - 1; k++) {
      if (k != i) {
        this.devices[i].is_active = false;
      } else {
        this.devices[i].is_active = false;
      }
    }
  }

  goto(url) {
    this.navCtrl.push('PairdevicePage', { x: 'pair' });
  }

}
