import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { userProvider } from "../../../../providers/quizz/user/userProvider";


@IonicPage()
@Component({
    selector: 'page-leaderboard',
    templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
    leadersFiltered: any;
    search: string;
    leaders: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public userprovider: userProvider) {
        let that = this;

        userprovider.getLeadersForLeaderBoard().once('value').then((snapshot) => {
            
            let val = snapshot.val()
            let arr = Object.keys(val).map(function(key) {
              return val[key];
            });

            if (!!arr && arr.length > 0) {
                that.leaders = arr;//_.reverse(arr);
                that.leadersFiltered = that.leaders.slice();
            }
        });

    }

    getItems(ev: any) {
        // Reset items back to all of the items
        this.leadersFiltered = this.leaders.slice();

        // set val to the value of the searchbar
        let val = this.search;


        // if the value is an empty string don't filter the items
        if (val && val.trim() != '' && this.leaders) {
            this.leadersFiltered = this.leadersFiltered.filter((item) => {
                if (!item) {
                    return false;
                }
                return (item.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }


}
