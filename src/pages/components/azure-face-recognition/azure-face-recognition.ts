import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { azureFaceRecognitionApi } from "../../../config/config";


@IonicPage()
@Component({
  selector: 'page-azure-face-recognition',
  templateUrl: 'azure-face-recognition.html',
})
export class AzureFaceRecognitionPage {
  image: any;
  loading: boolean;
  error: string;
  analysis: any[];

  AZURE_ENDPOINT: string = "https://eastus.api.cognitive.microsoft.com/face/v1.0";
  // Azure Face API key
  AZURE_API_KEY: string = azureFaceRecognitionApi;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let url = this.navParams.get('imgUrl');
    if (url) {
      this.analyzeFace(url.currentSrc);
    }
  }

  gotoGallery() {
    this.navCtrl.push('PhotosPage');
  }


  analyzeViaAzure(link: string, analysisCallback: Function = null, failureCallback: Function = null): void {
   
    // This is a subfunction that converts an object into a serialized URL format.
    // For instance, { 'foo': 'bar' } becomes 'foo=bar'
    let serialize = (parameters: object) => Object.keys(parameters).map(key => key + '=' + parameters[key]).join('&');

    // Tell the server that we are querying/looking for a specific set of face data,
    // and want it in the appropriate format.
    let faceParameters: object = {
      "returnFaceId": "true",
      "returnFaceLandmarks": "false",
      "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    }

    // We use the above function, serialize, to serialize our face parameters.
    let serializedFaceParameters: string = serialize(faceParameters);

    // Our body contains just one key, 'url', that contains our image link.
    // We must convert our body JSON into a string in order to POST it.
    let body = JSON.stringify({ "url": link });

    // Create a POST request with the serialized face parameters in our endpoint
    // Our API key is stored in the 'Ocp-Apim-Subscription-Key' header
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${this.AZURE_ENDPOINT}/detect?${serializedFaceParameters}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", this.AZURE_API_KEY);

    // Once the request is sent, we check to see if it's successful
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        // 200 is a successful status code, meaning it worked!
        if (xhr.status == 200) {
          // We can grab the link from our HTTP response and call it back
          if (analysisCallback != null) {
            analysisCallback(JSON.parse(xhr.response));
          }
        } else if (xhr.status >= 400 && failureCallback != null) {
          // If we receive a bad request error, we'll send our failure callback.
          failureCallback();
        }
      }
    }

    xhr.send(body);
  }

  // Populate the analysis array from a Face API response object
  analyzeFaceDetails(response: object): void {
    // Clear analysis array.
    this.analysis = [];

    // Retrieved face attributes object from response.
    let attributes = response[0]['faceAttributes'];

    // Convert two strings into a key-value pair for our
    // analysis list.
    let getAnalysisObject = (feature, value) => {
      return { "feature": feature, "value": value };
    }

    // Converts 'john' into 'John'
    let capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    //
    // ~ Analysis Time ~
    //

    // Get age
    this.analysis.push(getAnalysisObject("Age", attributes['age']));

    // Get age
    this.analysis.push(getAnalysisObject("Gender", capitalizeFirstLetter(attributes['gender'])));

    // Get smiling (person is smiling if value is over 0.5)
    this.analysis.push(getAnalysisObject("Smiling?", (attributes['smile'] > 0.5 ? "Yes" : "No")));
      
    // Get Glasses
    this.analysis.push(getAnalysisObject("Glasses", attributes['glasses']));

    // Get Blur level
    this.analysis.push(getAnalysisObject("Blur Level", attributes['blur']['blurLevel']));

    // Get Exposure level
    this.analysis.push(getAnalysisObject("Exp Level", attributes['exposure']['exposureLevel']));

    // Get Noise level
    this.analysis.push(getAnalysisObject("Noise Level", attributes['noise']['noiseLevel']));
    

    let makeup = attributes['makeup'];
    this.analysis.push(getAnalysisObject("Eye Makeup", makeup['eyeMakeup']? 'Yes': 'No'));
    this.analysis.push(getAnalysisObject("Lip Makeup", makeup['lipMakeup']? 'Yes': 'No'));



    // Check if bald, if so, output that.
    // If not, give the person's hair color.
    if (attributes['hair']['bald'] > 0.8) {
      this.analysis.push(getAnalysisObject("Is Bald?", "Yes"));
    } else if (attributes['hair']['hairColor'] && attributes['hair']['hairColor'].length > 0) {
      this.analysis.push(getAnalysisObject("Hair Color", capitalizeFirstLetter(attributes['hair']['hairColor'][0]['color'])));
    }

    // Get person's emotion by looping through emotion object and grabbing the greatest value
    let moods = attributes['emotion'];
    var greatestEmotion, greatestEmotionValue;
    for (var mood in moods) {
      if (moods[mood] && (!greatestEmotion || moods[mood] > greatestEmotionValue)) {
        greatestEmotion = mood;
        greatestEmotionValue = moods[mood];
      }
    }
    this.analysis.push(getAnalysisObject("Emotion", capitalizeFirstLetter(greatestEmotion)));

  }

  analyzeFace(link) {
    this.image = link;
    this.loading = true;
    this.analyzeViaAzure(link,//pass the image link 
      (response) => {
        this.loading = false;
        this.analyzeFaceDetails(response);
      },
      // If analysis didn't work
      () => {
        this.loading = false;
        this.error = "Error: Azure couldn't analyze the photo.";
      }
    )
  }


}
