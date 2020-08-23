import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CsvIntroMenuPage } from './csv-intro-menu';

@NgModule({
  declarations: [
    CsvIntroMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(CsvIntroMenuPage),
  ],
})
export class CsvIntroMenuPageModule {}
