import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { NfctagProvider } from './../../providers/nfctag/nfctag';

declare let plugin: any;
/**
 * Generated class for the Feed2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed2',
  templateUrl: 'feed2.html',
})
export class Feed2Page {
  feed1data: any;
  public feed: any = {}
  public map: any;
  public like: any = false;
  constructor(public http: NfctagProvider, private androidPermissions: AndroidPermissions, public geolocation: Geolocation,
    private launchNavigator: LaunchNavigator, public navCtrl: NavController, public navParams: NavParams) {
    this.feed = this.navParams.get('feed')
    console.log(this.feed)
    this.like = this.feed.favourites.indexOf(localStorage.getItem('userId')) == -1 ? false : true
  }


  loadMap() {
    let GOOGLE = { "lat": 37.422476, "lng": -122.08425 };
    let mapDiv = document.getElementById("google-map");

    // Initialize the map plugin
    this.map = plugin.google.maps.Map.getMap(mapDiv, {
      'camera': {
        'latLng': GOOGLE,
        'zoom': 17
      }
    });

    // You have to wait the MAP_READY event.
    this.map.one(plugin.google.maps.event.MAP_READY, function () {
      console.log("Map Loaded")
    });
  }

  ionViewDidEnter() {
    this.clickFeed()
    console.log('ionViewDidLoad Feed2Page');
    this.loadMap()
  }

  clickFeed() {
    let _base = this;
    let click = {
      feedId: _base.feed._id,
      userId: localStorage.getItem('userId')
    }
    _base.http.clickFeed(click)
      .then(function (success) {

      }, function (error) {

      });
  }

  feedAction() {
    let _base = this;
    let click = {
      feedsId: _base.feed._id,
      userId: localStorage.getItem('userId')
    }
    _base.http.feedAction(click)
      .then(function (success) {
        _base.like = !_base.like
      }, function (error) {

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
              lat: parseFloat(_base.feed.product.storeId.companyId.geo.latitude),
              lng: parseFloat(_base.feed.product.storeId.companyId.geo.longitude)
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

  back() {
    this.navCtrl.pop();
  }
}
