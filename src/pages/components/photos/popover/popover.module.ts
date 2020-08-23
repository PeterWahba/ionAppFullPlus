import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotosPopoverPage } from './popover';

@NgModule({
  declarations: [
      PhotosPopoverPage,
    ],
  imports: [
      IonicPageModule.forChild(PhotosPopoverPage)
  ],
  exports: [
      PhotosPopoverPage,
  ]
})
export class GalleryPopoverPageModule {}
