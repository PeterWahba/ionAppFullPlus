import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Game2048Page } from './game2048';

@NgModule({
  declarations: [
    Game2048Page,
  ],
  imports: [
    IonicPageModule.forChild(Game2048Page),
  ],
})
export class Game2048PageModule {}
