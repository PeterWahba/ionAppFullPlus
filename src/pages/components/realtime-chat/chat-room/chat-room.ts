import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Reference } from "@firebase/database-types";
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as Rx from 'rxjs/Rx';
import { Clipboard } from "@ionic-native/clipboard";
import { Toast } from "@ionic-native/toast";
import { AlertController, ModalController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { GalleryModal } from "ionic-gallery-modal";

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html'
})
export class ChatRoomPage {
  read: boolean;
  counter: number = 0;
  len: number;
  imgs: HTMLCollectionOf<HTMLImageElement>;
  showIsTyping: boolean;
  typing: boolean;
  @ViewChild('content') private content: any;
  private db: any;
  uid: any;
  messageList: any;
  messagesRef: Reference;
  messages: any;
  text: string;
  userinfo: any;
  imageSrc: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, private clipboard: Clipboard,
    private toast: Toast, private alertCtrl: AlertController, private camera: Camera,
    public modalCtrl: ModalController) {
    this.userinfo = this.navParams.get('userinfo');
    // Initialise access to the firestore service
    this.db = firebase.firestore();
    
    this.theOtherUserIsTyping();

    this.afAuth.authState.subscribe(userAuth => {
      if (!userAuth) {
        console.log('auth false');
        this.navCtrl.parent.select(2);
      }
      this.uid = userAuth.uid;

      this.retriveChatMessages().subscribe((result) => {
        this.messageList = result;
        this.setMessageAsRead();//every time this is fired, means that you read the message
      });

    });

    this.watchForWhenMessageIsRead();
  }

  ionViewDidEnter() {
    // this.onAllImagesLoad(//after all images are loaded, scroll to the bottom
    //   this.scrollToBottom);
  }

  //every time a chat is open scroll to the button to see latest messages
  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.content.scrollToBottom(300);//300ms animation speed
      }, 500);
    } catch (err) {
      console.log("error scrolling: ", err)
    }
  }

  retriveChatMessages() {
    //this is ti create a query with or e.g: where a = 1 or b = 2 
    var fromRef = this.db.collection('chatMessages').where('senderReceiver', '==', this.userinfo.from.$key + '-' + this.userinfo.to.$key)
    var toRef = this.db.collection('chatMessages').where('senderReceiver', '==', this.userinfo.to.$key + '-' + this.userinfo.from.$key)


    //we'll need ro observables
    var fromRef$ = new Rx.Subject();
    var toRef$ = new Rx.Subject();


    fromRef.onSnapshot((querySnapshot) => {
      let data = [];
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          var obj = doc.data();
          obj.$key = doc.id
          console.log(obj)
          data.push(obj);
        }
      });
      fromRef$.next(data);
    });

    toRef.onSnapshot((querySnapshot) => {
      let data = [];
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          var obj = doc.data();
          obj.$key = doc.id
          console.log(obj)
          data.push(obj);
        }
      });

      toRef$.next(data);
    });

    //conbine both arr as observable  
    let fromOrTo$ = Rx.Observable.combineLatest(fromRef$, toRef$).switchMap((keys) => {

      // Destructure the values to combine a single array.
      var [from, to] = <any>keys;
      var combined = [
        //spread the arrays out to combine as one array
        ...from,
        ...to
      ];
      combined = combined.filter((e) => {//filter deleted messages
        return e.deleted != this.userinfo.from.$key;
      })

      //sort the result
      combined = combined.sort(function (a, b) { return (a.sentDate > b.sentDate) ? 1 : ((b.sentDate > a.sentDate) ? -1 : 0); });

      // Return as a new Observable that contains the combined list.
      return Rx.Observable.of(combined);
    });

    return fromOrTo$

  }

  sendMsg() {
    if (!!this.text && this.text != '') {

      this.db.collection('chatMessages').add({
        msgTo: this.userinfo.to.$key,
        msgFrom: this.userinfo.from.$key,
        msgText: this.text,
        sentDate: new Date().getTime(),
        senderReceiver: this.userinfo.from.$key + '-' + this.userinfo.to.$key,
        //deleted: 'false-'+this.userinfo.from.$key
      })
        .then((obj: any) => {
          console.log(obj);
          this.text = '';
          this.setUnreadMessage();
        })
        .catch((error: any) => {
          console.log(error);
        });

      this.scrollToBottom();

    }
  }

  IamAuthor(msg) {
    return this.uid == msg.msgFrom;
  }

  getAuthorAvatar(msg) {
    if (this.uid == msg.msgFrom) {
      return this.userinfo.from.pic;
    } else {
      return this.userinfo.to.pic;
    }
  }

  getMsgAuthorName(msg) {
    if (this.uid == msg.msgFrom) {
      return this.userinfo.from.displayedName;
    } else {
      return this.userinfo.to.displayedName;
    }
  }


  deleteMsg(msg) {
    let prompt = this.alertCtrl.create({
      title: 'Delete',
      message: "Are you sure you want to delete this message",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.deleteFromDataBase(msg);
          }
        }
      ]
    });
    prompt.present();
  }

  copyMsg(msg) {
    this.clipboard.copy(msg.msgText);
    this.toast.show(`Text copied to clipboard`, '3000', 'bottom').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  deleteFromDataBase(msg) {
    msg.deleted = this.userinfo.from.$key;
    msg.showButtons = false;
    this.db
      .collection('chatMessages')
      .doc(msg.$key)
      .update(msg)
      .then((obj: any) => {
        this.toast.show(`Message deleted`, '5000', 'center')
      })
  }

  //method called from the front end
  attachImg(msg) {
    //open de gallery select a photo and upload it to the local storage, then save it to the db
    this.openGallery((url) => {
      if (url) {
        this.db.collection('chatMessages').add({
          msgTo: this.userinfo.to.$key,
          msgFrom: this.userinfo.from.$key,
          msgText: '',
          sentDate: new Date().getTime(),
          senderReceiver: this.userinfo.from.$key + '-' + this.userinfo.to.$key,
          image: url
        })
          .then((obj: any) => {
            console.log(obj);
            this.text = '';
          })
          .catch((error: any) => {
            console.log(error);
          });

        this.scrollToBottom();
      }
    });

  }

  private openGallery(callback): void {
    let cameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }

    this.camera.getPicture(cameraOptions)
      .then(file_uri => {
        //upload the image to the local storage
        this.uploadImage(file_uri).then((snapshot: any) => {
          let uploadedImage: any = snapshot.downloadURL;
          if (typeof callback == 'function') {
            callback(uploadedImage);
          }
        })

      },
      err => console.log(err));
  }

  //firebase storage
  uploadImage(imageString): Promise<any> {
    let image: string = 'image' + new Date().getTime() + '.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('chatImages/' + image);
      parseUpload = storageRef.putString(imageString, 'base64');

      parseUpload.on('state_changed', (_snapshot) => {
        // We could log the progress here IF necessary
        //console.log('snapshot progess ' + _snapshot);
      },
        (_err) => {
          console.log('Error in promise')
          reject(_err);
        },
        (success) => {
          console.log('img uploaded ', success)
          resolve(parseUpload.snapshot);
        });
    });
  }

  fullscreenImage(imgUrl) {
    let modal = this.modalCtrl.create(GalleryModal, {
      // For multiple images //
      //photos: this.imgGalleryArray,
      // For single image //
      photos: [{ url: imgUrl }],
      closeIcon: 'close-circle',
      //initialSlide: getIndex
    });
    modal.present();
  }

  //notify to the other user that i'm typing
  iamTyping() {
    let that= this;
    if(this.typing){//avoiding multiples calls
      return;
    }
    this.typing = true;
    this.db.collection("typing").doc(this.userinfo.from.$key + '-' + this.userinfo.to.$key).set({
      isTyping: true
    })
    .then(function () {
        setTimeout(()=>{
          that.db.collection("typing").doc(that.userinfo.from.$key + '-' + that.userinfo.to.$key).set({
            isTyping: false
          }).then(()=>{
            that.typing = false;
          })
        }, 4000);//wait 4 seconds before we re-stablish the isTyping value to false in the db
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  //capture when the other user is typing
  theOtherUserIsTyping(){
    this.db.collection("typing").doc(this.userinfo.to.$key + '-' + this.userinfo.from.$key).onSnapshot((doc)=>{//get if is typing on real time
      if (doc.exists) {
        var obj = doc.data();
        if(!!obj && obj.isTyping == true){
          this.showIsTyping = true;
        }else{
          this.showIsTyping = false;
        }
      }
    })
  }

  onAllImagesLoad(event) {
    this.len = document.querySelectorAll('img.image-loaded').length
    this.counter++;
    if (this.counter == this.len) {
      this.scrollToBottom();
    }
  }

  //call this when send message
  setUnreadMessage(){
    this.db.collection("readMessage").doc(this.userinfo.from.$key + '-' + this.userinfo.to.$key).set({
      read: false
    }).then(()=>{
      this.read = false;
    })
  }

  //call this on when real-time receive message
  setMessageAsRead(){
    this.db.collection("readMessage").doc(this.userinfo.to.$key + '-' + this.userinfo.from.$key).set({
      read: true
    }).then(()=>{
      //this.read = true;
    })
  }

  //call this on the constructor
  watchForWhenMessageIsRead(){
    this.db.collection("readMessage").doc(this.userinfo.from.$key + '-' + this.userinfo.to.$key).onSnapshot((doc)=>{//get if is typing on real time
      if (doc.exists) {
        var obj = doc.data();
        if(!!obj && obj.read == true){
          this.read = true;
        }else{
          this.read = false;
        }
      }
    })
  }
}
