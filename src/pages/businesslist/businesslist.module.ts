import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinesslistPage } from './businesslist';

@NgModule({
  declarations: [
    BusinesslistPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinesslistPage),
  ],
})
export class BusinesslistPageModule {}
