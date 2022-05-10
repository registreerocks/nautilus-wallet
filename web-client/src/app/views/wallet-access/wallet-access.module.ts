import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PinEntryComponentModule } from 'src/app/components/pin-entry/pin-entry.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletAccessPageRoutingModule } from './wallet-access-routing.module';
import { WalletAccessPage } from './wallet-access.page';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletAccessPageRoutingModule,
    SharedModule,
    IonIntlTelInputModule,
    PinEntryComponentModule,
  ],
  declarations: [WalletAccessPage],
})
export class WalletAccessPageModule {}
