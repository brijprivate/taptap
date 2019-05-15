import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TapdetailsPage } from './tapdetails';

@NgModule({
  declarations: [
    TapdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TapdetailsPage),
  ],
})
export class TapdetailsPageModule {}
