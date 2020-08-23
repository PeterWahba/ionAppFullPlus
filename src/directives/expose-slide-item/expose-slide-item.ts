import { Directive, ElementRef, Input } from '@angular/core';
import { Platform } from "ionic-angular";

/**
 * Generated class for the ExposeSlideItemDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
    selector: '[exposeSlideItem]', // Attribute selector
    host: {
        '[style.background-color]': '"yellow"',
    }
})
export class ExposeSlideItemDirective {
    @Input() exposeOnlyIf: boolean = true;
    @Input() showXtime: number = 0;
    counterVar: string = 'exposeSlideItem-counter'

    constructor(public el: ElementRef, public platform: Platform) {
        this.platform.ready().then(() => {
            setTimeout(() => {

                if (!this.exposeOnlyIf)
                    return;

                if (!this.shouldShow()) {
                    return;
                }

                let arrOfClasses = ['active-sliding', 'active-slide', 'active-options-right'];

                //uncover the slide item when all the vew is loaded, and put it back to original position afte 2 secondes
                el.nativeElement.className += ' active-sliding active-slide active-options-right';

                let ionItem = [].filter.call(el.nativeElement.childNodes, (function (e) {
                    return e.localName == 'ion-item'
                }));
                if (!ionItem || ionItem.length != 1) {
                    throw 'Only one ion-item can be defined';
                }
                //need the css class discover (theme/animation.scss)
                ionItem[0].className += " discover";

                setTimeout(() => {
                    el.nativeElement.className = this.removeClasses(el.nativeElement.className, arrOfClasses);
                    if (!!this.showXtime) {
                        this.incrementCounter();
                    }
                }, 3000)

            }, 900);
        });

    }

    private removeClasses(from, classesToRemove) {
        let arr = []
        if (!!from) {
            arr = from.split(' ');
            classesToRemove.forEach((e) => {
                if (arr.indexOf(e) > -1) {
                    arr.splice(arr.indexOf(e), 1);
                }
            });
        }
        return arr.join(' ');
    }

    private incrementCounter() {
        let counter: number = (<any>localStorage.getItem(this.counterVar)) * 1;
        counter++;
        localStorage.setItem(this.counterVar, counter.toString());
    }

    private shouldShow() {
        let counter: number = (<any>localStorage.getItem(this.counterVar)) * 1;
        if (this.showXtime > 0 && counter >= this.showXtime) {
            return false;
        }
        return true;
    }
}
