import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';
import { Subscription } from 'rxjs';
import { AccountBalance } from '../shared/models/account-balance';
import Utils from '../shared/utils/utils';
import { WalletService } from '../shared/servcies/wallet.service';
import { GlobalService } from '../shared/servcies/global.service';
import * as QRCode from 'qrcode';
import { ActivityLog } from '../shared/models/activity-log';
import { LocalStorageService } from '../shared/servcies/local-storage.service';
import { AuthenticationService } from '../shared/servcies/authentication.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})

export class TransactionHistoryComponent implements OnDestroy {

  subscription: Subscription;
  dashboardTableDetails: ActivityLog[];

  constructor(private web3Service: Web3Service,
    private walletService: WalletService,
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService) {

    this.dashboardTableDetails = new Array<ActivityLog>();
    this.refreshBalance(this.globalService.selectedAccount.address);

    this.subscription = this.walletService.accountChanged$.subscribe(
      account => {
        //reffresh balance
        this.refreshBalance(account.address);
      });
  }

  private async refreshBalance(address: string) {

    this.dashboardTableDetails = this.localStorageService.retrieveTransactionForAddressFromLocalDB(address, this.authenticationService.password);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
