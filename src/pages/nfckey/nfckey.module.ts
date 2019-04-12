import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NfckeyPage } from './nfckey';

@NgModule({
  declarations: [
    NfckeyPage,
  ],
  imports: [
    IonicPageModule.forChild(NfckeyPage),
  ],
})
export class NfckeyPageModule {}
