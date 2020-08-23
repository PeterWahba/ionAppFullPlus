import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentAppTabsPage } from './tabs';

@NgModule({
  declarations: [
    AppointmentAppTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentAppTabsPage),
  ],
})
export class AppointmentAppTabsPageModule {}
