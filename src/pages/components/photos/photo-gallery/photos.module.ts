import { NgModule } from '@angular/core';
import { PhotosPage } from './photos';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        PhotosPage
  ],
    imports: [
        IonicPageModule.forChild(PhotosPage),
  ],
    exports: [
        PhotosPage
  ]
})
export class GalleryPageModule {}
