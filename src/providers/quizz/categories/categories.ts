import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'
import * as _ from 'lodash';


@Injectable()
export class Categories {
        combined: { friends: any; customer: any; };
    constructor(public http: Http) {
    }

    findAll() {

        return this.getCategory();
  }

    findById(id) {
        return this.getCategoryById(id);
  }

    getCategoryById(id) {
        return this.getJson().map((res) => {
            let ret = _.find(res, (o) => o.id == id);
            return ret;
        })
    }

  getCategory() {
      var categories = this.getJson();
      return categories;
  }

  public getJson() {
      return Observable.forkJoin(this.http.get('assets/data/basic-bank-quiz.json').map((res) => res.json())
          ,this.http.get('assets/data/android.json').map((res) => res.json())
              ,this.http.get('assets/data/cplusplus.json').map((res) => res.json())
                  ,this.http.get('assets/data/css.json').map((res) => res.json())
                      ,this.http.get('assets/data/java.json').map((res) => res.json())
                          ,this.http.get('assets/data/nodejs.json').map((res) => res.json())
                              ,this.http.get('assets/data/php.json').map((res) => res.json())
                                  ,this.http.get('assets/data/python.json').map((res) => res.json())
                                  
      ).map((res: any) => {
          let ret = res[0].concat(res[1], res[2], res[3], res[4], res[5], res[6], res[7]);
          return ret;
      });
}
}


