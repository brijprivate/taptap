import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MilagelistPage } from './milagelist';

@NgModule({
  declarations: [
    MilagelistPage,
  ],
  imports: [
    IonicPageModule.forChild(MilagelistPage),
  ],
})
export class MilagelistPageModule {}
