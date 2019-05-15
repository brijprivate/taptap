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
// import { SavemilagePage } from '../pages/savemilage/savemilage';
// import { SaveTimePage } from '../pages/save-time/save-time';

@NgModule({
  declarations: [
    MyApp,
    // HomePage,
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
    // HomePage,
    // SavemilagePage,
    // SaveTimePage,
   
  ],
  providers: [
    StatusBar,
    SharedserviceProvider,
    HttpProvider,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginsignupProvider,
    NfctagProvider,
    Facebook,
    Network,
    NFC,
    Ndef
  ]
})
export class AppModule {}
