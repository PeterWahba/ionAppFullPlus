import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropperPhotoModalPage } from './cropper-photo-modal';

@NgModule({
  declarations: [
    CropperPhotoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CropperPhotoModalPage),
  ],
})
export class CropperPhotoModalPageModule {}
