import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.feed = this.navParams.get('feed')
    console.log(this.feed)
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad Feed2Page');
    // this.loadMap()
  }
  back() {
    this.navCtrl.pop();
  }
}
