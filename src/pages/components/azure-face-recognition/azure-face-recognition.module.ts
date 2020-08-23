import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AzureFaceRecognitionPage } from './azure-face-recognition';

@NgModule({
  declarations: [
    AzureFaceRecognitionPage,
  ],
  imports: [
    IonicPageModule.forChild(AzureFaceRecognitionPage),
  ],
})
export class AzureFaceRecognitionPageModule {}
