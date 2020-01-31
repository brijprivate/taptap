import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Item } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { Contacts, Contact, ContactField, ContactName, ContactOrganization, ContactAddress } from '@ionic-native/contacts';
import * as moment from 'moment'
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Downloader, NotificationVisibility, DownloadRequest } from '@ionic-native/downloader';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import { HomePage } from '../home/home';
// import { SearchPage } from '../search/search';
import { TaptapPage } from '../taptap/taptap';
import { DashboardPage } from '../dashboard/dashboard';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

declare var require: any
/**
 * Generated class for the TapdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tapdetails',
  templateUrl: 'tapdetails.html',
})
export class TapdetailsPage {

  // devicedetaill:Object
  share: boolean = true;
  public eventdata: any = [];
  public deviceData: any = [];
  public fromDevice: any;
  public thisMonth: any;
  public userId: any;
  public uRLlink = "https://share.thingtap.com/?category=";
  public shareLink = "https://share.thingtap.com/share.php?"
  public link: any;
  isfav: boolean = false;
  public linkId: any;
  xx: any;
  API_URL = "https://api.thingtap.com";
  keyy: any;
  public st: any;
  public et: any;
  devicedetaill: any = {}
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private nativeGeocoder: NativeGeocoder,
    private file: File,
    private fileOpener: FileOpener,
    private downloader: Downloader,
    private toast: ToastController,
    public alert: AlertController,
    private androidPermissions: AndroidPermissions,
    private launchNavigator: LaunchNavigator,
    public loading: LoadingController,
    private geolocation: Geolocation,
    public nfctagPro: NfctagProvider,
    private socialsharing: SocialSharing,
    public sharedservice: SharedserviceProvider,
    public logregpro: LoginsignupProvider,
    private contacts: Contacts) {
    this.userId = localStorage.getItem("userId");

    // 
    this.deviceData = this.navParams.get("devicedetaill");
    // this.devicedetaill = this.navParams.get("devicedetaill");
    this.fromDevice = this.navParams.get("key");
    // if(this.fromDevice=="devicee"){
    //   this.deviceData = this.devicedetaill.deviceInfo;
    // }
    this.keyy = this.navParams.get("keyy");
    // 
    if (this.navParams.get("devicedetaill")) {
      // this.eventdata = this.navParams.get("devicedetaill");
      this.eventdata = navParams.data;

    } else {
      this.eventdata = navParams.data;
    }



    if (this.eventdata.storeId) {
      let website = this.eventdata.storeId.companyId.website;
      if (website) {
        if (!website.includes('http') || !website.includes('://')) {
          this.eventdata.storeId.companyId.website = "http://" + website
        }
      }
    }

    if (this.eventdata.fashionId) {
      let link = this.eventdata.fashionId.weblink;
      if (link) {
        if (!link.includes('http') || !link.includes('://')) {
          this.eventdata.fashionId.weblink = "http://" + link
        }
      }
    }
    if (this.eventdata.contactId) {
      let link = this.eventdata.contactId.link;
      if (link) {
        if (!link.includes('http') || !link.includes('://')) {
          this.eventdata.contactId.link = "http://" + link
        }
      }
    }

    if (this.navParams.get("devicedetaill")) {
      let link = this.eventdata.devicedetaill.deviceInfo.contact_info.website;
      if (link) {
        if (!link.includes('http') || !link.includes('://')) {
          this.eventdata.devicedetaill.deviceInfo.contact_info.website = "http://" + link
        }
      }
    }


    if (this.eventdata.eventId) {

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.thisMonth = monthNames[(new Date()).getMonth() + 1];

      this.st = moment(this.eventdata.eventId.startTime).utc().format('MMMM Do YYYY h mm ss a');

      this.st = this.st.split(' ')

      this.et = moment(this.eventdata.eventId.endTime).utc().format('MMMM Do YYYY h mm ss a');

      this.et = this.et.split(' ')

    }

  }

  forwardNavigate(location: any) {
    let _base = this;
    this.launchNavigator.navigate(location);
  }

  navigatetolocation(latitude, longitude) {
    let _base = this

    if (localStorage.getItem('lat') != null || localStorage.getItem('lat') != undefined) {
      let start = {
        lat: localStorage.getItem('lat'),
        lng: localStorage.getItem('lng')
      };

      let end = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };

      _base.lunchNavigator(start, end);
    } else {
      _base.presentToast('Please turn on location service')
    }

  }

  presentToast(text) {
    let toast = this.toast.create({
      message: text,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  downloadPdf(url: string) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      var request: DownloadRequest = {
        uri: url,
        title: 'Restaurant-Menu',
        description: '',
        mimeType: '',
        visibleInDownloadsUi: true,
        notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
        destinationInExternalFilesDir: {
          dirType: 'Downloads',
          subPath: '/'
        }
      };


      _base.downloader.download(request)
        .then((location: string) => {
          resolve(location)
        })
        .catch((error: any) => {
          reject(error);
        });
    })
  }

  showPdf(url: string) {
    let _base = this;
    _base.downloadPdf(url)
      .then(function (success: string) {
        alert('Pdf Downloaded')
        _base.fileOpener.open(success, 'application/pdf')
          .then(() => { })
          .catch(e => { })
      }, function (error) {
        alert('Can not download the pdf')
      })
  }


  //mark as favourite api.....
  fav(item, id) {
    let _base = this;

    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let favdata = {
      productId: id,
      categoryType: item.purpose,
      userId: this.userId
    }

    this.nfctagPro.createFav(favdata).then(function (success: any) {

      loader.dismiss();
      _base.isfav = true;
    }, function (err) {

      loader.dismiss();
    })
  }

  //social sahre....
  socialshare(i, j) {
    let _base = this;


    this.link = this.uRLlink + i.purpose + '&' + 'id=' + j
    let urldata = {
      url: this.link
    }

    _base.socialsharing.share(this.link).then(() => {
    }).catch(() => {

    })
    // this.logregpro.shortlink(urldata).then(function (success: any) {


    //   _base.socialsharing.share(success.result.url).then(() => {
    //   }).catch(() => {

    //   })
    // }, function (err) {

    // })
    // this.socialsharing.share(this.link).then(() => {

    // }).catch(() => {

    // })
  }

  productshare(adminId: String, categoryId: String) {
    let _base = this;
    this.link = this.shareLink + "category=" + categoryId + '&' + 'adminId=' + adminId
    let urldata = {
      url: this.link
    }

    _base.socialsharing.share(this.link).then(() => {
    }).catch(() => {

    })
    // this.logregpro.shortlink(urldata).then(function (success: any) {


    //   _base.socialsharing.share(success.result.url).then(() => {
    //   }).catch(() => {

    //   })
    // }, function (err) {

    // })
  }

  //social share of device....
  socialsharedevice(data) {
    let _base = this;

    this.link = this.uRLlink + 'Contact_info' + '&' + 'id=' + data.nfc_id;

    let urldata = {
      url: this.link
    }
    this.logregpro.shortlink(urldata).then(function (success: any) {


      _base.socialsharing.share(success.result.url).then(() => {
      }).catch(() => {

      })
    }, function (err) {

    })
  }

  //update product....
  updateProduct(favdata, fav: Boolean) {

    // let loader = this.loading.create({
    //   content:"Please wait..."
    // });
    // loader.present();

    let _base = this;
    let updatedata = {
      tappId: this.eventdata._id,
      is_favourite: !this.eventdata.is_favourite
    }

    this.nfctagPro.favUpdate(updatedata).then(function (success: any) {

      // loader.dismiss();
      if (!_base.eventdata.is_favourite == true) {
        // _base.fav(_base.eventdata, favdata)
      }
      _base.eventdata = success.result

    }, function (err) {

      // loader.dismiss();
    })
  }


  //update product....
  updateProductt(favdata, fav: Boolean) {

    // let loader = this.loading.create({
    //   content:"Please wait..."
    // });
    // loader.present();

    let _base = this;
    let updatedata = {
      tappId: favdata,
      is_favourite: !fav
    }

    this.nfctagPro.favUpdate(updatedata).then(function (success: any) {

      // loader.dismiss();
      if (!_base.eventdata.is_favourite == true) {
        // _base.fav(_base.eventdata, favdata)
      }

      _base.eventdata.devicedetaill = success.result;

    }, function (err) {

      // loader.dismiss();
    })
  }

  //get product by id....
  getById(linkId) {
    let _base = this;
    this.nfctagPro.getproductbyide(linkId).then(function (success: any) {


      _base.eventdata = success;
    }, function (err) {

    })
  }

  savecontact(data) {



    let _base = this;
    var contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, null, data.name);
    contact.phoneNumbers = [new ContactField('mobile', data.telephoneNumber), new ContactField('mobile', data.mobileNumber)];
    // contact.phoneNumbers = [new ContactField('mobile', data.mobileNumber)];
    contact.organizations = [new ContactOrganization('company', data.company)];
    contact.addresses = [new ContactAddress(false, "home", data.address)];
    contact.emails = [new ContactField('email', data.email)];
    contact.urls = [new ContactField('website', data.link)];
    // if (data.profile_pic) {
    //   contact.photos = [new ContactField('photo', _base.API_URL + "/file/getImage?imageId=" + data.profile_pic + "&select=thumbnail")];
    // }
    // contact.photos = [new ContactField(new URL(_base.API_URL+"/file/getImage?imageId="+data.image))];
    let base4img = "assets/images/avatar.png";
    _base.convertToDataURLviaCanvas(_base.API_URL + "/file/getImage?imageId=" + data.profile_pic, "image/png").then(function (base64img: string) {
      let stringimage: string = base64img;
      contact.photos = [new ContactField('photo', stringimage, true)];

      contact.save().then((contact) => {

        alert("contact saved");

      }, function (err) {

        // alert("contact not saved");
      })
    }, error => {
      contact.save().then((contact) => {

        alert("contact saved");

      }, function (err) {

        alert("contact not saved");
      })
    })

  }

  savedevicecontact(data) {





    let _base = this;
    var contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, null, data.deviceInfo.contact_info.name);
    contact.phoneNumbers = [new ContactField('mobile', data.deviceInfo.contact_info.mobileNumber), new ContactField('mobile', data.deviceInfo.contact_info.phoneNumber)];
    // contact.phoneNumbers = [new ContactField('mobile', data.deviceInfo.contact_info.phoneNumber)];

    contact.organizations = [new ContactOrganization('company', data.deviceInfo.contact_info.company_name)];
    contact.emails = [new ContactField('email', data.deviceInfo.contact_info.email)];
    contact.urls = [new ContactField('website', data.deviceInfo.contact_info.website)];
    contact.addresses = [new ContactAddress(false, "home", data.deviceInfo.contact_info.address)];
    // if (data.imageId) {
    //   contact.photos = [new ContactField('image', _base.API_URL + "/file/getImage?imageId=" + data.deviceInfo.imageId._id + "&select=thumbnail", true)];
    // }

    let base4img = "assets/images/avatar.png";
    _base.convertToDataURLviaCanvas(_base.API_URL + "/file/getImage?imageId=" + data.deviceInfo.imageId._id, "image/png").then(function (base64img: string) {
      let stringimage: string = base64img;
      contact.photos = [new ContactField('photo', stringimage, true)];

      contact.save().then((contact) => {

        alert("contact saved");

      }, function (err) {

        // alert("contact not saved");
      })
    }, error => {
      contact.save().then((contact) => {

        alert("contact saved");

      }, function (err) {

        alert("contact not saved");
      })
    })
  }

  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
        canvas = null;
      };
      img.onerror = function () {
        //display error
        reject({})
      };
      img.src = url;
    });
  }


  getimage(data) {
    var image = this.API_URL + "/file/getImage?imageId=" + data.profile_pic;

  }
  showfull(src) {

    var modal = document.getElementById("myModal");
    var img = document.getElementById("myImg");

    modal.style.display = "flex";
    this.xx = src;
    var span = document.getElementsByClassName("close")[0];

  }

  close() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }
  back() {
    this.navCtrl.pop();

    // if (this.eventdata.islink || this.eventdata.devicedetaill) {
    //   
    //   this.navCtrl.setRoot(DashboardPage);
    // } else {
    //   this.navCtrl.pop();
    // }
  }

  // download pdf
  download(pdfID: String) {
    const url = "https://api.thingtap.com/file/getImage?imageId=" + pdfID;
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      alert('MENU download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
      alert("Can not download MENU")
    });
  }

  navigate(geo: any) {
    let _base = this

    if (localStorage.getItem('lat') != null || localStorage.getItem('lat') != undefined) {
      let start = {
        lat: localStorage.getItem('lat'),
        lng: localStorage.getItem('lng')
      };

      let end = {
        lat: parseFloat(geo.latitude),
        lng: parseFloat(geo.longitude)
      };

      _base.lunchNavigator(start, end);
    } else {
      _base.presentToast('Please turn on location service')
    }
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


  website(url) {
    window.open(url, "_system")
  }
}
