import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MerchantPage } from './merchant';

@NgModule({
  declarations: [
    MerchantPage,
  ],
  imports: [
    IonicPageModule.forChild(MerchantPage),
  ],
})
export class MerchantPageModule {}
