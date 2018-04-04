import { Injectable } from '@angular/core';
import { Account } from 'web3/types';
import { AccountDetails } from '../models/account-balance';
import { Subject, Subscription } from 'rxjs/Rx';


@Injectable()
export class GlobalService {

  public accounts: Array<AccountDetails> = [];
  public selectedAccount: AccountDetails;

  public resetValues() {
    this.accounts = new Array<AccountDetails>();
    this.selectedAccount = null;
  }

  constructor() { }

}
