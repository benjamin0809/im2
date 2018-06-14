import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrifilePage } from './prifile';

@NgModule({
  declarations: [
    PrifilePage,
  ],
  imports: [
    IonicPageModule.forChild(PrifilePage),
  ],
})
export class PrifilePageModule {}
