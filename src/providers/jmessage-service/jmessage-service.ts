import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainPage } from '../../pages';
 
  
import { JMessagePlugin,JMMessageSendOptions  } from '@jiguang-ionic/jmessage'
import { Events, LoadingController  } from 'ionic-angular';
/*
  Generated class for the JmessageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JmessageServiceProvider {

  appKey: string = '06b52d0a26703eb0431399f8';

  loader : any;

  LoaderCount : number = 0;
  constructor(public http: HttpClient,
    public jmessage: JMessagePlugin , 
    public storage: Storage,
    public events: Events,
    public loadingCtrl: LoadingController) {

      this.loader = this.loadingCtrl.create({
         
      });
      

      //收到聊天消息事件。
      //监听函数以参数形式返回消息对象。
      this.jmessage.addReceiveMessageListener((result)=>{
          // alert("result:"+JSON.stringify(result));
          setTimeout(()=>{
            this.events.publish('receive-message',{
              result:result
            })
          },50)
          
      })

      //点击通知栏消息通知事件监听，iOS 需要配合 jpush-phonegap-plugin 才能生效。
      //监听函数以参数形式返回消息对象。
      this.jmessage.addClickMessageNotificationListener((result)=>{
        alert("result:"+JSON.stringify(result));

        this.events.publish('open-notice',result);
      })

      //消息漫游同步监听。
      //如果在初始化时设置了 isOpenMessageRoaming = true，即代表启用了消息记录漫游，当用户在其他设备登录时，
      //会自动将历史消息同步到本地，同步完成后会触发该事件。
      this.jmessage.addSyncRoamingMessageListener((result)=>{
        alert("result:"+JSON.stringify(result));
      })

      //离线消息同步监听。
      //在用户离线（登出或网络断开）期间所产生的消息，会暂存在极光服务器中。当用户再次上线时，会触发该事件。
      this.jmessage.addSyncOfflineMessageListener((result)=>{
        alert("result:"+JSON.stringify(result));
      })

      //用户登录状态变更事件监听。 
      this.jmessage.addLoginStateChangedListener((result)=>{
        alert("result:"+JSON.stringify(result));
      })

      //好友相关事件监听。
      this.jmessage.addContactNotifyListener((result)=>{
        alert("result:"+JSON.stringify(result));

        this.events.publish('contact-notify',{result:result});
      })
      
      //消息被对方撤回通知事件。
      this.jmessage.addMessageRetractListener((result)=>{
        alert("result:"+JSON.stringify(result));
      })

      //收到聊天室消息。
      this.jmessage.addReceiveChatRoomMessageListener((result)=>{
        alert("result:"+JSON.stringify(result));
      })
  }

  //初始化插件
  init(){ 
    this.jmessage.init({ isOpenMessageRoaming: true });
  }

  //设置是否开启 debug 模式，开启后 SDK 将会输出更多日志信息，推荐在应用对外发布时关闭。
  setDebugMode(boolean){
    this.jmessage.setDebugMode({ enable: boolean })
  }
  //用户注册。
  register(account){
     
    return this.jmessage.register({ username: account.username, password: account.password, nickname: account.nickname })
    .then((result)=>{
      // alert(result)
      if(  result.toLocaleLowerCase() === 'ok'){
        this.login(account); 
      }else{
        alert(result)
      } 
    }).catch((error)=>{
      alert("register error" +JSON.stringify(error))
    }) 
  }

  //用户登录。
  login(account){
    this.loader.present();
    return this.jmessage.login({ username: account.username, password: account.password}).then((result)=>{
      if(result.toLocaleLowerCase() === 'ok'){
        this.storage.set('account',account);
        // this.navCtrl.push(MainPage);
        // alert(result)

        this.loader.dismiss();
        this.events.publish('user-login');
      }else{
        alert(result)
      }
    }).catch((error)=>{
      alert("login error" + JSON.stringify(error))

      if(error.code == 871308){
        this.init();
        setTimeout(()=>{

          this.login(account);
        },100) 
      }else{
        this.loader.dismiss();
      }
    }) 
  }

  //用户登出。
  logout(){
    return  this.jmessage.logout();
  }
  //获取当前登录用户信息。如果未登录会返回空对象。
  getMyInfo(){
    return this.jmessage.getMyInfo();
    // .then((result)=>{
    //   alert(result)
    //   alert("getMyInfo"+JSON.stringify(result))
    // }).catch((error)=>{
    //   alert("error:"+JSON.stringify(error));
    // })
  }
  getUserInfo(_username){
    return this.jmessage.getUserInfo({ username: _username, appKey: this.appKey} )
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //更新当前登录用户的密码。
  updateMyPassword(passwords){
   return this.jmessage.updateMyPassword({ oldPwd: passwords.oldPwd, newPwd: passwords.newPwd})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //更新当前登录用户的头像。
  updateMyAvatar(_imgPath){
   return this.jmessage.updateMyAvatar({ imgPath: _imgPath})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //下载用户头像缩略图（不会重复下载）。
  downloadThumbUserAvatar(_username){
    return this.jmessage.downloadThumbUserAvatar({username: _username, appKey: this.appKey })
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }

  //下载用户头像原图（不会重复下载）。如果用户未设置头像，返回的 filePath 为空字符串。
  downloadOriginalUserAvatar(_username){
    return this.jmessage.downloadOriginalUserAvatar({username: _username, appKey: this.appKey })
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //更新当前登录用户信息。
  updateMyInfo(){
    return  this.jmessage.updateMyInfo({ })
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //创建群组。
  createGroup(group_info){
    return this.jmessage.createGroup({ name: group_info.name, desc: group_info.desc})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //获取当前用户所加入的群组 ID 列表。
  getGroupIds(){
    return this.jmessage.getGroupIds()
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //获取群组信息。
  getGroupInfo(groupId){
    return this.jmessage.getGroupInfo({id: groupId})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //更新群组信息。
  updateGroupInfo(group_info){
    return this.jmessage.updateGroupInfo({id: group_info.groupId, newName: group_info.newName, newDesc: group_info.newDesc})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }

  //添加群成员。usernameArray:['user1', 'user2']
  addGroupMembers(groupId,usernameArray){
    return this.jmessage.addGroupMembers({id: groupId, usernameArray: usernameArray, appKey: this.appKey})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //移除群组成员。
  removeGroupMembers(groupId,usernameArray){
    return this.jmessage.removeGroupMembers({id: groupId, usernameArray: usernameArray, appKey: this.appKey})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }

  //获取群组成员列表。
  getGroupMembers(groupId){
    return this.jmessage.getGroupMembers({id: groupId})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //退出群组。
  exitGroup(groupId){
    return this.jmessage.exitGroup({id: groupId})
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }
  //设置是否屏蔽指定群组消息。
  blockGroupMessage(groupId){
    return this.jmessage.blockGroupMessage({ id:groupId, isBlock: true })
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }

  //查询指定群组是否被屏蔽。
  isGroupBlocked(groupId){
    return  this.jmessage.isGroupBlocked({ id:groupId })
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }

  //获取被当前登录用户屏蔽的群组列表。
  getBlockedGroupList(){
    return  this.jmessage.getBlockedGroupList()
    .then((result)=>{
      alert(result)
    }).catch((error)=>{
      alert("error:"+JSON.stringify(error));
    })
  }

  //发送文本消息。
  sendTextMessage(options){
    return this.jmessage.sendTextMessage({ type: options.type, username: options.username, appKey: this.appKey,
    text: options.text, extras: {}, messageSendingOptions: {}})
  } 

   //发送文本消息,single。
   sendTextMessageSingle(_username,_text){
    return this.jmessage.sendTextMessage({ type: 'single', username: _username, appKey: this.appKey,
    text: _text, extras: {}, messageSendingOptions: {}})
  } 

   //发送文本消息,group。
   sendTextMessageGroup(_groupId,_text){
    return this.jmessage.sendTextMessage({ type: 'group', groupId: _groupId,  
    text: _text, extras: {}, messageSendingOptions: {}})
  } 

   //发送文本消息,chatroom。
   sendTextMessageChatRoom(_roomId,_text){
    return this.jmessage.sendTextMessage({ type: 'chatRoom', roomId: _roomId,  
    text: _text, extras: {}, messageSendingOptions: {}})
  } 
  //发送图片消息，在收到消息时 SDK 默认会自动下载缩略图，如果要下载原图，需调用 downloadOriginalImage 方法。
  sendImageMessageSingle(_username,_path){
    return this.jmessage.sendImageMessage({ type: 'single', username: _username,appKey: this.appKey,
    path: _path, extras: {}, messageSendingOptions: {}})
  } 

  sendImageMessageGroup(_groupId,_path){
    return this.jmessage.sendImageMessage({ type: 'group', groupId: _groupId,
    path: _path, extras: {}, messageSendingOptions: {}})
  } 

  //发送语音消息，在收到消息时 SDK 默认会自动下载语音文件，如果下载失败（即语音消息文件路径为空），可调用 downloadVoiceFile 手动下载
  sendVoiceMessageSingle(_username,_path){
    return this.jmessage.sendVoiceMessage({ type: 'single', username: _username,appKey: this.appKey,
    path: _path, extras: {}, messageSendingOptions: {}})
  } 
  
  sendVoiceMessageGroup(_groupId,_path){
    return this.jmessage.sendVoiceMessage({ type: 'group', groupId: _groupId,
    path: _path, extras: {}, messageSendingOptions: {}})
  }   

  //发送地理位置消息，通常需要配合地图插件使用。
  sendLocationMessageSingle(_username){
    return this.jmessage.sendLocationMessage({ type: 'single', username: _username, appKey: this.appKey,
    latitude: 22.54, longitude: 114.06, scale:1, address: '深圳市',
    extras: {key1: 'value1'}, messageSendingOptions: {}})
  }   
  
  sendLocationMessageGroup(_groupId,_path){
    return this.jmessage.sendLocationMessage({ type: 'group', groupId: _groupId, 
    latitude: 22.54, longitude: 114.06, scale:1, address: '深圳市',
    extras: {key1: 'value1'}, messageSendingOptions: {}})
  }   

  //发送文件消息。对方在收到文件消息时 SDK 不会自动下载，下载文件需手动调用 downloadFile 方法。
  sendFileMessageSingle(_username,_path){
    return this.jmessage.sendFileMessage({ type: 'single', username: _username,appKey: this.appKey,
    path: _path, extras: {}, messageSendingOptions: {}})
  } 
  
  sendFileMessageGroup(_groupId,_path){
    return this.jmessage.sendFileMessage({ type: 'group', groupId: _groupId,
    path: _path, extras: {}, messageSendingOptions: {}})
  }   

  //消息撤回。调用后被撤回方会收到一条 retractMessage 事件。并且双方的消息内容将变为不可见。
  retractMessageSingle(_username,_messageId){
    return this.jmessage.retractMessage({type: 'single', username: _username, appKey: this.appKey, messageId: _messageId})
  } 

  retractMessageGroup(_groupId,_messageId){
    return this.jmessage.retractMessage({type: 'group', groupId: _groupId, messageId: _messageId})
  } 

  //从最新的消息开始获取历史消息。
  //当 limit 为 -1 而 from >= 0 时，返回从 from 开始余下的所有历史消息。如果 from 大于历史消息总数，则返回空数组。 
  //例如：当 from = 0 && limit = -1 时，返回所有历史消息。
  getHistoryMessagesSingle(_username,_from: number,_limit: number){
    return this.jmessage.getHistoryMessages({ type: 'single', username: _username,
    appKey: this.appKey, from: _from, limit: _limit })
  }

  getHistoryMessagesSingleAll(_username){
    return this.getHistoryMessagesSingle(_username,0,-1);
  }

  getHistoryMessagesGroup(_groupId,_from: number,_limit: number){
    return this.jmessage.getHistoryMessages({ type: 'group', groupId: _groupId, from: _from, limit: _limit });
  }
  getHistoryMessagesGroupAll(_groupId,_from: number,_limit: number){
    return this.getHistoryMessagesGroup(_groupId, 0,-1);
  }

  //根据消息 id 获取消息对象。
  getMessageByIdSingle(_username,_messageId){
    return this.jmessage.getMessageById({type: 'single', username: _username, appKey: this.appKey, messageId: _messageId})
  } 

  getMessageByIdGroup(_groupId,_messageId){
    return this.jmessage.getMessageById({type: 'group', groupId: _groupId, messageId: _messageId})
  } 


   //根据 id 删除消息。
   deleteMessageByIdSingle(_username,_messageId){
    return this.jmessage.deleteMessageById({type: 'single', username: _username, appKey: this.appKey, messageId: _messageId})
  } 

  deleteMessageByIdGroup(_groupId,_messageId){
    return this.jmessage.deleteMessageById({type: 'group', groupId: _groupId, messageId: _messageId})
  } 
  
  //下载图片消息缩略图。如果已经下载，会直接返回本地文件路径，不会重复下载。
  downloadThumbImageSingle(_username,_messageId){
      return this.jmessage.downloadThumbImage({type: 'single', username: _username, appKey: this.appKey, messageId: _messageId})
    } 
  
  downloadThumbImageGroup(_groupId,_messageId){
      return this.jmessage.downloadThumbImage({type: 'group', groupId: _groupId, messageId: _messageId})
    } 

    //下载图片消息原图。如果已经下载，会直接返回本地文件路径，不会重复下载。
    downloadOriginalImageSingle(_username,_messageId){
      return this.jmessage.downloadOriginalImage({type: 'single', username: _username, appKey: this.appKey, messageId: _messageId})
    } 
  
    downloadOriginalImageGroup(_groupId,_messageId){
      return this.jmessage.downloadOriginalImage({type: 'group', groupId: _groupId, messageId: _messageId})
    } 

    //下载语音文件。如果已经下载，会直接返回本地文件路径，不会重复下载。
    downloadVoiceFileSingle(_username,_messageId){
      return this.jmessage.downloadVoiceFile({type: 'single', username: _username, appKey: this.appKey, messageId: _messageId})
    } 
  
    downloadVoiceFileGroup(_groupId,_messageId){
      return this.jmessage.downloadVoiceFile({type: 'group', groupId: _groupId, messageId: _messageId})
    } 

    //下载文件。如果已经下载，会直接返回本地文件路径，不会重复下载。
    downloadFileSingle(_username,_messageId){
      return this.jmessage.downloadFile({type: 'single', username: _username, appKey: this.appKey, messageId: _messageId})
    } 
  
    downloadFileGroup(_groupId,_messageId){
      return this.jmessage.downloadFile({type: 'group', groupId: _groupId, messageId: _messageId})
    } 

    //创建聊天会话。
    createConversationSingle(_username){
      return this.jmessage.createConversation({type: 'single', username: _username, appKey: this.appKey})
    } 
    createConversationGroup(_groupId){
      return this.jmessage.createConversation({type: 'group', groupId: _groupId})
    } 
    
    //删除聊天会话，同时也会删除本地聊天记录。
    deleteConversationSingle(_username){
      return this.jmessage.deleteConversation({type: 'single', username: _username, appKey: this.appKey})
    } 
    deleteConversationGroup(_groupId){
      return this.jmessage.deleteConversation({type: 'group', groupId: _groupId})
    } 
    
    //(Android only) 进入聊天会话。当调用后，该聊天会话的消息将不再显示通知。

    //iOS 默认应用在前台时，就不会显示通知。
    enterConversationSingle(_username,_messageId){
      return this.jmessage.enterConversation({type: 'single', username: _username, appKey: this.appKey})
    } 
    enterConversationGroup(_groupId,_messageId){
      return this.jmessage.enterConversation({type: 'group', groupId: _groupId})
    } 
    
    //(Android only) 退出聊天会话。调用后，聊天会话之后的相关消息通知将会被触发。
    exitConversationSingle(_username){
      return this.jmessage.exitConversation({type: 'single', username: _username, appKey: this.appKey})
    } 
    exitConversationGroup(_groupId){
      return this.jmessage.exitConversation({type: 'group', groupId: _groupId})
    } 

     //获取聊天会话对象。
     getConversationSingle(_username,){
      return this.jmessage.getConversation({type: 'single', username: _username, appKey: this.appKey})
    } 
    getConversationGroup(_groupId){
      return this.jmessage.getConversation({type: 'group', groupId: _groupId})
    } 


    //从本地数据库获取会话列表。默认按照会话的最后一条消息时间降序排列。
    getConversations(){
      return this.jmessage.getConversations();
    }  
    //重置会话的未读消息数。
    resetUnreadMessageCountSingle(_username){
      return this.jmessage.resetUnreadMessageCount({type: 'single', username: _username, appKey: this.appKey})
    } 
    resetUnreadMessageCountGroup(_groupId){
      return this.jmessage.resetUnreadMessageCount({type: 'group', groupId: _groupId})
    } 
    //发送添加好友请求，调用后对方会收到 contactNotify 事件。
    sendInvitationRequest(_username,_reason){
      return this.jmessage.sendInvitationRequest({ username: _username, appKey: this.appKey, reason:_reason})
    } 

    //接受好友请求，调用后对方会收到 contactNotify 事件。
    acceptInvitation(_username){
      return this.jmessage.acceptInvitation({ username: _username, appKey: this.appKey})
    } 
     
    //拒绝申请好友请求，调用成功后对方会收到 contactNotify 事件。
    declineInvitation(_username,_reason){
      return this.jmessage.declineInvitation({ username: _username, appKey: this.appKey, reason:_reason})
    } 

    //获取好友列表。
    getFriends(){
      return this.jmessage.getFriends();
    }
  
    //删除好友，调用成功后对方会收到 contactNotify 事件
    removeFromFriendList(_username){
      return this.jmessage.removeFromFriendList({ username: _username, appKey: this.appKey})
    } 
    
    //更新好友备注名。
    updateFriendNoteName(_username,_noteName){
      return this.jmessage.updateFriendNoteName({ username: _username, appKey: this.appKey, noteName:_noteName})
    } 

    //更新用户备注信息。
    updateFriendNoteText(_username,_noteText){
      return this.jmessage.updateFriendNoteText({ username: _username, appKey: this.appKey, noteText:_noteText})
    } 
    
     //批量加入用户到黑名单。
     addUsersToBlacklist(_usernameArray: any[],_noteName){
      return this.jmessage.addUsersToBlacklist({usernameArray: _usernameArray, appKey: this.appKey})
    } 

    //批量将用户从黑名单中移除。 
    removeUsersFromBlacklist(_usernameArray: any[],_noteName){
      return this.jmessage.removeUsersFromBlacklist({usernameArray: _usernameArray, appKey: this.appKey})
    } 
    
    //获取被当前用户加入黑名单的用户列表。
    getBlacklist(){
      return this.jmessage.getBlacklist()
    }

    //设置对某个用户或群组是否免打扰。
    setNoDisturbSingle(_username,_isNoDisturb: boolean){
      return this.jmessage.setNoDisturb({ type: 'single', username: _username, appKey: this.appKey,isNoDisturb: _isNoDisturb })
    }

    setNoDisturbGroup(_groupId,_isNoDisturb: boolean){
      return this.jmessage.setNoDisturb({ type: 'group', groupId: _groupId, isNoDisturb: _isNoDisturb })
    }

    //设置全局免打扰。
    setNoDisturbGlobal(_isNoDisturb){
      return this.jmessage.setNoDisturbGlobal({isNoDisturb: _isNoDisturb });
    }

    //判断当前是否开启了全局免打扰。
    isNoDisturbGlobal(){
      return this.jmessage.isNoDisturbGlobal();
    }

    //获取免打扰列表。
    getNoDisturbList(){
      return this.jmessage.getNoDisturbList();
    }

  
}
