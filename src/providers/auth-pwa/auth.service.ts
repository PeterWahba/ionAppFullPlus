import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { DatabaseProvider } from '../database/database';

interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    phone?: string;
}

@Injectable()
export class AuthService {
    successEmailSent: boolean = false;
    errorMsg: any;
    user: Observable<User>;
    showUnauthorizedAlert: boolean = false;
    constructor(private afAuth: AngularFireAuth, private db: DatabaseProvider) {
        this.authState();
    }

    authState() {
        //// Get auth data, then get firestore user document || null
        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    //const data: User = {
                    //    uid: user.uid,
                    //    email: user.email,
                    //    displayName: user.displayName,
                    //    photoURL: user.photoURL
                    //}
                    return Observable.fromPromise(this.db.getDocumentsByName('users', user.uid))
                    //doc<User>(`users/${user.uid}`).valueChanges()
                } else {
                    return Observable.of(null)
                }
            });
    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    private oAuthLogin(provider) {
        let that = this;
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                that.db.getDocumentsByName('users', credential.user.uid).then((u) => {
                    if (!u || credential.user.uid != u.uid) {
                        that.showUnauthorizedAlert = true;
                        that.signOut();
                    }
                });
            });
    }


    registerUserWithGoogle(callback = null) {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {

                this.db.getDocumentsByName('users', credential.user.uid).then((e) => {
                    if (!e) {//if user doesn't exist then create it
                        this.createUserData(credential.user).then((q) => {
                            if (typeof callback == 'function') {
                                callback();
                            } else {
                                window.location.reload();
                            }
                        });
                    } else {
                        const data: User = {
                            uid: credential.user.uid,
                            email: credential.user.email,
                            displayName: credential.user.displayName,
                            photoURL: credential.user.photoURL || ''
                        }
                        this.db.updateDocument('users', credential.user.uid, data).then(() => {
                            if (typeof callback == 'function') {
                                callback();
                            }
                        });
                    }
                });

            })
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

    signOut() {
        return this.afAuth.auth.signOut().then(() => {
            //this.nav.setRoot('LoginPage');
        });
    }



    loginWithEmailAndPass(email, pass) {
        //let that = this;
        return this.afAuth.auth.signInWithEmailAndPassword(email, pass);
        //.then((credential) => {
        //     that.db.getDocumentsByName('users', credential.uid).then((u) => {
        //         if (!u || credential.uid != u.uid) {
        //             that.showUnauthorizedAlert = true;
        //             that.signOut();
        //         }
        //     });
        // }).catch((e) => {
        //     this.errorMsg = e.message;
        //     this.showUnauthorizedAlert = true;
        // });
    }

    registerWithEmailAndPass(name: string, email: string, pass: string, phone: number, pic: string, success, error): Promise<any> {

        return this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then((newUser) => {

            this.createUserData({
                email: email,
                displayName: name,
                photoURL: pic || '',
                uid: newUser.user.uid,
                phone: phone
            }, true).then((x) => {
                //window.location.reload();
                if (typeof success == 'function') {
                    success();
                }
            });
        }).catch((e) => {
            if (typeof error == 'function') {
                error(e);
            }
            this.errorMsg = e.message;
            this.showUnauthorizedAlert = true;
        });
    }

    resetPassword(email: string): Promise<any> {
        return this.afAuth.auth.sendPasswordResetEmail(email).catch((e) => {
            this.errorMsg = e.message;
        }).then((x) => {
            this.successEmailSent = true;
        });
    }
}
