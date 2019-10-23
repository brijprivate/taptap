import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { NfctagProvider } from './../../providers/nfctag/nfctag';
import { LoginsignupProvider } from './../../providers/loginsignup/loginsignup';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

/**
 * Generated class for the Feed3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare let plugin: any;


@IonicPage()
@Component({
  selector: 'page-feed3',
  templateUrl: 'feed3.html',
})
export class Feed3Page {
  slideselected: string = 'discount';
  @ViewChild('slider') slider: Slides;

  feed1data: any;
  public feed: any = {}
  public map: any;
  public like: any = false;
  public distance: any;
  public fav_count: any = 0;
  public current_location: any = {};
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
  public companies: any = [];

  public query: any = {
    // type: 'public',
    userId: localStorage.getItem('userId'),
  };

  constructor(private launchNavigator: LaunchNavigator, public nativeGeocoder: NativeGeocoder, public service: NfctagProvider, public http: LoginsignupProvider,
    public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {
    let _base = this;
    _base.http.getallcategories()
      .then(function (success: any) {
        // console.log(success)
        _base.categories = [];
        _base.categories = success.result
        console.log(_base.categories)
      }, function (error) {

      })
  }

  getCetgoryNameById(categoryId: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      for (let i = 0; i <= _base.categories.length - 1; i++) {
        let category = _base.categories[i]
        if (category._id == categoryId) {
          resolve(category.name)
        }

        if (i == _base.categories.length - 1) {
          reject({})
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Feed3Page');
  }
  selectedTab(index) {

    this.slideselected = (this.slideselected == 'discount') ? "feeds" : "discount";
    this.slider.slideTo(index);

  }
  slideChanged() {
    this.slideselected = (this.slideselected == 'discount') ? "feeds" : "discount";
  }

  ionViewDidEnter() {
    // console.log('ionViewDidLoad Feed1Page');
    // this.loadMap()
    // this.info = new plugin.google.maps.HtmlInfoWindow();
    let _base = this;
    _base.getCurrentPosition()
    _base.getcompanies()
  }

  goto(x) {
    this.navCtrl.push('Feed2Page', { feed: x })
  }


  getallfeeds() {
    let _base = this;
    let userId = localStorage.getItem('userId')
    _base.http.getAllFeedsList(userId)
      .then(function (success: any) {
        // console.log(success)
      }, function (error) {
        // console.log(error)
      });
  }

  showFeeds() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.getmyfeeds()
        .then(function (success: any) {
          // console.log(success)
          _base.feeds = success.result.map(function (feed) {
            let date = new Date(feed.createdDate)
            let dateString = date.toLocaleDateString()
            feed.createdDate = dateString;
            let favourites = feed.favourites;
            if (favourites.includes(localStorage.getItem('userId'))) {
              feed.like = true
            } else {
              feed.like = false;
            }
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

    // console.log("here", _base.query.search, _base.query.search.trim().length)

    let query = {
      userId: _base.query.userId,
      location: _base.geo
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

  getCurrentPosition() {
    let _base = this;
    _base.geolocation.getCurrentPosition().then((resp) => {
      _base.geo.latitude = resp.coords.latitude
      _base.geo.longitude = resp.coords.longitude
      let place = { lat: _base.geo.latitude, lng: _base.geo.longitude }

      // _base.nativeGeocoder.reverseGeocode(_base.geo.latitude, _base.geo.longitude)
      //   .then((result: any) => {
      //     _base.location = result[0].formatted_address;
      //   });

      _base.showFeeds();

      // _base.searchNearby(place, 5000, []);
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


  getproduct(company: any) {
    let _base = this;
    let categoryId = company.subscribed_category[0].categoryId;
    let adminId = company.adminId._id;

    _base.getCetgoryNameById(categoryId)
      .then(function (categoryName: String) {
        _base.http.getProductAdminCategory(categoryName, adminId)
          .then(function (success: any) {
            if (success.result.length != 0) {
              console.log("success", success.result[0])
              let product = success.result[0]
              _base.showCompanyProduct(categoryName, product)
            } else {
              alert('This company has no product yet')
            }
          }, function (error: any) {
            console.log("error", error)
          });
      });

  }


  showCompanyProduct(categoryName, product) {

    let item = product;
    let object = {}

    switch (categoryName) {
      case 'Business':
        object = {
          businessId: item,
          storeId: item.storeId
        }
        break;
      case 'Contacts':
        object = {
          contactId: item,
          storeId: item.storeId
        }
        break;
      case 'Sports':
        object = {
          sportId: item,
          storeId: item.storeId
        }
        break;
      case 'Fashion':
        object = {
          fashionId: item,
          storeId: item.storeId
        }
        break;
      case 'General':
        object = {
          generalId: item,
          storeId: item.storeId
        }
        break;
      case 'Event':
        object = {
          eventId: item,
          storeId: item.storeId
        }
        break;
      case 'Groceries':
        object = {
          groceryId: item,
          storeId: item.storeId
        }
        break;
      case 'Restaurant':
        object = {
          restaurantId: item,
          storeId: item.storeId
        }
        break;
      case 'Verification':
        object = {
          verificationId: item,
          storeId: item.storeId
        }
        break;
      default:
    }
    this.navCtrl.push('TapdetailsPage', object);
  }



  showProduct(feed) {
    let object = {};
    let _base = this;
    switch (feed.categoryId.name) {
      case 'Business':
        object = {
          businessId: feed.product,
          storeId: feed.product.storeId
        }
        break;
      case 'Contacts':
        object = {
          contactId: feed.product,
          storeId: feed.product.storeId
        }
        break;
      case 'Sports':
        object = {
          sportId: feed.product,
          storeId: feed.product.storeId
        }
        break;
      case 'Fashion':
        object = {
          fashionId: feed.product,
          storeId: feed.product.storeId
        }
        break;
      case 'General':
        object = {
          generalId: feed.product,
          storeId: feed.product.storeId
        }
        break;
      case 'Event':
        object = {
          eventId: feed.product,
          storeId: feed.product.storeId
        }
        break;
      case 'Groceries':
        object = {
          groceryId: feed.product,
          storeId: feed.product.storeId
        }
        break;
      case 'Restaurant':
        object = {
          restaurantId: feed.product,
          storeId: feed.product.storeId
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


  clickFeed(feed: any) {
    let _base = this;
    let click = {
      feedId: feed._id,
      userId: localStorage.getItem('userId')
    }
    _base.service.clickFeed(click)
      .then(function (success) {
        _base.showProduct(feed)
      }, function (error) {

      });
  }

  getcompanies() {
    let _base = this;
    _base.service.getcompanies()
      .then(function (companies: any) {
        _base.companies = companies.result.filter(company => {
          if (company.display_picture && company.discount) {
            return true
          }
        });
      });
  }

  feedAction(_id: String) {
    let _base = this;
    let click = {
      feedsId: _id,
      userId: localStorage.getItem('userId')
    }
    _base.service.feedAction(click)
      .then(function (success: any) {
        _base.showFeeds()
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
