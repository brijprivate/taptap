import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimcardsPage } from './simcards';

@NgModule({
  declarations: [
    SimcardsPage,
  ],
  imports: [
    IonicPageModule.forChild(SimcardsPage),
  ],
})
export class SimcardsPageModule {}
