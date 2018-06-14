import { Component,ViewChild, ChangeDetectorRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, Events  ,Content} from 'ionic-angular';


import { JmessageServiceProvider } from '../../../providers/jmessage-service/jmessage-service';
/**
 * Generated class for the ConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {

  
  @ViewChild(Content) content: Content;

  username :string;

  groudId: string;

  messageId :string;

  messages: any[];

  message: string;

  messagestr: string; 
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public Jmessage: JmessageServiceProvider,
    public events : Events,
    public cd: ChangeDetectorRef ) {

      this.events.subscribe('receive-message-fromRoot',(res)=>{
        // alert("receive-message"+JSON.stringify(res))
        //  this.messages.concat(res.result);
        this.getHistory(false);
      })

     
      
     
      // alert(this.navParams.data.username)
      this.username = this.navParams.data.username;
      this.messageId = this.navParams.data.serverMessageId;

      if(this.messageId){
        this.Jmessage.enterConversationSingle(this.username,this.messageId).then((result)=>{
          this.getHistory(false);
        })
      }else{
        this.Jmessage.createConversationSingle(this.username).then((result)=>{
          // this.getHistory(false);
        })
      }
      
      
  }

  ionViewDidLoad() { 

    
  }
  
  sendMessage(){
   if(!this.message)return; 
    this.Jmessage.sendTextMessageSingle(this.username,this.message).then((msg)=>{
      this.message = '';

      this.getHistory(false);
    }).catch((error)=>{

    }) 
  }

  getHistory(refresher){ 
    this.Jmessage.getHistoryMessagesSingleAll(this.username).then((result)=>{
      // alert("result:"+JSON.stringify(result));
      this.messages = result; 
      this.cd.detectChanges();  
      setTimeout(()=>{
        // alert("scroll ti bottom")
        this.content.scrollToBottom(0)
        },100)

      if(refresher){
        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 1000);
      }
    })
  }
  
  doRefresh(refresher) { 
   
    this.getHistory(refresher);
  }

 

}
