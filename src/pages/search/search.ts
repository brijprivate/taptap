import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild('slides') slides: Slides;

  public tapItems:any;
  public userId:any;
  public ifmerchant:boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loginsignupProvider:LoginsignupProvider,
    public loading:LoadingController,
    private toast: ToastController,
    public alert:AlertController,)
    {
      this.userId = localStorage.getItem("userId");
      if(this.userId){
        this. getAllTapItem();
      }
    }
  
  ionViewWillEnter(){
    console.log("wowowowowoowowowowowowoow");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  next() {
    this.slides.slideNext();
  }
  prev() {
    this.slides.slidePrev();
  }

   //get all tap items....
   getAllTapItem(){
    let _base  = this;
    this.loginsignupProvider.getTapAll(this.userId).then(function(success:any){
      console.log("All Tapped data ,..........>>>>>");
      // console.log(success.result.length);
      _base.tapItems = success.result;
      console.log(_base.tapItems);
    },function(err){
      console.log(err);
    })
  }

  //for merchant...
  merchant(){
   
    let _base = this;
    let loader = this.loading.create({
      content:"Please wait..."
    });
    loader.present();
    this.ifmerchant = true;
    // loader.dismiss();
    this.loginsignupProvider.getTapAll(this.userId).then(function(success:any){
      console.log("All Tapped data merchant,..........>>>>>");
      // console.log(success.result.length);
      _base.tapItems = success.result;
      loader.dismiss();
      console.log(_base.tapItems);
    },function(err){
      loader.dismiss();
      console.log(err);
    })
  }

  // for category...
  category(){
    this.ifmerchant = false;

  }
}
