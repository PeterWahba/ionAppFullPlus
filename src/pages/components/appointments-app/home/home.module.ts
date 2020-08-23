import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentAppHomePage } from './home';
import { ShrinkHeaderModule } from "../../../../components/shrink-header/shrink-header.module";

@NgModule({
  declarations: [
    AppointmentAppHomePage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentAppHomePage),
    ShrinkHeaderModule
  ],
})
export class AppointmentAppHomePageModule {}
