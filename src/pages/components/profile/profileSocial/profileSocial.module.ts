import { NgModule } from '@angular/core';
import { ProfileSocialPage } from './profileSocial';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      ProfileSocialPage,
  ],
  imports: [
      IonicPageModule.forChild(ProfileSocialPage),
  ],
  exports: [
      ProfileSocialPage
  ]
})
export class ProfileSocialPageModule {}
