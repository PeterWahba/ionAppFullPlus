import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OcrPage } from './ocr';

@NgModule({
  declarations: [
    OcrPage,
  ],
  imports: [
    IonicPageModule.forChild(OcrPage)
  ],
})
export class OcrPageModule {}
