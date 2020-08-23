import { NgModule } from '@angular/core';
import { ProfileCorporatePage } from './profileCorporate';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ProfileCorporatePage,
  ],
  imports: [
      IonicPageModule.forChild(ProfileCorporatePage),
  ],
  exports: [
    ProfileCorporatePage
  ]
})
export class ProfileprofileCorporatePageModule {}
