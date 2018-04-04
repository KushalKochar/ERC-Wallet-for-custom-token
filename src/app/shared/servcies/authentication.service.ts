import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { CanActivate } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Account } from 'web3/types';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthenticationService implements CanActivate {

  public password: string;
  public loggedIn: boolean = false;
  public registered: boolean = false;

  // public authorisedObservable = new Subject<boolean>();
  // authorised$ = this.authorisedObservable.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.isUserRegistered();
  }

  canActivate() {
    return this.loggedIn;
  }

  isUserRegistered(): boolean {
    if (localStorage.length > 0 && localStorage.getItem("DisplayAccounts") != null) {
      this.registered = true;
    } else {
      this.registered = false;
    }
    return this.registered;
  }

  login(pwd: string): boolean {
    if (!this.autheticateUser(pwd)) {
      return false;
    }
    // this.registered = true;
    this.loggedIn = true;
    this.password = pwd;
    // this.authorisedObservable.next(true);
    return true;
  }

  autheticateUser(pwd: string): boolean {
    if (localStorage.length > 0 && localStorage.getItem("accounts") != null) {

      var localAccounts = localStorage.getItem("accounts");

      var decrypted = CryptoJS.AES.decrypt(localAccounts, pwd).toString(CryptoJS.enc.Utf8);
      try {
        JSON.parse(decrypted);
        return true;
      } catch (error) {
        return false;
      }

      // this.selectedAccount = this.accounts[0];
    }
  }

  logOff() {
    this.loggedIn = false;
    this.password = "";
  }

}
