import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BecomeConnectorPage } from './become-connector.page';

const routes: Routes = [
  {
    path: '',
    component: BecomeConnectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BecomeConnectorPageRoutingModule {}
