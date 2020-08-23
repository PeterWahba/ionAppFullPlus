import { NgModule } from '@angular/core';
import { ProfileGalleryPage } from './profileGallery';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ProfileGalleryPage,
  ],
  imports: [
      IonicPageModule.forChild(ProfileGalleryPage),
  ],
  exports: [
      ProfileGalleryPage
  ]
})
export class ProfileGalleryPageModule {}
