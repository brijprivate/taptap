import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LostcardPage } from './lostcard';

@NgModule({
  declarations: [
    LostcardPage,
  ],
  imports: [
    IonicPageModule.forChild(LostcardPage),
  ],
})
export class LostcardPageModule {}
