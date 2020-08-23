import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Categories } from "../../../../providers/quizz/categories/categories";

@IonicPage()
@Component({
    selector: 'page-archived',
    templateUrl: 'archived.html',
})
export class ArchivedPage {
    items: any;
    categories: any;
    archivedCategories: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public CategoriesService: Categories) {
      
    }
    undoArchive(id) {
        var array = this.archivedCategories;
        var index = array.indexOf(id);
        if (index > -1) {
            this.archivedCategories.splice(index, 1);
            window.localStorage.setItem('archivedCategories', JSON.stringify(this.archivedCategories));
            this.initializeItems();
        }
    }

    initializeItems() {
        let that = this;

        this.items = _.filter(this.categories.slice(), function (o) {
            return that.archivedCategories.indexOf(o.id) > -1;
        });
    }

    ionViewWillEnter() {
        let archivedCategoriesJson = window.localStorage.getItem('archivedCategories');
        this.archivedCategories = !!archivedCategoriesJson ? JSON.parse(archivedCategoriesJson) : [];//e.g: ["1","4","7"]
        this.CategoriesService.findAll().first().subscribe((res) => {
            this.categories = res;
            this.initializeItems();
        });
    }

}
