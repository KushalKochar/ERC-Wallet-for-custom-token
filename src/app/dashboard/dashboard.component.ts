import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';
import { Subscription } from 'rxjs';
import { AccountBalance } from '../shared/models/account-balance';
import Utils from '../shared/utils/utils';
import { WalletService } from '../shared/servcies/wallet.service';
import { GlobalService } from '../shared/servcies/global.service';
import * as QRCode from 'qrcode';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {

  subscription: Subscription;
  dashboardTableDetails: AccountBalance[];

  constructor(private web3Service: Web3Service,
    private walletService: WalletService,
    private globalService: GlobalService) {

    this.dashboardTableDetails = new Array<AccountBalance>();
    this.addAccountBalance("Ethereum", "ETH");
    this.addAccountBalance("KusCoin", "KUS");
    this.refreshBalance(this.globalService.selectedAccount.address);

    this.subscription = this.walletService.accountChanged$.subscribe(
      account => {
        //reffresh balance
        this.refreshBalance(account.address);
      });
  }

  private addAccountBalance(name: string, symbol: string) {
    var coin = new AccountBalance();
    coin.coinName = name;
    coin.symbol = symbol;
    this.dashboardTableDetails.push(coin);
  }

  private async refreshBalance(address: string) {

    // QRCode.toDataURL(address)
    //   .then(url => {
    //     console.log(url)
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })

    // QRCode.toCanvas(document.getElementById('canvas'), address, function (error) {
    //   if (error) console.error(error)
    //   console.log('success!');
    // })

    this.web3Service.getEtherBalanceForAccount(address)
      .then(data => {
        this.dashboardTableDetails[0].balance = Utils.roundValueTillTwoDecimal(data);
      })
      .catch(function (err: Error) {
        this.dashboardTableDetails[0].balance = 0;
      });

    this.web3Service.getKusCoinBalanceForAccount(address)
      .then(data => {
        this.dashboardTableDetails[1].balance = Utils.roundValueTillTwoDecimal(data);
      })
      .catch(function (err: Error) {
        this.dashboardTableDetails[1].balance = 0;
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
