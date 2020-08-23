import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { Categories } from '../categories/categories';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Questions {
    categoriesJson: Observable<any>;

    constructor(public http: Http, public categories: Categories) {
        this.categoriesJson = categories.getJson();
  }

    findAll() {
        let ret = this.categoriesJson;
        return ret;
  }

  findByCategory(id) {
      let ret = this.categories.getCategoryById(id).map(res => {
          return res? res.questions: [];
      });
      return ret;
  }
}


