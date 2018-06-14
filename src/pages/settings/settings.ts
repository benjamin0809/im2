import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Events,ActionSheetController } from 'ionic-angular';
import { Camera ,CameraOptions} from '@ionic-native/camera'
import { Settings } from '../../providers';
import { Observable } from "rxjs";
import { File, FileEntry } from "@ionic-native/file";
import { JmessageServiceProvider } from '../../providers/jmessage-service/jmessage-service';
import { Storage } from '@ionic/storage';
import { JMUserInfo } from '@jiguang-ionic/jmessage';
/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
 
  
  userItem : JMUserInfo | {} |any;
 
 

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public Jmessage: JmessageServiceProvider,
    public events: Events,
    public storage:Storage,
    public camera: Camera,
    private actionSheetCtrl: ActionSheetController,
   public file: File) {
      this.userItem ={
        avatarThumbPath:'assets/img/ian-avatar.png'
      };
  }

 

  ionViewDidLoad() {
    // Build an empty form for the template to render 

    this.getMyInfo();
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
 
 
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }



  testSendMessage(){

    let options = {type:'single',username:'benjamin',text:'hello'}; 
    this.Jmessage.sendTextMessage(options).then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  logoutChat(){
    this.Jmessage.logout();

    this.storage.set("account",'');
    alert('logout')
    setTimeout(()=>{
      this.events.publish('user:reLogin');
    },100)
    
  }

  getMyInfo(){
    this.Jmessage.getMyInfo().then((result)=>{

      this.userItem = result;
      // alert("getMyInfo:" + JSON.stringify(result))
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  uploadMyAvatar(path){
    this.Jmessage.updateMyAvatar(path).then((result)=>{
      this.userItem.avatarThumbPath = path;
     
    })
  }
  // getPicture() {
  //   if (Camera['installed']()) {
  //     this.camera.getPicture({
  //       destinationType: this.camera.DestinationType.DATA_URL,
  //       targetWidth: 96,
  //       targetHeight: 96
  //     }).then((data) => {
  //       alert(data)
  //       this.userItem.avatarThumbPath = 'data:image/jpg;base64,' + data; 
  //     }, (err) => {
  //       alert('Unable to take photo');
  //     })
  //   } else { 
  //   }
  // }

  //头像上传
  uploadAvatar() {
    let that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: "相册",
          handler: () => {
            that.getPictureByPhotoLibrary({//从相册多选
              destinationType: 0//期望返回的图片格式,0图片字符串
            }).subscribe(img => {
              alert(img) 
              this.uploadMyAvatar(img);
            });
          }
        },
        {
          text: "拍照",
          handler: () => {
            that.getPictureByCamera({
              destinationType: 0//期望返回的图片格式,1图片路径,0 base64編碼
            }).subscribe(img => {
              alert(img)  
              this.uploadMyAvatar(img);
            });
          }
        },
        {
          text: "取消",
          role: 'cancel'
        }
      ]
    }).present();
  }

   /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
        sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
        destinationType: this.camera.DestinationType.DATA_URL,//默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
        quality: 94,//图像质量，范围为0 - 100
        allowEdit: true,//选择图片前是否允许编辑
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 512,//缩放图像的宽度（像素）
        targetHeight: 512,//缩放图像的高度（像素）
        saveToPhotoAlbum: true,//是否保存到相册
        correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
    }, options);
    return Observable.create(observer => {
        this.camera.getPicture(ops).then((imgData: string) => {
            if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
                observer.next('data:image/jpg;base64,' + imgData);
            } else {
                observer.next(imgData);
            }
        }).catch(err => {
            if (err == 20) {
                alert('没有权限,请在设置中开启权限');
                return;
            }
            if (String(err).indexOf('cancel') != -1) {
                return;
            }
            console.log(err, '使用cordova-plugin-camera获取照片失败');
            alert('获取照片失败');
            observer.error(false);
        });
    });
};

/**
 * 通过拍照获取照片
 * @param options
 */
getPictureByCamera(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
};

/**
 * 通过图库获取照片
 * @param options
 */
getPictureByPhotoLibrary(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
};

/**
 * 通过图库选择多图
 * @param options
 */
/*
getMultiplePicture(options = {}): Observable<any> {
    let that = this;
    let ops = Object.assign({
        maximumImagesCount: 6,
        width: IMAGE_SIZE,//缩放图像的宽度（像素）
        height: IMAGE_SIZE,//缩放图像的高度（像素）
        quality: QUALITY_SIZE//图像质量，范围为0 - 100
    }, options);
    return Observable.create(observer => {
        this.imagePicker.getPictures(ops).then(files => {
            let destinationType = options['destinationType'] || 0;//0:base64字符串,1:图片url
            if (destinationType === 1) {
                observer.next(files);
            } else {
                let imgBase64s = [];//base64字符串数组
                for (let fileUrl of files) {
                    that.convertImgToBase64(fileUrl).subscribe(base64 => {
                        imgBase64s.push(base64);
                        if (imgBase64s.length === files.length) {
                            observer.next(imgBase64s);
                        }
                    })
                }
            }
        }).catch(err => {
            this.logger.log(err, '通过图库选择多图失败');
            this.alert('获取照片失败');
            observer.error(false);
        });
    });
};
*/

/**
 * 根据图片绝对路径转化为base64字符串
 * @param path 绝对路径
 */
convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
        this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
            fileEnter.file(file => {
                let reader = new FileReader();
                reader.onloadend = function (e) {
                    observer.next(this.result);
                };
                reader.readAsDataURL(file);
            });
        }).catch(err => {
            console.log(err, '根据图片绝对路径转化为base64字符串失败');
            observer.error(false);
        });
    });
}
}
