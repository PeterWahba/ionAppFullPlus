import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, Platform } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { Storage } from '@ionic/storage';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

const MEDIA_FILES_KEY = 'mediaFiles';

@IonicPage()
@Component({
  selector: 'page-media-player',
  templateUrl: 'media-player.html',
})
export class MediaPlayerPage {
  audioWave: boolean = false;
  fileName: string;
  audio: MediaObject;
  mediaFiles = [];
  openModal = false;
  @ViewChild('myvideo') myVideo: any;

  constructor(public navCtrl: NavController, private mediaCapture: MediaCapture, private storage: Storage, private file: File, private media: Media,
    private platform: Platform) { }

  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }

  stopRecordingAudio() {
    this.audio.stopRecord();
    this.storeMediaFiles([{ name: this.fileName, size: 'unknown' }]);
    this.audioWave = false;
   
    this.audio.onError.subscribe((e) => {
      console.log(e);
      alert('error');
    });
  }

  captureAudio() {
    this.audioWave = true;
    this.platform.ready().then(() => {

      let d = new Date();
      this.fileName = `audio_${d.getTime()}`;
      let path = '';

      if (!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.fileName = this.fileName + '.m4a'
        path = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      }
      else if (this.platform.is('android')) {
        this.fileName = this.fileName + '.3gp'
        path = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      }
      else {
        // future usage for more platform support
        return false;
      }

      this.audio = this.media.create(path);
      this.audio.startRecord();

    });

  }

  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
      var toDirectory = this.file.externalDataDirectory;

      this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then((res) => {
        this.storeMediaFiles([{ name: fileName, size: capturedFile.size }]);
      }, err => {
        console.log('err: ', err);
      });
    },
      (err: CaptureError) => console.error(err));
  }

  play(myFile) {
    this.openModal = true;
    let path = this.file.externalDataDirectory + myFile.name;
    let url = path.replace(/^file:\/\//, '');

    setTimeout(function () {
      let video: any = document.getElementById('myvideo');
      video.src = url;
      video.play();

    }, 900);
  }

  storeMediaFiles(files) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
      }
      this.mediaFiles = this.mediaFiles.concat(files);
    })
  }

  deleteMediaFiles(fileTodelete) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        this.file.removeFile(this.file.externalDataDirectory, fileTodelete.name).then(() => {
          let arr = JSON.parse(res);
          let index = 0;
          arr.forEach((e, i) => {
            if (e.name == fileTodelete.name) {
              index = i;
              return;
            }
          });

          arr.splice(index, 1);
          this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
          this.mediaFiles = arr;
        }).catch((err)=>{
          console.log(err);
          alert("Error removing file");
        })
      }
    })
  }
}