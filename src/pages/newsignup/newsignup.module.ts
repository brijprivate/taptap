import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsignupPage } from './newsignup';

@NgModule({
  declarations: [
    NewsignupPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsignupPage),
  ],
})
export class NewsignupPageModule {}
