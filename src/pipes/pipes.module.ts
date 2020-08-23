import { NgModule } from '@angular/core';
import { SafePipe } from './safe/safe';
@NgModule({
	declarations: [SafePipe,
    SafePipe],
	imports: [],
	exports: [SafePipe,
    SafePipe]
})
export class PipesModule {}
