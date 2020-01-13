import { Component, NgZone } from '@angular/core';
import { ViewController, NavController, IonicPage, NavParams } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;


  latitude: number = 0;
  longitude: number = 0;
  geo: any

  service = new google.maps.places.AutocompleteService();

  constructor(public viewCtrl: ViewController, private zone: NgZone, public param: NavParams) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    let elem = <HTMLInputElement>document.querySelector('ion-searchbar');
    
    elem.focus()
    if (elem) {
      elem.click();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  chooseItem(item: any) {
    this.geo = item;
    this.geoCode(this.geo);//convert Address to lat and long
  }

  updateSearch() {

    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      // location: new google.maps.LatLng(),
      // radius: 15,
      componentRestrictions: {
        // country: 'usa',
      }
    }, (predictions, status) => {
      me.autocompleteItems = [];

      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }

  //convert Address string to lat and long
  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    let _base = this;
    geocoder.geocode({ 'address': address }, (results, status) => {
      
      
      let latitude = results[0].geometry.location.lat();
      let longitude = results[0].geometry.location.lng();
      let country = _base.getCountry(results[0].address_components);
      let city = _base.getLocallity(results[0].address_components);
      let location = address;
      _base.viewCtrl.dismiss({
        lat: latitude,
        lng: longitude,
        city: city,
        country: country,
        location: location
      });
    });
  }


  getCountry(address_component: any) {
    let country: String = ""
    for (let i = 0; i <= address_component.length - 1; i++) {
      let Component: any = address_component[i]
      let type: any = Component.types;
      let index = type.indexOf('country')
      
      
      if (index != -1) {
        country = address_component[i].long_name
      }

      if (i == address_component.length - 1) {
        return country;
      }
    }
  }

  getLocallity(address_component: any) {
    let locality: String = ""
    for (let i = 0; i <= address_component.length - 1; i++) {
      let Component: any = address_component[i]
      let type: any = Component.types;
      let index = type.indexOf('locality')
      let index_x = type.indexOf('postal_town')

      
      
      if (index != -1 || index_x != -1) {
        locality = address_component[i].long_name
      }

      if (i == address_component.length - 1) {
        return locality;
      }
    }
  }


}