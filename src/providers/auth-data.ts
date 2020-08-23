import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { DatabaseProvider } from './database/database';

interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    phone?: string;
}

@Injectable()
export class AuthData {
    constructor(public afAuth: AngularFireAuth, private db: DatabaseProvider) {
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail,newPassword)
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
  
    registerUser(name: string, email: string, password: string, phone: number, pic: string, success=null, error=null): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((newUser:any) => {
      firebase.database().ref('/userProfile').child(newUser.uid).set({//register/save data with realtime firebase database (regular login)
          email: email,
          name: name,
          pic: pic,
          phone: phone
        });

        this.createUserData({//register/save data with firestore database (PWA login)
            email: email,
            displayName: name,
            photoURL: pic || '',
            uid: newUser.uid,
            phone: phone
        }, true).then((x) => {
            //window.location.reload();
            if (typeof success == 'function') {
                success();
            }
        });


    });
    }


    private createUserData(user, withPhone = false) {
        // Sets user data to firestore on login
        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL || ''
        }
        if (withPhone) {
            data.phone = user.phone || '';
        }

        return this.db.addDocumentByName('users', user.uid, data);
    }

}

