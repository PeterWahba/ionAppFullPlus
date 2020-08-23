import { Injectable, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';
import { ToastController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";


@Injectable()
export class userProvider {
    currentuser: any;
    uid: string;
    user: any;
    users: any;
    _db: any;
    leaders: any;
    constructor(public http: Http, public af: AngularFireDatabase, private toastCtrl: ToastController, public googlePlus: GooglePlus, public push: Push
        , private afAuth: AngularFireAuth, private db: AngularFireDatabase) {

        this.afAuth.authState.subscribe(userAuth => {
            if (userAuth) {
                this.uid = userAuth.uid;
                this.db.object('/userProfile/' + this.uid).snapshotChanges()
                    .map(c => ({ $key: c.payload.key, ...c.payload.val() }))
                    .subscribe((profile: any) => {
                        var userFromStorage = window.localStorage.setItem('currentuser', JSON.stringify(profile));
                        this.currentuser = profile;
                    });
            }

        });

    }


    getUser(email: string) {
        let ref = this.af.database.ref('/userProfile');
        this.user = ref.orderByChild("email").equalTo('email')

        return this.user.first(); //Note: this prevent the subscribe for fire multiples time, it will forces to fire it just the first time, same effect as a promise
    }


    updateUserTotalPoints(points) {
        let key = this.uid;
        if (!!key && key != 'undefined')
            this.af.object('/userProfile/' + key).update({ score: points });
    }

    getLeadersForLeaderBoard() {
        let that = this;
        let ref = this.af.database.ref('/userProfile');
        this.users = ref.orderByChild('score').limitToLast(100);

        return this.users;
    }

    private presentToast(text: string, duration: number, position: string) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: duration,//millisecond
            position: position//'top/middle/bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
}
