import { Injectable } from '@angular/core';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class FirestoreStorageProvider {
  db: firebase.firestore.Firestore;


  constructor(private afStorage: AngularFireStorage) {
    this.db = firebase.firestore();
  }

  getFiles(collection, uid) {
    // let ref = this.db.list(this.file);
    // return ref.snapshotChanges().map(changes => {
    //   return changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }));
    // });
    return this.db.collection(collection)
    .where('uid', '==', uid)
    .get();
  }

  uploadToStorage(storageRef, imgData, ext): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.${ext}`;

    return this.afStorage.ref(`${storageRef}/${newName}`).putString(imgData, 'data_url');
  }

  storeInfoToDatabase(collection, metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType,
      uid: metainfo.uid
    }
    return this.db.collection(collection).add(toSave)
    // return this.db.list(this.file).push(toSave);
  }


  deleteFile(collectionName, file) {
    let key = file.$key;
    let storagePath = file.fullPath;

    this.db
    .collection(collectionName)
    .doc(key)
    .delete();

    return this.afStorage.ref(storagePath).delete();
  }
}

