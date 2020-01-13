import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RestaurantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-restaurant',
  templateUrl: 'restaurant.html',
})
export class RestaurantPage {
  xx: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
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
