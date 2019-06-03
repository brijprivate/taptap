import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventdetailPage } from './eventdetail';

@NgModule({
  declarations: [
    EventdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EventdetailPage),
  ],
})
export class EventdetailPageModule {}
