import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { suggestBookPopoverPage } from './suggest-book-popover';
import { PipesModule } from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    suggestBookPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(suggestBookPopoverPage),
    PipesModule
  ],
  exports: [
    suggestBookPopoverPage
  ]
})
export class SuggestBookPopoverPageModule {}
