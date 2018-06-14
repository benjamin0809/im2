import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';


import { JmessageServiceProvider } from '../../providers/jmessage-service/jmessage-service';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public items: Items,
    public Jmessage: JmessageServiceProvider,
    public events: Events) { 
      this.getFriends();

      this.events.subscribe('friend-accpet',(()=>{
        this.getFriends();
      }));

    }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.items.query({
      name: val
    });
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item) {
    this.navCtrl.push('PrifilePage', {
      item: item
    });
  }

  getFriends(){
    this.Jmessage.getFriends().then((result)=>{
      // alert("get Friends: "+ JSON.stringify(result));
      this.currentItems = result;
    })
  }

  AddFriend(){
    this.navCtrl.push('AddPage');
  }
}
