import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagedevicePage } from './managedevice';

@NgModule({
  declarations: [
    ManagedevicePage,
  ],
  imports: [
    IonicPageModule.forChild(ManagedevicePage),
  ],
})
export class ManagedevicePageModule {}
