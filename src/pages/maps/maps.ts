import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

declare let plugin: any;
/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  public cords: any
  public location: any = {}
  public map;
  constructor(private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private launchNavigator: LaunchNavigator,
    public toast: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.cords = this.navParams.data

    let _base = this
    _base.nativeGeocoder.reverseGeocode(this.cords.latitude, this.cords.longitude)
      .then((result: NativeGeocoderReverseResult[]) => {
        _base.location = result[0];
      });

  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    let _base = this
    // this.map = new google.maps.Map(document.getElementById('map'), {
    //   center: { lat: _base.cords.latitude, lng: _base.cords.longitude },
    //   // center: { lat: -34.397, lng: 150.644 },
    //   disableDefaultUI: true,
    //   zoom: 17
    // });

    this.map = plugin.google.maps.Map.getMap(document.getElementById('map'),
      {
        camera: {
          latLng: { lat: _base.cords.latitude, lng: _base.cords.longitude },
          zoom: 17
        }
      })

    this.map.one(plugin.google.maps.event.MAP_READY, function () {


      _base.map.addMarker({
        position: { lat: _base.cords.latitude, lng: _base.cords.longitude },
        title: 'Tapped here!'
      })

    })
  }


  navigate() {
    let _base = this

    if (localStorage.getItem('lat') != null || localStorage.getItem('lat') != undefined) {
      let start = {
        lat: localStorage.getItem('lat'),
        lng: localStorage.getItem('lng')
      };

      let end = {
        lat: parseFloat(_base.cords.latitude),
        lng: parseFloat(_base.cords.longitude)
      };

      _base.lunchNavigator(start, end);
    } else {
      _base.presentToast('Please turn on location service')
    }
  }

  presentToast(text) {
    let toast = this.toast.create({
      message: text,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  lunchNavigator(start: any, end: any) {


    let GStart = [start.lat, start.lng];
    let GEnd = [end.lat, end.lng];
    let options: LaunchNavigatorOptions = {
      start: GStart,
      transportMode: "driving"
    };

    this.launchNavigator.navigate(GEnd, options)
      .then(
        success => { },
        error => { }
      );
  }
  back() {
    this.navCtrl.pop()
  }
}
