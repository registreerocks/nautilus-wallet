import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InputMaskModule } from '@ngneat/input-mask';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PayPageRoutingModule } from './pay-routing.module';
import { PayPage } from './pay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PayPageRoutingModule,
    SharedModule,
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
  ],
  declarations: [PayPage],
})
export class PayPageModule {}
