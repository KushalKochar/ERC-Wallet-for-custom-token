import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImportPrivateKeyComponent } from './import-private-key/import-private-key.component';
import { BuyKuscoinComponent } from './buy-kuscoin/buy-kuscoin.component';
import { Web3Service } from './shared/servcies/web3.service';

const routes: Routes = [
  { path: 'app-dashboard', component: DashboardComponent, canActivate: [Web3Service] },
  { path: 'app-import-private-key', component: ImportPrivateKeyComponent },
  { path: 'app-buy-kuscoin', component: BuyKuscoinComponent, canActivate: [Web3Service] },
  { path: '', component: ImportPrivateKeyComponent } // default routing
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }