import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoCropperPage } from './photo-cropper';
import { AngularCropperjsModule } from 'angular-cropperjs';

@NgModule({
  declarations: [
    PhotoCropperPage
  ],
  imports: [
    IonicPageModule.forChild(PhotoCropperPage),
    AngularCropperjsModule
  ],
})
export class PhotoCropperPageModule {}
