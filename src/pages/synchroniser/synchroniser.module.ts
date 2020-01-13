import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SynchroniserPage } from './synchroniser';

@NgModule({
  declarations: [
    SynchroniserPage,
  ],
  imports: [
    IonicPageModule.forChild(SynchroniserPage),
  ],
})
export class SynchroniserPageModule {}
