import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Item } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { Contacts, Contact, ContactField, ContactName, ContactOrganization, ContactAddress } from '@ionic-native/contacts';
import * as moment from 'moment'
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
  API_URL = "http://ec2-18-225-10-142.us-east-2.compute.amazonaws.com:5450";
  keyy: any;
  public st: any;
  public et: any;
  devicedetaill:any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    public alert: AlertController,
    public loading: LoadingController,
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
    this.link = this.uRLlink + 'contactcard' + '&' + 'id=' + data
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
        _base.fav(_base.eventdata, favdata)
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
    let _base = this;
    var contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, null, data.name);
    contact.phoneNumbers = [new ContactField('mobile', data.telephoneNumber)];
    contact.organizations = [new ContactOrganization('company', data.company)];
    contact.addresses = [new ContactAddress(null, data.company)];
    contact.emails = [new ContactField('email', data.email)];
    contact.urls = [new ContactField('website', data.link)];
    if(data.profile_pic){
      contact.photos = [new ContactField('photo', _base.API_URL + "/file/getImage?imageId=" + data.profile_pic)];
    }
    // contact.photos = [new ContactField(new URL(_base.API_URL+"/file/getImage?imageId="+data.image))];


    contact.save().then((contact) => {
      alert("contact saved");
    }, (err) => {
      alert("contact not saved");
    })
  }

  savedevicecontact(data) {
    let _base = this;
    var contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, null, data.contact_info.name);
    contact.phoneNumbers = [new ContactField('mobile', data.contact_info.mobileNumber)];
    contact.organizations = [new ContactOrganization('company', data.contact_info.company_name)];
    contact.emails = [new ContactField('email', data.contact_info.email)];
    contact.urls = [new ContactField('website', data.contact_info.website)];
    contact.addresses = [new ContactAddress(false, 'home', data.contact_info.address)];
    if(data.imageId){
      contact.photos = [new ContactField('photo', _base.API_URL + "/file/getImage?imageId=" + data.imageId._id)];
    }
    // contact.photos = [new ContactField(new URL(_base.API_URL+"/file/getImage?imageId="+data.image))];


    contact.save().then((contact) => {
      alert("contact saved");
    }, (err) => {
      alert("contact not saved");
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



  website(url) {
    window.open(url, "_system")
  }
}
