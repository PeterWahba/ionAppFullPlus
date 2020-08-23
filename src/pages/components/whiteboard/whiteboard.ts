import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, Content, Platform, ActionSheetController, ToastController } from 'ionic-angular';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Camera } from "@ionic-native/camera";

const STORAGE_KEY = 'IMAGE_LIST';

@IonicPage()
@Component({
  selector: 'page-whiteboard',
  templateUrl: 'whiteboard.html',
})
export class WhiteboardPage {
  brushSize: any;
  directory: string;
  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;

  storedImages = [];

  // Make Canvas sticky at the top stuff
  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;
  @ViewChild('bottomToolbar') bottomToolbar: any;

  // Color Stuff
  selectedColor = '#9e2956';

  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3'];

  constructor(public navCtrl: NavController, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform
    , private camera: Camera, private actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController) {

    //check the platform to store in the right local file path
    if (this.plt.is('ios')) {
      this.directory = this.file.documentsDirectory;
    }
    else if (this.plt.is('android')) {
      this.directory = this.file.externalDataDirectory;
    }


  }

  ionViewDidEnter() {
    // Load all stored images when the app is ready
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != undefined) {
          this.storedImages = data;
        }
      });
    });

    // https://github.com/ionic-team/ionic/issues/9071#issuecomment-362920591
    // Get the height of the fixed item
    let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    let scroll = this.content.getScrollElement();

    // Add preexisting scroll margin to fixed container size
    itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
    scroll.style.marginTop = itemHeight + 'px';
  }

  ionViewDidLoad() {
    // Set the Canvas Element and its size
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = (this.plt.height() - 200) + '';

  }

  changeSize(size) {
    this.brushSize = size;
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  startDrawing(ev) {
    if (!this.canvasElement) {
      return;
    }

    var canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    if (!this.canvasElement) {
      return;
    }

    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX - canvasPosition.x;
    let currentY = ev.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = this.brushSize;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  clearCanvas() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
  }


  //save methods
  saveCanvasImage() {
    var dataUrl = this.canvasElement.toDataURL();

    this.clearCanvas(); // Clears the canvas

    let name = new Date().getTime() + '.png';
    let path = this.directory;
    let options: IWriteOptions = { replace: true };

    var data = dataUrl.split(',')[1];
    let blob = this.b64toBlob(data, 'image/png');

    this.file.writeFile(path, name, blob, options).then(res => {
      this.storeImage(name).then(() => {
        this.navCtrl.push('WhiteboardSavedPage');
      });

    }, err => {
      console.log('error: ', err);
    });
  }

  // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  storeImage(imageName) {
    let saveObj = { img: imageName };
    this.storedImages.unshift(saveObj);
    return this.storage.set(STORAGE_KEY, this.storedImages)
    /*.then(() => {
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 500);
    });*/
  }

  gotoImgs() {
    this.navCtrl.push('WhiteboardSavedPage');
  }

  loadImage(url) {
    let ctx = this.canvasElement.getContext('2d');
    let img = new Image();
    
    //drawing of the test image - img1
    img.onload = () => {
      //draw background image
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    img.src = url;
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      let captureDataUrl = 'data:image/jpeg;base64,' + imagePath;
      this.loadImage(captureDataUrl);
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


}