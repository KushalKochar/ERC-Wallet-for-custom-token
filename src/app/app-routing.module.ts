import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImportPrivateKeyComponent } from './import-private-key/import-private-key.component';
import { BuyKuscoinComponent } from './buy-kuscoin/buy-kuscoin.component';
import { Web3Service } from './shared/servcies/web3.service';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './shared/servcies/authentication.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'app-dashboard', component: DashboardComponent, canActivate: [AuthenticationService] },
  { path: 'app-import-private-key', component: ImportPrivateKeyComponent, canActivate: [AuthenticationService] },
  { path: 'app-buy-kuscoin', component: BuyKuscoinComponent, canActivate: [AuthenticationService] },
  { // default routing
    path: '', component: RegisterComponent, data: {
      allowAnonymous: true
    }
  },
  {
    path: 'app-login', component: LoginComponent, data: {
      allowAnonymous: false
    }
  },
  {
    path: 'app-register', component: RegisterComponent, data: {
      allowAnonymous: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }