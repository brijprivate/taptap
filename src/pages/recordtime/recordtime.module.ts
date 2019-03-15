import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecordtimePage } from './recordtime';

@NgModule({
  declarations: [
    RecordtimePage,
  ],
  imports: [
    IonicPageModule.forChild(RecordtimePage),
  ],
})
export class RecordtimePageModule {}
