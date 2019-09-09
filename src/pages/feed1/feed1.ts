import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

declare let plugin: any;
declare let google: any;
/**
 * Generated class for the Feed1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed1',
  templateUrl: 'feed1.html',
})
export class Feed1Page {
  @ViewChild('slides') slider: Slides;
  @ViewChild('slider') slider_tab: Slides;

  public map: any;
  public geo: any = {};
  public clusters: any;
  public info: any;
  public selectedMarker: any;

  constructor(private launchNavigator: LaunchNavigator,
    public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Feed1Page');
    this.loadMap()
    this.info = new plugin.google.maps.HtmlInfoWindow();
  }
  back() {
    this.navCtrl.pop();
  }
  goto(x) {
    this.navCtrl.push('Feed2Page', { feed: x })
  }

  loadMap() {
    let _base = this;
    let GOOGLE = { "lat": 37.422476, "lng": -122.08425 };
    let mapDiv = document.getElementById("google-map");

    // Initialize the map plugin
    this.map = plugin.google.maps.Map.getMap(mapDiv, {
      'camera': {
        'latLng': GOOGLE,
        'zoom': 13
      }
    });

    // You have to wait the MAP_READY event.
    this.map.one(plugin.google.maps.event.MAP_READY, function () {
      console.log("Map Loaded")
      _base.getCurrentPosition();
      // _base.map.animateCamera({
      //   target: { lat: 21.382314, lng: -157.933097 },
      //   zoom: 17,
      //   tilt: 60,
      //   bearing: 140,
      //   duration: 5000
      // }, function () {
      //   //alert("Camera target has been changed");
      // });
    });
  }

  getCurrentPosition() {
    let _base = this;
    _base.geolocation.getCurrentPosition().then((resp) => {
      _base.geo.latitude = resp.coords.latitude
      _base.geo.longitude = resp.coords.longitude
      let place = { lat: _base.geo.latitude, lng: _base.geo.longitude }
      _base.map.animateCamera({
        target: place,
        zoom: 13,
        duration: 2000
      }, function () {
        //alert("Camera target has been changed");
      });
      _base.searchNearby(place, 5000, [])
    }).catch((error) => {
      console.log('Error getting location', error);
      alert("Please turn on your location service")
    })
  }

  showInfoWindow(position, marker, markerInstance) {
    console.log(position, marker)
    let _base = this;
    var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(_base.geo.latitude, _base.geo.longitude), new google.maps.LatLng(position.lat, position.lng)).toString().split('.')[0];
    _base.selectedMarker = marker;
    var html = [
      '<b>' + marker.name + '</b>',
      '<br>',
      '<p>' + distance + ' meter away</p>',
      '<br>',
      '<button onclick="javascript:document.getElementById(\'direction\').click();">Get Direction</button>',
    ].join("");
    this.info.setContent(html);
    this.info.open(markerInstance)
  }

  showDirection() {
    let start = {
      lat: this.geo.latitude,
      lng: this.geo.longitude
    };
    let end = this.selectedMarker.position;
    this.lunchNavigator(start, end)
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


  searchNearby(place, distance, types) {
    let _base = this;
    let service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch({
      location: place,
      radius: distance,
      type: types,
    }, function (results, status) {

      console.log(results, status)

      _base.generateMarkerData(results)
        .then(function (success: any) {
          console.log("markers data", success)
          // if (_base.clusters) {
          //   _base.map.remove(_base.clusters)
          // }
          _base.clusters = _base.map.addMarkerCluster({
            markers: success,
            icons: [
              { min: 2, max: 100, url: "./img/blue.png", anchor: { x: 16, y: 16 } },
              { min: 100, max: 1000, url: "./img/yellow.png", anchor: { x: 16, y: 16 } },
              { min: 1000, max: 2000, url: "./img/purple.png", anchor: { x: 24, y: 24 } },
              { min: 2000, url: "./img/red.png", anchor: { x: 32, y: 32 } }
            ]
          });


          _base.clusters.on(plugin.google.maps.event.MARKER_CLICK, function (position, marker) {
            console.log(position, marker);
            console.log(marker[Object.getOwnPropertySymbols(marker)[0]])
            console.log(marker[Object.getOwnPropertySymbols(marker)[1]])
            // let index = success.findIndex(x => x.position.lng == position.lng);
            // console.log("Index", index)
            _base.showInfoWindow(position, marker[Object.getOwnPropertySymbols(marker)[0]], marker)
          });

        });


      // if (status === google.maps.places.PlacesServiceStatus.OK) {
      //   for (var i = 0; i < results.length; i++) {
      //     createMarker(results[i]);
      //   }

      //   map.setCenter(results[0].geometry.location);
      // }
    });
  }

  generateMarkerData(data: any) {
    let markersdata = []
    return new Promise(function (resolve, reject) {
      if (data.length == 0) {
        reject({})
      }
      for (let i = 0; i <= data.length - 1; i++) {
        let item = data[i]
        let place: any = {}
        place.title = item.name;
        place.name = item.name;
        place.address = item.vicinity;
        place.position = {
          lat: item.geometry.location.lat(),
          lng: item.geometry.location.lng()
        };
        place.id = item.place_id;
        place.rating = item.rating;
        // place.icon = {
        //   'url': item.icon,
        //   scaledSize: new google.maps.Size(16, 16), // scaled size
        //   origin: new google.maps.Point(0, 0), // origin
        //   anchor: new google.maps.Point(0, 0) // anchor
        // };
        // place.isOpen = item.opening_hours.isOpen();
        markersdata.push(place)
        if (i == data.length - 1) {
          resolve(markersdata)
        }
      }
    })
    // return [
    //   {
    //     "position": {
    //       "lat": 21.382314,
    //       "lng": -157.933097
    //     },
    //     "name": "Starbucks - HI - Aiea  03641",
    //     "address": "Aiea Shopping Center_99-115 Aiea Heights Drive #125_Aiea, Hawaii 96701",
    //     "phone": "808-484-0000"
    //     // "icon": "./img/starbucks.png"
    //   },
    //   {
    //     "position": {
    //       "lat": 21.3871,
    //       "lng": -157.9482
    //     },
    //     "name": "Starbucks - HI - Aiea  03642",
    //     "address": "Pearlridge Center_98-125 Kaonohi Street_Aiea, Hawaii 96701",
    //     "phone": "808-484-0000"
    //     // "icon": "./img/starbucks.png"
    //   }
    // ]
  }

}
