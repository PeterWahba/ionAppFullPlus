import { AlertController, NavController, Platform, IonicPage, NavParams } from 'ionic-angular';
//import { Page} from 'ionic/ionic';
//import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Categories } from "../../../../providers/quizz/categories/categories";
import { Results } from "../../../../providers/quizz/results/results";
import { userProvider } from "../../../../providers/quizz/user/userProvider";
import { RateServiceProvider } from "../../../../providers/rate-service/rate-service";
import { AngularFireAuth } from "angularfire2/auth";


@IonicPage({
    name: 'QuizzHomePage',
    segment: 'quizz-home'
})
@Component({
    selector: 'page-quiz-home',
    templateUrl: 'home.html'
})
export class QuizzHomePage {
    test: any;
    favoriteCategories: any;
    archivedCategories: any;
    search: string;
    params: any;
    items: any[];
    name: string;
    currentuser: any;
    categories: any[];
    maxScore: Number;
    totalPts: number

    constructor(public nav: NavController, public ResultsService: Results, public rateService: RateServiceProvider, public Platform: Platform, public CategoriesService: Categories,
        private alertController: AlertController, public navParams: NavParams, public googlePlus: GooglePlus,
        public userprovider: userProvider, private afAuth: AngularFireAuth) {
        this.params = this.navParams ? this.navParams.data : {};
        this.categories = [];

        this.afAuth.authState.subscribe(userAuth => {
            if (!userAuth) {
                //redirect to login screen
                this.nav.setRoot('LoginPage');
            }
        });

    }

    getCurrentUserFromLocaStorage() {
        var userFromStorage = window.localStorage.getItem('currentuser');
        if (!!userFromStorage) {
            this.currentuser = JSON.parse(userFromStorage);
            return true;
        }
        return false;
    }

    chooseMode(id) {
        this.nav.push('ModePage', {
            id: id
        })
    }

    initializeItems() {
        let that = this;

        let filtered = _.filter(this.categories.slice(), function (o) {
            return that.archivedCategories.indexOf(o.id) == -1;
        });

        this.items = _.sortBy(filtered, [function (o) { return !o.isFavorite; }]);
    }

    getItems(ev: any) {
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the searchbar
        let val = this.search;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '' && this.items) {
            this.items = this.items.filter((item) => {
                if (!item) {
                    return false;
                }
                return (item.excerpt.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }


    getItemsBySearch() {
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the searchbar
        let val = this.params.filter;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '' && this.items) {
            this.items = this.items.filter((item) => {
                if (!item) {
                    return false;
                }
                //filter from push notification by name (the name should be unique) 
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }


    logout() {
        let that = this;


        let alert = this.alertController.create({
            title: 'Confirm logout',
            message: 'Do you want to stop learning?',
            buttons: [
                {
                    text: 'Go back',
                    role: 'cancel'
                },
                {
                    text: 'Stop learning',
                    handler: () => {
                        that.doLogout();
                    }
                }
            ]
        });
        alert.present();
    }

    doLogout() {
        let that = this;
        //make sure we delete all the user information keys from the localStorage
        window.localStorage.removeItem('currentuser');
        window.localStorage.removeItem('firebase-user-id');
        window.localStorage.removeItem('cached-total-poins');

        that.googlePlus.logout();
        that.googlePlus.disconnect();
        //this.auth.logout();
    }

    scoreColor(highScore) {
        if (highScore * 1 > 69) {
            return '#acd372';
        } else {
            return '#FF9800';
        }

    }

    archiveCategorie(category) {
        let that = this;
        let alertArch = this.alertController.create({
            title: 'Archive...',
            message: 'When you archive a category, it won\'t show in this list. You can restore it by going to the menu and selecting Archived categories. Are you sure you want to archive this categorie?',
            inputs: [
                {
                    name: 'dontshowagain',
                    type: 'checkbox',
                    label: 'Don\'t show it again',
                    value: 'true'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Continue',
                    handler: (dontShow) => {
                        //alert(JSON.stringify(data));
                        window.localStorage.setItem('dont-show-archive-categorie-popup', 'true');
                        that.doArchiveCategory(category.id)
                    }
                }
            ]
        });
        if (!!window.localStorage.getItem('dont-show-archive-categorie-popup')) {
            that.doArchiveCategory(category.id)
        } else {
            alertArch.present();
        }
    }

    addRemoveFavorite(category) {
        let catIndex = this.favoriteCategories.indexOf(category.id);
        if (catIndex > -1) {
            //remove
            this.favoriteCategories.splice(catIndex, 1);
            window.localStorage.setItem('favoriteCategories', JSON.stringify(this.favoriteCategories));
            category.isFavorite = false;
        } else {
            //add
            this.favoriteCategories.push(category.id)
            window.localStorage.setItem('favoriteCategories', JSON.stringify(this.favoriteCategories));
            category.isFavorite = true;
        }
        this.getItemsBySearch();
    }

    isFavorite(category) {
        return !!category.isFavorite ? 'star' : 'star-outline';
    }

    doArchiveCategory(id) {
        this.archivedCategories.push(id);
        window.localStorage.setItem('archivedCategories', JSON.stringify(this.archivedCategories));
        this.initializeItems();
    }

    ionViewWillEnter() {
        let archivedCategoriesJson = window.localStorage.getItem('archivedCategories');
        this.archivedCategories = !!archivedCategoriesJson ? JSON.parse(archivedCategoriesJson) : [];//e.g: ["1","4","7"]

        let favoriteCategoriesJson = window.localStorage.getItem('favoriteCategories');
        this.favoriteCategories = !!favoriteCategoriesJson ? JSON.parse(favoriteCategoriesJson) : [];//e.g: ["1","4","7"]

        this.getCurrentUserFromLocaStorage();

        this.search = "";
        let that = this;
        this.CategoriesService.findAll().first().subscribe((res) => {
            if (res) {
                that.categories = res;
                that.categories.forEach((e) => {
                    e.isFavorite = (that.favoriteCategories && that.favoriteCategories.indexOf(e.id) > -1) ? true : false;

                    that.ResultsService.getHighScoreByCategory(e.id, this.currentuser.email).subscribe((data) => {
                        if (data) {
                            e.highScore = Math.round(data.score / data.questions * 100);
                        }
                    });


                    //get total points by categories and user's email
                    that.ResultsService.getTotalPointsByCategory(e.id, this.currentuser.email).subscribe((data) => {
                        if (data) {
                            e.pts = data;
                        }
                    });
                });
            }

            that.initializeItems();
            that.getItemsBySearch();
        });

        //getAll forces to update the points in Firebase
        that.ResultsService.getAll().subscribe(() => {
            let cachedPts = parseInt(window.localStorage.getItem('cached-total-poins') || '0');
            that.totalPts = cachedPts;
        });
    }

}
