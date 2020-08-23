import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

@Injectable()
export class FirebaseStorageProvider {
  file: string = 'files';


  constructor(private db: AngularFireDatabase, private afStorage: AngularFireStorage) { }
  
   getFiles() {
     let ref = this.db.list(this.file);
  
     return ref.snapshotChanges().map(changes => {
       return changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }));
     });
   }
  
   uploadToStorage(img, ext): AngularFireUploadTask {
     let newName = `${new Date().getTime()}.${ext}`;
  
     return this.afStorage.ref(`${this.file}/${newName}`).putString(img, 'data_url');
   }
  
   storeInfoToDatabase(metainfo) {
     let toSave = {
       created: metainfo.timeCreated,
       url: metainfo.downloadURLs[0],
       fullPath: metainfo.fullPath,
       contentType: metainfo.contentType,
       uid: metainfo.uid
     }
     return this.db.list(this.file).push(toSave);
   }
  
  
   deleteFile(file) {
     let key = file.$key;
     let storagePath = file.fullPath;
  
     let ref = this.db.list(this.file);
  
     ref.remove(key);
     return this.afStorage.ref(storagePath).delete();
   }
 }
