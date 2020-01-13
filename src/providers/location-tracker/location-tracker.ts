import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { Subscription } from 'rxjs/Rx';
import { SharedserviceProvider } from '../sharedservice/sharedservice';



/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

  subscriptions: Array<Subscription> = new Array<Subscription>();

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  arr: any = [];

  constructor(public zone: NgZone, public geolocation: Geolocation,
    public backgroundGeolocation: BackgroundGeolocation,
    public sharedservice: SharedserviceProvider, ) {
    
  }


  startTracking() {

    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: false,
      // interval: 3000 
    };

    // this.backgroundGeolocation.configure(config).then((location) => {
    //   
    //   // Run update inside of Angular's zone
    //   this.zone.run(() => {
    //     this.lat = location.latitude;
    //     this.lng = location.longitude;
    //     // 
    //   });
    // }, (err) => {
    //   
    // });


    this.backgroundGeolocation.on(BackgroundGeolocationEvents['location']).subscribe((location) => {
      // Run update inside of Angular's zone
      // this.zone.run(() => {
      this.lat = location.latitude;
      this.lng = location.longitude;
      // 
      // });
    }, (err) => {
      
    });
    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 10000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).
      filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

        // 

        // Run update inside of Angular's zone
        // this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        var fetchedlocation = {
          latitude: this.lat,
          longitude: this.lng
        }
        this.arr.push(fetchedlocation);
        this.sharedservice.locations(fetchedlocation);
        // 
        // });

      });
  }

  stopTracking() {

    

    this.backgroundGeolocation.stop();
    this.watch.unsubscribe();

  }
}
