import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PairdevicePage } from '../pages/pairdevice/pairdevice';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { HelpPage } from '../pages/help/help';
import { TaptapPage } from '../pages/taptap/taptap';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { ManagedevicePage } from '../pages/managedevice/managedevice';
import { RecordmilagePage } from '../pages/recordmilage/recordmilage';
import { SavemilagePage } from '../pages/savemilage/savemilage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PairdevicePage,
    DashboardPage,
    ProfilePage,
    SearchPage,
    TaptapPage,
    HelpPage,
    ManagedevicePage,
    RecordmilagePage,
    SavemilagePage 
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PairdevicePage,
    DashboardPage,
    ProfilePage,
    SearchPage,
    TaptapPage,
    HelpPage,
    ManagedevicePage,
    RecordmilagePage,
    SavemilagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
