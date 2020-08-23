import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CsvVisualizeExportPage } from './csv-visualize-export';

@NgModule({
  declarations: [
    CsvVisualizeExportPage,
  ],
  imports: [
    IonicPageModule.forChild(CsvVisualizeExportPage),
  ],
})
export class CsvVisualizeExportPageModule {}
