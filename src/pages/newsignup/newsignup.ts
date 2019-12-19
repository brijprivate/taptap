
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Slides, Platform } from 'ionic-angular';
// import { RegistrationProvider } from "../../providers/registration/registration";
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ElementsProvider } from '../../providers/elements/elements';
import { MenuController } from 'ionic-angular';
import * as moment from 'moment';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
declare var SMS: any;


/**
 * Generated class for the NewsignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsignup',
  templateUrl: 'newsignup.html',
})
export class NewsignupPage {


  public isChecked: boolean=false;
  public isDone:any;
  currentOTP: number;
  data: any = {};
  options: InAppBrowserOptions =
  {
    location: 'no',
    clearcache: 'yes',
    toolbar: 'no',
    closebuttoncaption: 'back',
    hardwareback:'no',
    zoom: "no"
  };


  @ViewChild(Slides) slides: Slides;

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }
  public name: string;
  public sexe: any;
  public number: any;
  public OTP: any;
  public inputOTP: any = {};
  public avatar: any;
  public range: any;
  public inputdate:string;
  public datestring="";
  userId: any;
  public registrationDetails: any;

  constructor
  (
    public menuCtrl: MenuController,
    public navCtrl:NavController,
    public platform: Platform,
    public elem: ElementRef,
    public ep: ElementsProvider,
    public api: LoginsignupProvider,
    private camera: Camera,
    public nav: NavController,
    // public theInAppBrowser:InAppBrowser,
    public navParams: NavParams,
    public androidPermissions: AndroidPermissions,
    public alertCtrl: AlertController
  )
  {
    this.menuCtrl.enable(false);

    /**Platform ready to start watching sms */
    this.platform.ready().then((readySource) =>
    {

      if (SMS) SMS.startWatch(() =>
      {
        console.log('watching started');

      },
     Error =>
      {
        console.log('failed to start watching');
      });
      
      /**add event listener to read sms */
      document.addEventListener('onSMSArrive', (e: any) =>
      {

        var sms = e.data;
        console.log(sms);
        if(sms.address == "IM-MECARE" ||sms.address == "HP-MECARE"||sms.address == "MM-MECARE" )
        {
          console.log(sms.body);
          var number =sms.body.match(/\d+/g).map(Number);
          console.log(number["0"]);
          var temp=number["0"].toString(10).split('');
          console.log(temp);
          for (var i=0,n=temp.length; i<n; i++)
          {
            console.log(temp[i]);
            this.inputOTP.fd =temp[0]
            this.inputOTP.sd =temp[1]
            this.inputOTP.td =temp[2]
            this.inputOTP.ld=temp[3]
          }
          this.nextform(3);

        }
        else
        {
          return;
        }

      });

    });

  }

  ionViewDidLoad()
  {
    this.slides.lockSwipes(true);

    /**CHECK PERMISSION FOR READ AND WATCH SMS */
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then
      (
        success => console.log('Permission granted'),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
      );

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }

 


  //To slide the form through index

  nextform(index)
  {

    let _base = this;
    this.slides.lockSwipes(false);

    if (index == 1)
    {
      if (this.name == undefined || this.name == ""||this.name.length<3 ||this.name.match(/[0-9]/i))
      {
        _base.ep.showAlert("Alert", "You must provide your full name");
        this.slides.lockSwipes(true);
        return;
      }

      // else if (this.sexe == undefined)
      // {
      //   _base.ep.showAlert("Alert", "You must provide your gender");
      //   this.slides.lockSwipes(true);
      //   return;

      // }

      else if (this.number == undefined || this.number.length!=10 || this.number == ""||this.number.match(/[a-zA-Z]/i))
      {
        _base.ep.showAlert("Alert", "You must provide a valid mobile number");
        _base.slides.lockSwipes(true);
        return;
      }

      
      this.slides.slideTo(index, 250);
      this.slides.lockSwipes(true);
    }
    else if (index == 2)
    {

      // if (this.number == undefined || this.number.length!=10 || this.number == ""||this.number.match(/[a-zA-Z]/i))
      // {
      //   _base.ep.showAlert("Alert", "You must provide a valid mobile number");
      //   _base.slides.lockSwipes(true);
      //   return;
      // }
      // else
      
        var today=Date.now();
        var date =moment(today).format('YYYY-MM-DD')
        console.log(date);
        console.log(this.event.month);
        if(this.event.month > date )
        {
          this.ep.showAlert('Alert', 'Please provide valid D.O.B');
          return;
        }
      
      console.log(this.isChecked);
      if(this.isChecked == false)
      {
        this.ep.showAlert('Alert',"Please accept Terms And Conditions");
        return;

      }
      
      /**API call for registering individual data */
      let regLoader = _base.ep.showLoader('registering', true);
      _base.ep.hideLoader(regLoader);
      _base.slides.slideTo(index, 250);

      _base.register().then
      (function (success: any)
        {
          if (success.error == false)
          {
            console.log(success);
            _base.registrationDetails = success.users;
            // _base.OTP = success.users.otp;
            _base.userId = success.users._id
            _base.slides.slideTo(index, 250);
            _base.slides.lockSwipes(true);
            _base.ep.hideLoader(regLoader);
            // _base.ep.showAlert("OTP", "Your OTP is " + _base.OTP);
          }
          else
          {
            console.log("Error registering user");
            _base.ep.hideLoader(regLoader);
            _base.ep.showAlert("Error", "Error registering");
            _base.slides.lockSwipes(true);
          }
        },
        function (error)
        {
          console.log(error._body);
          if (error._body.length != null)
          {
            _base.ep.hideLoader(regLoader);
            _base.ep.showAlert("Error", "PhoneNumber already registered, Please sign in to continue!!!");
            _base.slides.lockSwipes(true);
            return;
          }
          else
          {
            _base.ep.hideLoader(regLoader);
            _base.ep.showAlert("Error", "Http request not found!!!");
            _base.slides.lockSwipes(true);
          }
        });
    }
    else if (index == 3)
    {
      console.log(this.inputOTP);
      let _base = this;
      _base.currentOTP = parseInt(_base.inputOTP.fd + _base.inputOTP.sd + _base.inputOTP.td + _base.inputOTP.ld);
      if (this.currentOTP.toString().length < 4)
      {
        _base.ep.showAlert("Warning", "Put a 4 digit OTP");
        return;
      }

      let verifyLoader = _base.ep.showLoader('Verifying', true);

      let otpdata = {
        contact: _base.number,
        country_code: '+91',
        code:_base.currentOTP
      }


      _base.slides.slideTo(index, 250);


      
      _base.api.verifyotp(otpdata)
        .then(function (otpData: any)
        {
          if (otpData.error == false)
          {
            console.log("inside false");
            console.log(_base.registrationDetails._id);
            //Store the Registration_id during Registration
            localStorage.setItem("user_id", _base.registrationDetails._id);
            // detect if app or web view
            if (_base.platform.is('core') || _base.platform.is('mobileweb') || _base.platform.is('android') || _base.platform.is('ios'))
            {
              _base.ep.hideLoader(verifyLoader);
              var data =
              {
                userId: _base.userId,
                name: _base.name,
                gender: _base.sexe,
                phoneNumber: _base.number,
                dob: _base.event.month
              }

              console.log(data);
              let history = _base.ep.showLoader("Requesting profile...", true);

              /**api call to create individual profile */
              _base.api.individualprofile(data)
              .then(function (success: any)
              {
                if (success.error == false)
                {
                  console.log(success);
                  _base.inputdate=success.profileDetails.dob
                  _base.datestring =_base.formatDate(_base.inputdate);
                  console.log( _base.datestring);
                  _base.ep.hideLoader(history);

                  /**sets to dashboard page after completing profile */
                  _base.nav.setRoot('DashboardPage', { profile_id: success.profileDetails._id });
                  _base.ep.showAlert("Success", "Individual Profile added successfully");
                  console.log(success.profileDetails._id);
                  //To store the profile_id of the user
                  localStorage.setItem("Profile_id", success.profileDetails._id);

                }
                else
                {
                  _base.ep.hideLoader(history);
                  console.log("Error getting data");
                  _base.nav.setRoot('DashboardPage');
                  _base.ep.showAlert("Error", "Error in getting data");
                }
              },
                function (errorData)
                {
                  _base.ep.hideLoader(history);
                  console.log(errorData);
                  _base.nav.setRoot('DashboardPage');
                  _base.ep.showAlert("Error", "Error getting api");
                });

            }
            else
            {
              console.log("inside else slide");

              _base.slides.slideTo(index, 250);
              _base.slides.lockSwipes(true);
              _base.ep.hideLoader(verifyLoader);
            }
          }
          else
          {
            console.log("inside true");

            console.log("Error verifying OTP");
            _base.ep.hideLoader(verifyLoader);
            _base.ep.showAlert("Error", "Error Verifying");
          }
        },
        function (errorOtpData)
        {
          console.log(errorOtpData);
          _base.ep.hideLoader(verifyLoader);
          _base.ep.showAlert("Error", "Error Verifying");
        }
      );
    }

  }
  //To register the user
  register()
  {
    let _base = this;
    // registration data  - data required for initial registration
    let registerData =
      {
        'phoneNumber': this.number,
        'role': 'individual'
      };
    return new Promise(function (resolve, reject)
    {
      _base.api.register(registerData)
        .then(function (success)
        {
          resolve(success);
        },
        function (error)
        {
          reject(error);
        });
    });
  }

  // take a picture from camera
  takePicture()
  {
    let _base = this;
    let options: CameraOptions =
      {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA  // to access camera
      }

     /**use camera to take picture */
    _base.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      _base.avatar = base64Image;
      this.slides.lockSwipes(false);
      this.slides.slideTo(4, 250);
      this.slides.lockSwipes(true);
    },
      (err) =>
      {
        // Handle error
        console.log(err);
      });
  }

  // access gallery to select one picture
  accessGallery()
  {
    let _base = this;
    let options: CameraOptions =
      {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY // to access photo gallery
      }
    _base.camera.getPicture(options).then((imageData) =>
    {
      let imageLoader = _base.ep.showLoader('rendering image', true);

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(imageData);
      console.log(base64Image);
      _base.avatar = base64Image;
      this.slides.lockSwipes(false);
      this.slides.slideTo(4, 250);
      this.slides.lockSwipes(true);
      _base.ep.hideLoader(imageLoader);
    },
    (err) =>
    {
        // Handle error
        console.log(err);
    });
  }

  // tack back to the edit number
  editNumber()
  {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1, 250);
    this.slides.lockSwipes(true);
  }

  executeOTPSequence()
  {
    let firstInput = (<HTMLInputElement>document.getElementById("otp_fd"));
    let secondInput = (<HTMLInputElement>document.getElementById("otp_sd"));
    // let thirdInput = (<HTMLInputElement>document.getElementById("otp_td"));
    // let lastInput = (<HTMLInputElement>document.getElementById("otp_ld"));
    firstInput.addEventListener
    ("keyup", function ()
    {
      secondInput.click();
    }, false
    );
    secondInput.addEventListener
    ("keyup", function ()
    {
      // secondInput.click();
      console.log("abc");
    }, false);
  }

  next(el)
  {
    el.setFocus();
  }

  /**function call to det date in format mm-dda-yyyy */
  formatDate (input)
  {
    var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[1], day = datePart[2];

    return day+'-'+month+'-'+year;
  }

  /**function call to resend otp */
  resendOtp(){
    this.api.resendOtp(this.number)
    .then((success)=>{
    // console.log(success);
    },error=>{
    // console.log(error);
    });
  }


  ionViewWilLeave()
  {
    if((typeof(SMS)!== "undefined")) SMS.stopWatch(() =>
    {
      console.log('watching stopped');

    },
   Error =>
    {
      console.log('failed to stop watching');
    });


  }

  /**To open terms and condition through in appbrowser */

  openTandC()
  {

  var url='http://meme.care/termscondition.html';


  // const browser = this.theInAppBrowser.create(url, '_self', this.options);

  }

  //To check the terms And Conditions

  checkTermsAndConditions(e)
  {
    this.isChecked =e.checked;
    if( this.isChecked== false)
    {
      this.ep.showAlert('Alert',"Please accept Terms And Conditions");
      return;
    }
  }
  
  

}
//dummy code
  // dashboard() {
  //   let _base=this;
  //   this.data = {
  //     userId: this.userId,
  //     name: this.name,
  //     sex: this.sexe,
  //     phoneNumber: this.number,
  //     dob:this.event.month

  //   }
  //   console.log(this.data);


  //       _base.api.individualprofile(this.data).then(function (success: any) {
  //         if (success.error == false) {
  //           console.log(success);
  //           _base.nav.setRoot(DashboardPage);
  //           _base.ep.showAlert("Success", "Individual Profile added successfully");

  //           console.log(success.profileDetails._id);
  //           localStorage.setItem("Profile_id", success.profileDetails._id);

  //         }
  //         else{
  //           _base.nav.setRoot(DashboardPage);
  //           console.log("Error getting data");

  //           _base.ep.showAlert("Error", "Error in getting data");

  //         }
  //       },
  //         function (errorData) {
  //           console.log(errorData);
  //           _base.nav.setRoot(DashboardPage);


  //           _base.ep.showAlert("Error", "Error getting api");
  //         });



  // }
  

  // browser.on("exit")
  // .subscribe(
  // () =>
  // {
  //   let _base = this;

  //   _base.navCtrl.pop();
  // },
  // err =>
  // {
  //   console.log("InAppBrowser loadstart Event Error: " + err);
  // });
   // ionViewWillEnter()
  // {

  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then
  //   (
  //     success => console.log('Permission granted'),
  //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
  //   );

  //   this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  // }
   // ReadListSMS()
  // {

  //   this.platform.ready().then((readySource) =>
  //   {

  //     let filter =
  //     {
  //       box: 'inbox', // 'inbox' (default), 'sent', 'draft'
  //       indexFrom: 0, // start from index 0
  //       maxCount: 1, // count of SMS to return each time
  //     };

  //     if (SMS) SMS.listSMS(filter, (ListSms) =>
  //     {
  //       console.log("Sms", ListSms);



  //     },

  //       Error =>
  //       {
  //         console.log('error list sms: ' + Error);
  //       });

  //   });
  // }




