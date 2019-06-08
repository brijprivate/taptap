import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Item } from 'ionic-angular';
import { NfctagProvider } from '../../providers/nfctag/nfctag';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SharedserviceProvider } from '../../providers/sharedservice/sharedservice';
import { Contacts, Contact, ContactField, ContactName, ContactOrganization, ContactAddress } from '@ionic-native/contacts';

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
  public thisMonth: any;
  public userId: any;
  public uRLlink = "https://taptapshare.000webhostapp.com/?category=";
  public link: any;
  isfav: boolean = false;
  public linkId: any;
  xx: any;

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

    console.log("item details----", this.eventdata);

    //shared service to get link data...
    this.sharedservice.getlinkid().subscribe((value) => {
      console.log("network status------------------>>>>>>", value);
      this.linkId = value;
      console.log("link id----------" + this.linkId);
    });
    if (this.linkId) {
      console.log("in condition");
      this.getById(this.linkId);
    }
    this.eventdata = navParams.get("itemdetails");

    if (this.eventdata.eventId) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.thisMonth = monthNames[(new Date()).getMonth()];
      console.log(this.thisMonth);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TapdetailsPage');
  }
  ionViewDidEnter() {
    this.eventdata = this.navParams.get("itemdetails");
    console.log("item details----", this.eventdata);

    if (this.eventdata.eventId) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.thisMonth = monthNames[(new Date()).getMonth()];
      console.log(this.thisMonth);
    }
  }

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
      _base.updateProduct(item);
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
  //update product....
  updateProduct(favdata) {
    // let loader = this.loading.create({
    //   content:"Please wait..."
    // });
    // loader.present();
    console.log("calling update");
    let updatedata = {
      tappId: favdata._id,
      is_favourite: true
    }
    console.log(updatedata);
    this.nfctagPro.favUpdate(updatedata).then(function (success: any) {
      console.log(success);
      // loader.dismiss();

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
    var contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, null, data.name);
    contact.phoneNumbers = [new ContactField('mobile', data.telephoneNumber)];
    contact.organizations = [new ContactOrganization('company', data.company)];
    contact.addresses = [new ContactAddress(null, data.company)];
    contact.emails = [new ContactField('email', data.email)];
    contact.urls = [new ContactField('website', data.link)];

    contact.save().then((contact) => {
      alert("contact saved");
    }, (err) => {
      alert("contact not saved");
    })
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
}
