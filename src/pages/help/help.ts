import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  diseases = [
    { title: "What is TapTap?", description: "A mobile application that allows users to tap items with their NFC enabled devices to access information about products and services." },
    { title: "What is NFC?", description: "Near field communication (NFC) is a short-distance wireless data transmission between two devices, like Bluetooth." },
    { title: "How do I know if my phone is compatible with TapTap?", description: "Android: 4 out of 5 smart android phones are NFC enabled. Almost all android smart devices from 2011 are NFC enabled. Apple: iphone 7 and above running at least iOS 11 are NFC enabled. If in doubt, go to the play store or app store, search for TapTap and it will let users know whether the smart service is compactible." },
    { title: "What is TapTap Device?", description: "This is a special NFC encoded device which is used to activate ‘Record Time’ and ‘Record Mileage’ in the TapTap app. It can also be used as a business contact card and even a form of identity in TapTap enabled shops. There are currently two TapTap devices available; TapTap gold Keyring and TapTap Card." },
    { title: "What is TapTap Pairing Code?", description: "A TapTap device comes with a pairing code which is used to activate the TapTap device within the app. After the TapTap device is paired, it becomes a form of a passport which can authenticate users anywhere there is a TapTap admin. Example: Hotels, car parks, clubs, etc." }
  ];
  public shownGroup = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } 
    else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };

  back() {
    this.navCtrl.pop();
  }
}
