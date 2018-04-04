import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { Web3Service } from './shared/servcies/web3.service';
import { FirebaseService } from './shared/servcies/firebase.service';
import { BuyKuscoinComponent } from './buy-kuscoin/buy-kuscoin.component';
import { ImportPrivateKeyComponent } from './import-private-key/import-private-key.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from "angularfire2/database";
import { firebaseconfig } from '../environments/environment';
import { AlertComponent } from './alert-dialogbox.component';
import { DialogService, BootstrapModalModule } from 'ng2-bootstrap-modal';
import { LoaderService } from './shared/servcies/loader.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './shared/servcies/authentication.service';
import { LocalStorageService } from './shared/servcies/local-storage.service';
import { WalletService } from './shared/servcies/wallet.service';
import { GlobalService } from './shared/servcies/global.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BuyKuscoinComponent,
    ImportPrivateKeyComponent,
    DashboardComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseconfig),
    BootstrapModalModule
  ],
  entryComponents: [
    AlertComponent
  ],
  providers: [Web3Service,
    FirebaseService,
    AngularFireDatabase,
    DialogService,
    LoaderService,
    AuthenticationService,
    LocalStorageService,
    WalletService,
    GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
