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

  public eventdata: any = [];
  public deviceData: any = [];
  public fromDevice: any;
  public thisMonth: any;
  public userId: any;
  public uRLlink = "https://taptapshare.000webhostapp.com/?category=";
  public link: any;
  isfav: boolean = false;
  public linkId: any;
  xx: any;
  API_URL = "https://api.taptap.org.uk";
  keyy: any;
  public st: any;
  public et: any;
  devicedetaill: any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
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
    private contacts: Contacts) {
    this.userId = localStorage.getItem("userId");

    // console.log("item details----", this.eventdata);
    this.deviceData = this.navParams.get("devicedetail");
    // this.devicedetaill = this.navParams.get("devicedetaill");
    this.fromDevice = this.navParams.get("key");
    // if(this.fromDevice=="devicee"){
    //   this.deviceData = this.devicedetaill.deviceInfo;
    // }
    this.keyy = this.navParams.get("keyy");
    // console.log("device data=----------------", this.devicedetaill.deviceInfo._id);
    this.eventdata = navParams.data;

    if(this.eventdata.storeId){
      let website = this.eventdata.storeId.companyId.website;
      if (website) {
        if (!website.includes('http') || !website.includes('://')) {
          this.eventdata.storeId.companyId.website = "http://" + website
        }
      }
    }

    if (this.eventdata.fashionId) {
      let link = this.eventdata.fashionId.weblink;
      if (!link.includes('http') || !link.includes('://')) {
        this.eventdata.fashionId.weblink = "http://" + link
      }
    }


    if (this.eventdata.eventId) {
      console.log(this.eventdata.eventId.startTime, this.eventdata.eventId.endTime)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.thisMonth = monthNames[(new Date()).getMonth() + 1];
      console.log(this.thisMonth);
      this.st = moment(this.eventdata.eventId.startTime).utc().format('MMMM Do YYYY h mm ss a');

      this.st = this.st.split(' ')

      this.et = moment(this.eventdata.eventId.endTime).utc().format('MMMM Do YYYY h mm ss a');

      this.et = this.et.split(' ')
      console.log(this.et)
    }

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
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      }, function (error) {
        alert('Can not download the pdf')
      })

  }


  ionViewDidEnter() {

    // this.eventdata = this.navParams.get("itemdetails");
    // console.log("item details----", this.eventdata);

    // if (this.eventdata.eventId) {
    //   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //   this.thisMonth = monthNames[(new Date()).getMonth()];
    //   console.log(this.thisMonth);
    // }
  }

  // this.eventdata = this.navParams.get("itemdetails");
  // console.log("item details----", this.eventdata);

  // if (this.eventdata.eventId) {
  //   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   this.thisMonth = monthNames[(new Date()).getMonth()];
  //   console.log(this.thisMonth);
  // }
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad TapdetailsPage');
  // }

  //mark as favourite api.....
  fav(item, id) {
    let _base = this;
    console.log(item);
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    let favdata = {
      productId: id,
      categoryType: item.purpose,
      userId: this.userId
    }
    console.log(favdata);
    this.nfctagPro.createFav(favdata).then(function (success: any) {
      console.log(success);
      loader.dismiss();
      _base.isfav = true;
    }, function (err) {
      console.log(err);
      loader.dismiss();
    })
  }

  //social sahre....
  socialshare(i, j) {
    console.log(i);
    console.log(j);
    this.link = this.uRLlink + i.purpose + '&' + 'id=' + j
    this.socialsharing.share(this.link).then(() => {

    }).catch(() => {

    })
  }

  //social share of device....
  socialsharedevice(data) {
    console.log(data);
    this.link = this.uRLlink + 'Contact_info' + '&' + 'id=' + data.nfc_id;
    this.socialsharing.share(this.link).then(() => {

    }).catch(() => {

    })
  }
  //update product....
  updateProduct(favdata, fav: Boolean) {
    console.log(favdata)
    // let loader = this.loading.create({
    //   content:"Please wait..."
    // });
    // loader.present();
    console.log("calling update");
    let _base = this;
    let updatedata = {
      tappId: this.eventdata._id,
      is_favourite: !this.eventdata.is_favourite
    }
    console.log(updatedata);
    this.nfctagPro.favUpdate(updatedata).then(function (success: any) {
      console.log(success);
      // loader.dismiss();
      if (!_base.eventdata.is_favourite == true) {
        // _base.fav(_base.eventdata, favdata)
      }
      _base.eventdata = success.result

    }, function (err) {
      console.log(err);
      // loader.dismiss();
    })
  }

  //get product by id....
  getById(linkId) {
    let _base = this;
    this.nfctagPro.getproductbyide(linkId).then(function (success: any) {
      console.log("from link ----------->>>>>>>>>>");
      console.log(success);
      _base.eventdata = success;
    }, function (err) {
      console.log(err);
    })
  }

  savecontact(data) {

    console.log("Save contact called")

    let _base = this;
    var contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, null, data.name);
    contact.phoneNumbers = [new ContactField('mobile', data.telephoneNumber)];
    contact.phoneNumbers = [new ContactField('mobile', data.mobileNumber)];
    contact.organizations = [new ContactOrganization('company', data.company)];
    contact.addresses = [new ContactAddress(false, "home", data.address)];
    contact.emails = [new ContactField('email', data.email)];
    contact.urls = [new ContactField('website', data.link)];
    if (data.profile_pic) {
      contact.photos = [new ContactField('photo', _base.API_URL + "/file/getImage?imageId=" + data.profile_pic + "&select=thumbnail")];
    }
    // contact.photos = [new ContactField(new URL(_base.API_URL+"/file/getImage?imageId="+data.image))];


    contact.save().then((contact) => {
      alert("contact saved");
    }, (err) => {
      alert("contact not saved");
    })
  }

  savedevicecontact(data) {

    console.log("data", data)
    console.log("data", data.contact_info.address)
    console.log("Device contact called contact called")

    let _base = this;
    var contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, null, data.contact_info.name);
    contact.phoneNumbers = [new ContactField('mobile', data.contact_info.mobileNumber)];
    contact.phoneNumbers = [new ContactField('mobile', data.contact_info.phoneNumber)];

    contact.organizations = [new ContactOrganization('company', data.contact_info.company_name)];
    contact.emails = [new ContactField('email', data.contact_info.email)];
    contact.urls = [new ContactField('website', data.contact_info.website)];
    contact.addresses = [new ContactAddress(false, "home", data.contact_info.address)];
    if (data.imageId) {
      contact.photos = [new ContactField('photo', _base.API_URL + "/file/getImage?imageId=" + data.imageId._id + "&select=thumbnail")];
    }


    console.log(contact)
    contact.save().then((contact) => {
      console.log(contact);
      alert("contact saved");

    }, (err) => {
      console.log(err)
      // alert("contact not saved");
    })
  }


  getimage(data) {
    //     console.log(data.profile_pic);
    // this.nfctagPro.getimage(data.profile_pic).then(function(success:any){
    //   console.log(success);

    // },function(err){
    //   console.log(err);
    // })
    var image = this.API_URL + "/file/getImage?imageId=" + data.profile_pic;
    console.log(image);
  }
  showfull(src) {
    console.log(src)
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
  }

  // download pdf
  download(pdfID: String) {
    const url = "https://api.taptap.org.uk/file/getImage?imageId=" + pdfID;
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
    _base.androidPermissions.checkPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      function (result) {
        console.log('Has permission?', result.hasPermission)
        if (!result.hasPermission) {
          _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        } else {
          _base.geolocation.getCurrentPosition().then((resp) => {

            console.log("lunch navigator");
            let start = {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
            };

            let end = {
              lat: parseFloat(geo.latitude),
              lng: parseFloat(geo.longitude)
            };

            console.log(start, end);

            _base.lunchNavigator(start, end);

          }).catch((error) => {
            console.log('Error getting location', error);
          })
        }
      },
      function (err) {
        _base.androidPermissions.requestPermission(_base.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      });
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


  website(url) {
    window.open(url, "_system")
  }
}
