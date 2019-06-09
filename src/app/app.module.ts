import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpProvider } from '../providers/http/http';
import { LoginsignupProvider } from '../providers/loginsignup/loginsignup';
import { SharedserviceProvider } from '../providers/sharedservice/sharedservice';
import { NfctagProvider } from '../providers/nfctag/nfctag';
import { Facebook } from '@ionic-native/facebook';
import { Network } from '@ionic-native/network';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { SocialSharing } from '@ionic-native/social-sharing';
import { GooglePlus } from '@ionic-native/google-plus';

// import { SavemilagePage } from '../pages/savemilage/savemilage';
// import { SaveTimePage } from '../pages/save-time/save-time';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
// import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // SavemilagePage,
    // SaveTimePage,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'bottom ',tabsHideOnSubPages: true}),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
    
  entryComponents: [  
    MyApp,
    HomePage,
    // SavemilagePage,
    // SaveTimePage,
   
  ],
  providers: [
    StatusBar,
    SharedserviceProvider,
    HttpProvider,
    SplashScreen,
    LocationAccuracy,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginsignupProvider,
    NfctagProvider,
    Facebook,
    GooglePlus,
    Network,
    NFC,
    Ndef,
    Crop,
    Camera,
    File,
    BackgroundGeolocation,
    NativeGeocoder,
    Deeplinks,
    SocialSharing,
    Contacts,
    // Diagnostic
  ]
})
export class AppModule {}
