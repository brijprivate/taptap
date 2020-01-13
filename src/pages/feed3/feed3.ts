import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, Slides } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { NfctagProvider } from './../../providers/nfctag/nfctag';
import { LoginsignupProvider } from './../../providers/loginsignup/loginsignup';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Storage } from '@ionic/storage';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';

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
  public lazy: boolean = true;

  public query: any = {
    // type: 'public',
    userId: localStorage.getItem('userId'),
  };

  constructor(public sharedservice: SharedserviceProvider, public toastCtrl: ToastController, private storage: Storage, private launchNavigator: LaunchNavigator, public nativeGeocoder: NativeGeocoder, public service: NfctagProvider, public http: LoginsignupProvider,
    public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {
    let _base = this;
    _base.sharedservice.httpresponse
      .subscribe(function (response: any) {

        _base.getcompanies(response.companies)
        _base.showfeeds(response.feeds)
      })
  }

  showfeeds(feeds: any) {
    if (JSON.stringify(feeds) == JSON.stringify(this.feeds)) {
      return
    }
    this.feeds = feeds;
  }

  loadlazy() {
    let _base = this;
    let imgs = (document.querySelectorAll('img'));
    // imgs.forEach(imga => {
    let img = (<HTMLImageElement>imgs[4])

    let src = img.src;
    img.src = src;
    img.onload = function () {
      // alert('Image loaded')

      img.src = src.replace("&select=thumbnail", "")
    }
    // });

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

  selectedTab(index) {
    this.slideselected = (this.slideselected == 'discount') ? "feeds" : "discount";
    this.slider.slideTo(index);
  }

  slideChanged() {
    this.slideselected = (this.slideselected == 'discount') ? "feeds" : "discount";
  }

  goto(x) {
    this.navCtrl.push('Feed2Page', { feed: x })
  }



  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1000,
      position: 'top'
    });

    toast.present();
  }

  getproduct(company: any) {
    let _base = this;
    let categoryId = company.subscribed_category[0].categoryId;
    let adminId = company.adminId._id;

    console.log(categoryId, adminId)

    _base.getCetgoryNameById(categoryId)
      .then(function (categoryName: String) {
        _base.http.getProductAdminCategory(categoryName, adminId)
          .then(function (success: any) {
            if (success.result.length != 0) {

              let product = success.result[0]
              _base.showCompanyProduct(categoryName, product)
            } else {
              _base.presentToast('This company has no product yet')
            }
          }, function (error: any) {

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

  getcompanies(companies) {
    let _base = this;
    if (JSON.stringify(_base.companies) == JSON.stringify(companies)) {
      return
    }
    _base.companies = companies;

  }

  feedAction(_id: String) {
    let _base = this;
    let click = {
      feedsId: _id,
      userId: localStorage.getItem('userId')
    }
    _base.service.feedAction(click)
      .then(function (success: any) {
        _base.presentToast('Your reaction will be updated in a moment');
      }, function (error) {
      });
  }


  navigate() {
    let _base = this
    _base.geolocation.getCurrentPosition().then((resp) => {


      let start = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };

      localStorage.setItem("lat", start.lat.toString())
      localStorage.setItem("lng", start.lng.toString())

      let end = {
        lat: parseFloat(_base.feed.product.storeId.companyId.geo.latitude),
        lng: parseFloat(_base.feed.product.storeId.companyId.geo.longitude)
      };



      _base.lunchNavigator(start, end);

    }).catch((error) => {

    })
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
    this.navCtrl.pop();
  }
}
