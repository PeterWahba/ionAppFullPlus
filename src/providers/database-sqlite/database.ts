import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class SqliteDatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
 
  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'scaned.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              //this.fillDatabase();//remove this
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }
 
  fillDatabase() {
    this.http.get('assets/table.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  addScanned(content, datetime) {
    return new Promise((resolve, reject)=>{
    this.platform.ready().then(() => {
      
      let data = [content, datetime]
      this.database.executeSql("INSERT INTO scanned (content, datetime) VALUES (?, ?)", data).then(data => {
        resolve(data);
      }, err => {
        console.log('Error: ', err);
        reject(err);
      });
    });
  });
  }

  removeScanned(id) {
    let ids = [id];
    return this.database.executeSql("delete from scanned where id=?", ids).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }
 
  getAllScanneds() {
    return this.database.executeSql("SELECT id,content, datetime FROM scanned order by id desc", []).then((data) => {
      let scanneds = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          scanneds.push({ content: data.rows.item(i).content, id: data.rows.item(i).id, datetime: data.rows.item(i).datetime });
        }
      }
      return scanneds;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
 
  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

 
}