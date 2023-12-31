import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular'; 
import { App } from '@capacitor/app'; 
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network, NetworkStatus } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  platformName: any;
  nativePlatform: any;
  isCameraAvailable: any;
  deviceInfo: any = {};
  batteryInfo: any = {};
  eventsLog: string[] = [];
  gpsInfo: any = {};

  networkInfo: NetworkStatus = {
    connected: false,
    connectionType: 'unknown',
  };

  constructor(private platform: Platform, private ngZone: NgZone) {    
    this.platform.backButton.subscribeWithPriority(-1, () => {
      App.exitApp();    
    });  
  }

  ngOnInit() {
    this.platformName = this.platform.platforms().join(', ');
    this.nativePlatform = Capacitor.getPlatform();
    this.isCameraAvailable = Capacitor.isPluginAvailable('Camera');

    this.loadDeviceInfo();
    this.loadBatteryInfo();
    this.loadNetworkInfo();

    Network.addListener('networkStatusChange', (status: any) => {
      this.networkInfo = status;
    });

    this.subscribeToNetworkChanges();
    this.subscribeToAppStateChanges();
    this.logGPSInfo();
  }

  async loadDeviceInfo() {
    try {
      const info = await Device.getInfo();
      this.deviceInfo = info;
    } catch (error) {
      console.error('Error', error);
    }
  }

  async loadBatteryInfo() {
    try {
      const info = await Device.getBatteryInfo();
      this.batteryInfo = info;
    } catch (error) {
      console.error('Error', error);
    }
  }

  async loadNetworkInfo() {
    try {
      const status = await Network.getStatus();
      this.networkInfo = status;
    } catch (error) {
      console.error('Error', error);
    }
  }

  private subscribeToNetworkChanges() {
    Network.addListener('networkStatusChange', (status) => {
      const connectionType = status.connectionType;
      this.ngZone.run(() => {
        this.logEvent(`Cambio tipo conexión a ${connectionType}`);
      });
    });
  }

  private subscribeToAppStateChanges() {
    App.addListener('appStateChange', (state) => {
      const eventText = state.isActive ? 'onResume' : 'onPause';
      this.ngZone.run(() => {
        this.logEvent(eventText);
      });
    });

    App.addListener('resume', () => {
      this.ngZone.run(() => {
        this.logEvent('onResume');
      });
    });

    App.addListener('pause', () => {
      this.ngZone.run(() => {
        this.logEvent('onPause');
      });
    });
  }

  private logEvent(eventText: string) {
    this.eventsLog.push(eventText);
  }

  logGPSInfo() {
    Geolocation.getCurrentPosition().then((position) => {
      this.ngZone.run(() => {
        this.gpsInfo = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      });
    }).catch((error) => {
      console.error('Error', error);
    });
  }
}
