import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Account } from 'web3/types';
import { AccountDetails } from '../models/account-balance';

@Injectable()
export class LocalStorageService {

  constructor() { }

  public retrieveDisplayAccountsFromLocalDB(pwd: string): Array<AccountDetails> {
    try {
      var accountList = new Array<AccountDetails>();

      if (localStorage.length > 0 && localStorage.getItem("DisplayAccounts") != null) {
        var localAccounts = localStorage.getItem("DisplayAccounts");
        var decrypted = CryptoJS.AES.decrypt(localAccounts, pwd).toString(CryptoJS.enc.Utf8);
        accountList = JSON.parse(decrypted);

        return accountList;
      }
    } catch (error) {
      return null;
    }
  }

  public saveDisplayAccountsInLocalDB(accounts: Array<AccountDetails>, pwd: string): boolean {
    try {
      var encrypted = CryptoJS.AES.encrypt(JSON.stringify(accounts), pwd);
      localStorage.setItem("DisplayAccounts", encrypted);
    } catch (error) {
      return false;
    }
    return true;
  }

  public saveMnemonicsInLocalDB(mnemonics: string, pwd: string): boolean {
    try {
      var encrypted = CryptoJS.AES.encrypt(mnemonics, pwd);

      localStorage.setItem("Mnemonics", encrypted);
    } catch (error) {
      return false;
    }
    return true;
  }

  public retrieveMnemonicsFromLocalDB(pwd: string): string {
    try {
      if (localStorage.length > 0 && localStorage.getItem("Mnemonics") != null) {
        var encryptedMnemonics = localStorage.getItem("Mnemonics");

        var decryptedMnemonics = CryptoJS.AES.decrypt(encryptedMnemonics, pwd).toString(CryptoJS.enc.Utf8);

        return decryptedMnemonics;
      }
    } catch (error) {
      return null;
    }
  }


}
