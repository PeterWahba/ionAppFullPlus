import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppntPage } from './appnt';
import { ShrinkHeaderModule } from "../../../../components/shrink-header/shrink-header.module";

@NgModule({
  declarations: [
    AppntPage,
  ],
  imports: [
    IonicPageModule.forChild(AppntPage),
    ShrinkHeaderModule
  ],
})
export class AppntPageModule {}
