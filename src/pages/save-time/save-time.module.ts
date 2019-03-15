import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaveTimePage } from './save-time';

@NgModule({
  declarations: [
    SaveTimePage,
  ],
  imports: [
    IonicPageModule.forChild(SaveTimePage),
  ],
})
export class SaveTimePageModule {}
