import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { NavController } from "ionic-angular";


@Injectable()
export class AuthGuard  {
    constructor(private auth: AuthService, private nav: NavController) { }
    ionViewCanEnter() {
        return this.auth.user
            .take(1)
            .map(user => !!user)
            .do(loggedIn => {
                if (!loggedIn) {
                    console.log('access denied')
                    this.nav.setRoot('LoginPage');
                }
            })
    }
}
