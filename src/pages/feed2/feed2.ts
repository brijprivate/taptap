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
  public distance: any;
  public fav_count: any = 0;
  public current_location: any = {};
  constructor(public http: NfctagProvider, private androidPermissions: AndroidPermissions, public geolocation: Geolocation,
    private launchNavigator: LaunchNavigator, public navCtrl: NavController, public navParams: NavParams) {
    this.feed = this.navParams.get('feed')
    console.log(this.feed)
    this.like = this.feed.favourites.indexOf(localStorage.getItem('userId')) == -1 ? false : true
    this.fav_count = this.feed.favourites.length;
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    let _base = this;
    _base.geolocation.getCurrentPosition().then((resp) => {
      _base.current_location.latitude = resp.coords.latitude
      _base.current_location.longitude = resp.coords.longitude
      _base.distance = Math.floor(_base.calculatedistance(_base.current_location.latitude, _base.current_location.longitude, _base.feed.product.storeId.companyId.geo.latitude, _base.feed.product.storeId.companyId.geo.longitude))
      console.log("Distance", _base.distance)
    }).catch((error) => {
      // console.log('Error getting location', error);
      alert("Please turn on your location service")
    })
  }

  calculatedistance(lat1, lon1, lat2, lon2) {
    var R = 3963.2; // km (change this constant to get miles)
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    // if (d > 1) return Math.round(d) + "km";
    // else if (d <= 1) return Math.round(d * 1000) + "m";
    return d;
  }


  showProduct() {
    let object = {};
    let _base = this;
    switch (_base.feed.categoryId.name) {
      case 'Business':
        object = {
          businessId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'Contacts':
        object = {
          contactId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'Sports':
        object = {
          sportId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'Fashion':
        object = {
          fashionId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'General':
        object = {
          generalId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'Event':
        object = {
          eventId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'Groceries':
        object = {
          groceryId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'Restaurant':
        object = {
          restaurantId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      case 'Verification':
        object = {
          verificationId: _base.feed.product,
          storeId: _base.feed.product.storeId
        }
        break;
      default:
    }
    _base.navCtrl.push('TapdetailsPage', object);

  }


  loadMap(geo: any) {
    let GOOGLE = { "lat": geo.latitude, "lng": geo.longitude };
    let mapDiv = <HTMLElement>document.getElementById("google-map-div");

    console.log(geo)

    let _base = this;
    // Initialize the map plugin
    this.map = plugin.google.maps.Map.getMap(mapDiv, {
      'camera': {
        'latLng': GOOGLE,
        'zoom': 17
      }
    });

    // You have to wait the MAP_READY event.
    this.map.one(plugin.google.maps.event.MAP_READY, function () {
      console.log("Map ready")

      _base.map.addMarker({
        position: { lat: geo.latitude, lng: geo.longitude },
        title: 'Tapped here!'
      })

    })
  }

  ionViewDidEnter() {
    this.clickFeed()
    console.log('ionViewDidLoad Feed2Page');
    console.log(this.feed, "DID ENTER")
    console.log(this.feed.product.storeId)
    this.loadMap(this.feed.product.storeId.companyId.geo)
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
      .then(function (success: any) {
        _base.like = !_base.like
        _base.fav_count = success.favourites_count;
      }, function (error) {

      });
  }


  navigate() {
    let _base = this
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
