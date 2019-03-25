import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfiledetailPage } from './profiledetail';

@NgModule({
  declarations: [
    ProfiledetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfiledetailPage),
  ],
})
export class ProfiledetailPageModule {}
