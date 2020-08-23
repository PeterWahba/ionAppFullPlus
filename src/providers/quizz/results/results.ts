import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import PouchDB from 'pouchdb';
import * as _ from 'lodash';
import { userProvider } from '../user/userProvider';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class Results {
  uid: string;
  currentuser: any;
  _results: any;
  _db: any;
  whenUnblocked: any;
  constructor(public userprovider: userProvider, public afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    var win: any = window;
    this._db = win.cordova ? new PouchDB('results', { adapter: 'websql', location: 'default' }) : new PouchDB('results');
    this.whenUnblocked = this.getAll();
    this.getUser();
  }

  getUser() {
    this.afAuth.authState.subscribe(userAuth => {

      if (userAuth) {
        this.uid = userAuth.uid;

        this.db.object('/userProfile/' + this.uid).snapshotChanges()
          .map(c => ({ $key: c.payload.key, ...c.payload.val() }))
          .subscribe((profile: any) => {
            this.currentuser = profile;

          })

      } else {
        //redirect to login screen
      }

    });
  }



  add(result) {
    return this._db.post(result);
  }

  update(result) {
    return Observable.fromPromise(this._db.put(result));
  }

  delete(result) {
    return Observable.fromPromise(this._db.remove(result));
  }

  getByCategory(categoryId, userEmail) {
    let o = this._results? Observable.of(this._results): this.whenUnblocked;
    return o.map((data) => {
      return _.sortBy(_.filter(data, { category: categoryId, email: userEmail }), 'date')
    })
  }

  getHighScoreByCategory(categoryId, userEmail) {
    let o = this._results? Observable.of(this._results): this.whenUnblocked;
    return o.map((data) => {
      let ret = _.maxBy(_.filter(data, { category: categoryId, email: userEmail }), function (o) {
        return o.score;
      });
      return ret

    })
  }

  getTotalPointsByCategory(categoryId, userEmail) {
    let o = this._results? Observable.of(this._results): this.whenUnblocked;
    return o.map((data) => {
      let total = 0;
      let ret = _.filter(data, { category: categoryId, email: userEmail }).forEach((e, i) => {
        total += e.pts || 0;
      });
      return total;

    })
  }
  private saveTotalPointsToFirebase(data) {//data is all off the records stored by pouchDb, this is to be used internally (this class) only
    let total = this.getTotalPoints(data);
    window.localStorage.setItem('cached-total-poins', total.toString());
    this.userprovider.updateUserTotalPoints(total);
  }

  private getTotalPoints(data) {
    let userEmail = this.currentuser.email;
    let total = 0;
    let ret = _.filter(data, { email: userEmail }).forEach((e, i) => {
      total += e.pts || 0;
    });
    return total;


  }

  getAll() {
    let that = this;
    if (!that._results) {
      return Observable.fromPromise(that._db.allDocs({ include_docs: true })
        .then(docs => {
          // Each row has a .doc object, let's map the array to contain just the .doc objects.

          that._results = _.map(docs.rows, 'doc');

          // Listen for changes on the database.
          that._db.changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change) => {
              let index = that._findIndex(that._results, change.id);
              let result = that._results[index];

              if (change.deleted) {
                if (result) {
                  that._results.splice(index, 1); // delete
                }
              } else {
                if (result && result._id === change.id) {
                  that._results[index] = change.doc; // update
                } else {
                  that._results.splice(index, 0, change.doc) // insert
                }
              }

              //save the total to Firebase on any change in the local db
              that.saveTotalPointsToFirebase(that._results);
            });

          return that._results;
        }));
    } else {
      //save the total to Firebase 
      that.saveTotalPointsToFirebase(that._results);
      // Return cached data as a promise
      return Observable.of(that._results);
    }
  }

  _findIndex(array, id) {
    let low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  }

}