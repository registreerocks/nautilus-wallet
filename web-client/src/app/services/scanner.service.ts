import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { LockscreenPage } from '../views/lockscreen/lockscreen.page';
import { ScannerPage } from '../views/scanner/scanner.page';

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  constructor(private modalCtrl: ModalController) {}

  async presentScanner() {
    const modal = await this.modalCtrl.create({
      component: ScannerPage,
    });

    modal.onWillDismiss().then(({ data }) => {
      const { success, code } = data;
      if (success) {
        this.presentLock(code);
      }
    });

    return await modal.present();
  }

  async presentLock(passcode: string) {
    const modal = await this.modalCtrl.create({
      component: LockscreenPage,
      componentProps: { passcode },
    });

    return await modal.present();
  }

  async checkPermissions() {
    const { camera } = await Camera.checkPermissions();
    return camera;
  }

  async requestPermissions() {
    //NOTE: https://github.com/ionic-team/capacitor/discussions/4944#discussioncomment-1205023
    try {
      //NOTE: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      const { active } = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      return active;
    } catch (e) {
      return false;
    }
  }
}
