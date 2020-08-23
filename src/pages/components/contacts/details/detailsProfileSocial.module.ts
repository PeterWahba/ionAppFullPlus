import { NgModule } from '@angular/core';
import { DetailsProfileSocialPage } from './detailsProfileSocial';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      DetailsProfileSocialPage,
  ],
  imports: [
      IonicPageModule.forChild(DetailsProfileSocialPage),
  ],
  exports: [
      DetailsProfileSocialPage
  ]
})
export class DetailsProfileSocialPageModule {}
