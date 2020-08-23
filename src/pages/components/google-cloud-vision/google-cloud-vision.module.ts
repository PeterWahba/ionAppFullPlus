import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleCloudVisionPage } from './google-cloud-vision';

@NgModule({
  declarations: [
    GoogleCloudVisionPage,
  ],
  imports: [
    IonicPageModule.forChild(GoogleCloudVisionPage),
  ],
})
export class GoogleCloudVisionPageModule {}
