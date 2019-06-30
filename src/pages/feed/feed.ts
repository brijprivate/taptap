import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  categories: any = []
  feeds: any = []
  selected_category: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: NfctagProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
    // this.http.getfeeds()
    this.getcategories()
  }
  back() {
    this.navCtrl.pop();
  }

  getcategories() {
    let _base = this
    _base.http.getcategories()
      .then(function (success: any) {
        console.log(success)
        _base.categories = success.result
        _base.searchfeeds(_base.categories[0]._id, _base.categories[0])
      }, function (error) {
        console.log(error)
      })
  }

  searchfeeds(categoryID: String, category: any) {
    let _base = this
    _base.selected_category = category
    _base.http.getfeeds(categoryID)
      .then(function (success: any) {
        console.log(success)
        let lastcreateddate = "";
        _base.feeds = success.result.map((item) => {
          let obj: any = {};
          let createddate = item.createdDate.split("T")[0]
          console.log(createddate, lastcreateddate)
          if (lastcreateddate != createddate) {
            console.log("here")
            lastcreateddate = createddate
            obj.date = createddate
          }
          obj.time = _base.tConvert(item.createdDate.split("T")[1].split(":")[0] + ":" + item.createdDate.split("T")[1].split(":")[1])
          Object.assign(obj, item)
          return obj
        });
      }, function (error) {
        console.log(error)
      })
  }

  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }


  detailsPage(feed) {
    let object = {}
    let category = feed.categoryId.name
    let item = feed.product
    switch (category) {
      case 'Business':
        object = {
          businessId: item
        }
        break;
      case 'Contacts':
        object = {
          contactId: item
        }
        break;
      case 'Sports':
        object = {
          sportId: item
        }
        break;
      case 'Fashion':
        object = {
          fashionId: item
        }
        break;
      case 'General':
        object = {
          generalId: item
        }
        break;
      case 'Event':
        object = {
          eventId: item
        }
        break;
      case 'Groceries':
        object = {
          groceryId: item
        }
        break;
      case 'Verification':
        object = {
          verificationId: item
        }
        break;
      default:
    }

    this.navCtrl.push('TapdetailsPage', object);
  }

}


