import { Component } from '@angular/core';

import { Platform } from '@ionic/angular'; 
import { App } from '@capacitor/app'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private platform: Platform) {    
    this.platform.backButton.subscribeWithPriority(-1, () => {
      App.exitApp();    
    });  
  }

}
