import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { JmessageServiceProvider } from '../../../providers/jmessage-service/jmessage-service';

/**
 * Generated class for the PrifilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prifile',
  templateUrl: 'prifile.html',
})
export class PrifilePage {

  currentItem : any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public Jmessage: JmessageServiceProvider) {
      // alert(JSON.stringify(this.navParams.data.item))
      this.currentItem = this.navParams.data.item;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrifilePage');
  }

  createConversation(){
    if(this.currentItem.username){
      this.Jmessage.createConversationSingle(this.currentItem.username)
      .then((result)=>{
        // alert("createConversationSingle:" + JSON.stringify(result));

        this.Jmessage.getConversationSingle(this.currentItem.username).then((result)=>{
          // alert("getConversationSingle"+JSON.stringify(result));

          if(result && result.latestMessage){
             this.navCtrl.push('ConversationPage',{
              username:this.currentItem.username,
              serverMessageId:result.latestMessage.serverMessageId
            });
          }else{
            this.navCtrl.push('ConversationPage',{username:this.currentItem.username});
          }
          
        })
      }).catch((error)=>{
        alert("createConversationSingle error:"+JSON.stringify(error));
      }) 
    }
    
  }

  

}
