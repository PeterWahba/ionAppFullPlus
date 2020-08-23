import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoFilterPage } from './photo-filter';
import 'web-photo-filter';

@NgModule({
  declarations: [
    PhotoFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotoFilterPage),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PhotoFilterPageModule {}
