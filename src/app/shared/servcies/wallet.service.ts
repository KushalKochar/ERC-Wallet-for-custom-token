import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { LocalStorageService } from './local-storage.service';
import { AuthenticationService } from './authentication.service';
import { Account } from 'web3/types';
import * as CryptoJS from 'crypto-js';
import Utils from '../utils/utils';
import { reject } from 'q';
import { resolve } from 'url';
import { CanActivate, Route, ActivatedRouteSnapshot } from '@angular/router';
import { IMenuData } from '../models/imenu-data';
import { Observable } from 'rxjs/Observable';
import { Subject, Subscription } from 'rxjs';
import { AccountDetails } from '../models/account-balance';
import { GlobalService } from './global.service';


@Injectable()
export class WalletService implements CanActivate {

  accountChangedSubscription: Subscription;
  accountAddedSubscription: Subscription;

  public accountChangedObservable = new Subject<AccountDetails>();
  accountChanged$ = this.accountChangedObservable.asObservable();

  public accountAddedObservable = new Subject<Account>();
  accountAdded$ = this.accountAddedObservable.asObservable();

  // Service message commands
  changeAccount(account: AccountDetails) {
    this.globalService.selectedAccount = account;
    this.accountChangedObservable.next(account);
  }

  // Service message commands
  addAccount(account: Account) {
    this.accountAddedObservable.next(account);
  }


  public canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.hasAccess(next.routeConfig)) {
      return false;
    }

    return true;
  }

  public hasAccess(route: Route): boolean {
    const data = route.data as IMenuData;

    if (data.allowAnonymous === true) {
      // not visible to authenticated users
      return !this.authenticationService.registered;
    } else {
      return this.authenticationService.registered;
    }

  }

  constructor(private web3Service: Web3Service,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService,
    private globalService: GlobalService) {

    // this.accountChangedSubscription = this.accountChanged$.subscribe(
    //   account => {
    //     //reffresh balance
    //     this.refreshBalance(account.address);
    //   });

    this.accountAddedSubscription = this.accountAdded$.subscribe(
      account => {
        //reffresh balance
        this.addNewAccountForUser(account);
      });
  }

  public addNewAccountForUser(newAccount: Account) {

    //add in wallet and save
    this.web3Service.saveAccountsInLocalDB(newAccount, this.authenticationService.password);
    //add in display and save
    var newItem = new AccountDetails();
    newItem.address = newAccount.address;
    newItem.index = this.globalService.accounts.length;
    this.globalService.accounts.push(newItem);
    this.localStorageService.saveDisplayAccountsInLocalDB(this.globalService.accounts, this.authenticationService.password);
    // set selected address
    this.changeAccount(this.globalService.accounts[this.globalService.accounts.length - 1]);

  }

  public registerUser(pwd: string): boolean {

    var mnemonic = this.web3Service.generateMnemonic();

    // create a new eth wallet and save it locally
    var blnAccountCreated = this.web3Service.createNewEthAccount(mnemonic, pwd);
    if (blnAccountCreated === false) {
      return false;
    }

    // save mnemonicsS in local storage
    var blnMnemonicsSaved = this.localStorageService.saveMnemonicsInLocalDB(mnemonic, pwd);
    if (blnMnemonicsSaved === false) {
      // this.setUserDeRegisteredAndLoggedOff();
      return false;
    }

    // set properties in authentication service
    this.setUserRegisteredAndLoggedin();

    this.authenticationService.password = pwd;

    this.retrieveAllDisplayAccount();

    this.localStorageService.saveDisplayAccountsInLocalDB(this.globalService.accounts, pwd);

    // this.accountAdded(this.accountList);

    return true;
  }

  public isUserRegistered(): boolean {
    return this.authenticationService.registered;
  }

  public isUserLoggedIn(): boolean {
    return this.authenticationService.loggedIn;
  }

  public doesUserHaveAccounts(): boolean {
    return (this.web3Service.accounts.length > 0);
  }

  private setUserRegisteredAndLoggedin() {
    this.authenticationService.loggedIn = true;
    this.authenticationService.registered = true;
  }

  private setUserDeRegisteredAndLoggedOff() {
    this.authenticationService.loggedIn = false;
    this.authenticationService.registered = false;
  }

  public loginUser(pwd: string): boolean {
    console.log("this.web3Service.retrieveAllAccount() : ",this.web3Service.retrieveAllAccount(pwd));
    var accounts = this.localStorageService.retrieveDisplayAccountsFromLocalDB(pwd);
    if (accounts === null || accounts.length === 0) {
      return false
    }

    this.globalService.accounts = accounts;
    this.changeAccount(this.globalService.accounts[0]);

    // this.accountAdded(this.accountList);
    this.authenticationService.password = pwd;
    this.authenticationService.loggedIn = true;
    return true;
  }

  private DecryptAccountList(encryptedAccountList: string, pwd: string): Array<Account> {
    try {
      var accountList = new Array<Account>();

      var decrypted = CryptoJS.AES.decrypt(encryptedAccountList, pwd).toString(CryptoJS.enc.Utf8);
      accountList = JSON.parse(decrypted);

      return accountList;
    } catch (error) {
      return null;
    }
  }

  public retrieveAccountFromPrivateKey(key: string): boolean {

    var account = this.web3Service.retrieveAccountFromPrivateKey(key);

    var accountList = this.localStorageService.retrieveDisplayAccountsFromLocalDB(this.authenticationService.password);

    //check if key already exist; if yes then return
    if (this.globalService.accounts.findIndex(a => a.address === account.address) != -1) {
      return false;
    }

    //add account in wallet and save
    this.addAccount(account);

    return true;
  }

  public retrieveAllDisplayAccount() {
    var wallet = this.web3Service.retrieveAllAccount(this.authenticationService.password);

    for (var _i = 0; _i < wallet.length; _i++) {
      var newItem = new AccountDetails();
      newItem.address = wallet[_i].address;
      newItem.index = _i;
      this.globalService.accounts.push(newItem);
    }
    this.changeAccount(this.globalService.accounts[0])
  }

  public async buyKusCoin(amountInEther: number) {
    this.web3Service.signTransactionLocally(amountInEther, this.globalService.selectedAccount);
  }

  public async sendEther( toAddress: string, amountInEther: number, gasPrice: number, gasLimit: number) {
    this.web3Service.sendEther(this.globalService.selectedAccount,toAddress,amountInEther,gasPrice,gasLimit);
  }

}
