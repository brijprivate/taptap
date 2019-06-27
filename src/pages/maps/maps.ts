import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

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
    public navCtrl: NavController, public navParams: NavParams) {
    this.cords = this.navParams.data
    console.log(this.cords)
    let _base = this
    _base.nativeGeocoder.reverseGeocode(this.cords.latitude, this.cords.longitude)
      .then((result: NativeGeocoderReverseResult[]) => {
        console.log("reverse geocode ----------------->>>>>>>", result)
        console.log(JSON.stringify(result[0]));
        _base.location = result[0];
      });

  }

  ionViewDidLoad() {
    console.log("load map")
    this.loadMap();
  }

  loadMap() {
    let _base = this
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: _base.cords.latitude, lng: _base.cords.longitude },
      // center: { lat: -34.397, lng: 150.644 },
      disableDefaultUI: true,
      zoom: 17
    });
  }

  navigate() {
    let _base = this
    _base.androidPermissions.checkPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      function (result) {
        console.log('Has permission?', result.hasPermission)
        if (!result.hasPermission) {
          _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        } else {
          _base.geolocation.getCurrentPosition().then((resp) => {

            console.log("lunch navigator");
            let start = {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
            };

            let end = {
              lat: parseFloat(_base.cords.latitude),
              lng: parseFloat(_base.cords.longitude)
            };

            console.log(start, end);

            _base.lunchNavigator(start, end);

          }).catch((error) => {
            console.log('Error getting location', error);
          })
        }
      },
      function (err) {
        _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      });
  }

  lunchNavigator(start: any, end: any) {
    console.log(start);
    console.log(end);
    let GStart = [start.lat, start.lng];
    let GEnd = [end.lat, end.lng];
    let options: LaunchNavigatorOptions = {
      start: GStart,
      transportMode: "driving"
    };

    this.launchNavigator.navigate(GEnd, options)
      .then(
        success => console.log('Launched navigator', success),
        error => console.log('Error launching navigator', error)
      );
  }

}
