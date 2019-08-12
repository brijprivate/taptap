import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';

/**
 * Generated class for the SimcardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-simcards',
  templateUrl: 'simcards.html',
})
export class SimcardsPage {

  public cards: any = []
  public countryCode = ""

  constructor(public renderer: Renderer, private toast: ToastController,
    private sim: Sim, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    let _base = this;
    _base.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);

    _base.loadSimCards()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SimcardsPage');
  }

  selectSimCard(card: any) {
    this.viewCtrl.dismiss(card);
  }

  loadSimCards() {
    let _base = this
    _base.requestForSimReadPermission()
      .then(function (sucess: any) {
        _base.getSimInformation()
          .then(function (sim: any) {
            console.log("Sim", sim)
            _base.cards = sim.cards.filter(function (sim) {
              console.log('outside')
              console.log('phone number', sim.phoneNumber)
              if (sim.phoneNumber != null || sim.phoneNumber != '' || sim.phoneNumber != undefined) {
                console.log('inside')
                return sim
              }
            });

            if (_base.cards.length != 0) {
              _base.countryCode = _base.cards[0].countryCode

            } else {
              _base.countryCode = sim.countryCode
              let showtoast = this.toast.create({
                message: "You do not have accessible sim cards. Please enter the phone number manually",
                duration: 60000,
                position: "bottom",
                showCloseButton: true,
                closeButtonText: "Ok"
              })
              showtoast.present();
              _base.dismiss()
            }

          }, function (error: any) {
            console.log("Error", error)
          })
      }, function (error: any) {

      })
  }

  requestForSimReadPermission() {
    let _base = this
    return new Promise(function (resolve, reject) {
      _base.sim.requestReadPermission().then(
        () => resolve({ permission: 'granted' }),
        () => reject({ permission: 'denied' })
      );
    })
  }

  getSimInformation() {
    let _base = this
    return new Promise(function (resolve, reject) {
      _base.sim.getSimInfo().then(
        (info) => resolve(info),
        (err) => reject(err)
      );
    })
  }

  dismiss() {
    this.viewCtrl.dismiss({ countryCode: this.countryCode });
  }

}
