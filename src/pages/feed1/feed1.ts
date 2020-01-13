import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { LoginsignupProvider } from './../../providers/loginsignup/loginsignup';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

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
  public location: any = "";
  public geo: any = {};
  public clusters: any;
  public taptapclusters: any;
  public info: any;
  public selectedMarker: any;
  public categories: any = [];
  public feeds: any = [];
  public googleNearby: any = [];
  public toggle_text = "hide nearby"

  public query: any = {
    // type: 'public',
    userId: localStorage.getItem('userId'),
    search: "",
    category: []
  };

  constructor(private nativeGeocoder: NativeGeocoder, private launchNavigator: LaunchNavigator, public http: LoginsignupProvider,
    public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {
  }

  ionViewDidEnter() {
    // 
    // this.loadMap()
    // this.info = new plugin.google.maps.HtmlInfoWindow();
    let _base = this;

    _base.http.getallcategories()
      .then(function (success: any) {
        // 
        _base.categories = [];
        _base.categories = success.result.filter(function (category) {
          if (category.name != 'General' && category.name != 'Contacts' && category.name != 'Verification') {
            return category;
          }
        });
        
      }, function (error) {

      })
    this.showFeeds()
    setInterval(function () {
      (<HTMLElement>document.querySelector(".contentEvent")).click();
    }, 500)
  }

  back() {
    this.navCtrl.pop();
  }
  goto(x) {
    this.navCtrl.push('Feed2Page', { feed: x })
  }

  getCurrentPosition() {
    let _base = this;
    _base.geolocation.getCurrentPosition().then((resp) => {
      _base.geo.latitude = resp.coords.latitude
      _base.geo.longitude = resp.coords.longitude
      let place = { lat: _base.geo.latitude, lng: _base.geo.longitude }

      _base.nativeGeocoder.reverseGeocode(_base.geo.latitude, _base.geo.longitude)
        .then((result: any) => {
          _base.location = result[0].formatted_address;
        });

      _base.showFeeds();

      // _base.searchNearby(place, 5000, []);
    }).catch((error) => {
      // 
      alert("Please turn on your location service")
    })
  }

  selectCategory(categoryId: String, i) {
    let _base = this;
    let Index = _base.query.category.indexOf(categoryId);
    if (Index == -1) {
      _base.query.category.push(categoryId)
      let element = <HTMLCollection>document.getElementsByClassName('c' + i)
      
      element[0].className = "category c" + i + " active"
    } else {
      _base.query.category.splice(Index, 1);
      let element = <HTMLCollection>document.getElementsByClassName('c' + i)
      
      element[0].className = "category c" + i
    }
    _base.showFeeds()
  }


  search(e: any) {
    
    this.showFeeds();
  }

  toggleNearbu() {
    let element = <HTMLElement>document.getElementById('google-nearby')
    
    if (element.style.display == "none") {
      element.style.display = "block"
      this.toggle_text = "hide nearby"
    } else {
      element.style.display = "none"
      this.toggle_text = "show nearby"
    }
  }

  getallfeeds() {
    let _base = this;
    let userId = localStorage.getItem('userId')
    _base.http.getAllFeedsList(userId)
      .then(function (success: any) {
        // 
      }, function (error) {
        // 
      });
  }

  showFeeds() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.getmyfeeds()
        .then(function (success: any) {
          // 
          _base.feeds = success.result.map(function (feed) {
            let date = new Date(feed.createdDate)
            let dateString = date.toLocaleDateString()
            feed.createdDate = dateString;
            return feed;
          }).filter(feed => {
            if (feed.product) {
              return true
            }
          });

          resolve(success)

        }, function (error) {
          reject(error)
        });
    })
  }

  getmyfeeds() {
    let _base = this;

    // 

    let query = {
      userId: _base.query.userId,
      search: _base.query.search ? (_base.query.search.trim().length == 0 ? "" : _base.query.search) : "",
      category: _base.query.category,
      location: _base.geo.latitude ? _base.geo : null
    };
    return new Promise(function (resolve, reject) {
      _base.http.getMyFeeds(query)
        .then(function (success: any) {
          resolve(success)
        }, function (error: any) {
          reject(error)
        });
    });
  }

}
