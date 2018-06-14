import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, Events } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';

import { JmessageServiceProvider } from '../../providers/jmessage-service/jmessage-service';
@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: any[];
  currentItemsStr: string;
  constructor(public navCtrl: NavController, 
    public items: Items, 
    public modalCtrl: ModalController,
    public Jmessage: JmessageServiceProvider,
    public events:Events) {
 
    
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    setTimeout(()=>{
      this.getConversations();
    },100)
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.Jmessage.deleteConversationSingle(item.target.username).then(()=>{
      this.getConversations();
    })
   
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item) {
    // alert(JSON.stringify(item))

    this.Jmessage.resetUnreadMessageCountSingle(item.target.username).then(()=>{
      // this.events.publish("resetbadge-list-master");
      this.getConversations();
    });
    this.navCtrl.push('ConversationPage', {
      username: item.target.username,
      serverMessageId:item.latestMessage.serverMessageId
    });
  }

   
  getConversations(){
    this.Jmessage.getConversations().then((result)=>{
      // alert("getConversations:" + JSON.stringify(result));
      this.currentItems = result;
      this.events.publish('resetBadge-listmaster',this.resetUnreadCount());
      this.currentItemsStr = JSON.stringify(result);
    })
  }

  doRefresh(refresher) { 

    this.Jmessage.getConversations().then((result)=>{
      // alert("getConversations:" + JSON.stringify(result));
      this.currentItems = result;

      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 1000);
    })
  }

  resetUnreadCount(){

    let count = 0;
    // this.currentItems.forEach((val, idx, array) => {
      
    //   if(val.unreadCount > 0){
    //     count ++;
    //   }
    // });

    for (let entry of this.currentItems) {
      alert("entry:"+JSON.stringify(entry))
      if(entry.unreadCount > 0){
           count ++;
        }
     }

    return count;
  }
}
