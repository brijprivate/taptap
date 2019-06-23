import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActionlistPage } from './actionlist';

@NgModule({
  declarations: [
    ActionlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ActionlistPage),
  ],
})
export class ActionlistPageModule {}
