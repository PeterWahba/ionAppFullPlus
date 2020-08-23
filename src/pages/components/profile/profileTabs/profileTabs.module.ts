import { NgModule } from '@angular/core';
import { ProfileTabsPage } from './profileTabs';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      ProfileTabsPage,
  ],
  imports: [
      IonicPageModule.forChild(ProfileTabsPage),
  ],
  exports: [
      ProfileTabsPage
  ]
})
export class ProfileTabsPageModule {}
