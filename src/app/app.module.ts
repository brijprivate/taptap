import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
// import { SavemilagePage } from '../pages/savemilage/savemilage';
// import { SaveTimePage } from '../pages/save-time/save-time';

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
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
