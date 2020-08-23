import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { googleCloudVisionAPIKey } from "../../config/config";

@Injectable()
export class GoogleCloudVisionProvider {

  constructor(public http: Http) {
  }

  getLabels(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ]
        }
      ]
    }

    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + googleCloudVisionAPIKey, body);
  }

}
