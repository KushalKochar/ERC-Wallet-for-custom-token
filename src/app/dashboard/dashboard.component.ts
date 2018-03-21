import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';
import { Subscription } from 'rxjs';
import { AccountBalance } from '../shared/models/account-balance';
import Utils from '../shared/utils/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {

  subscription: Subscription;
  dashboardTableDetails : AccountBalance[];

  constructor(private web3Service: Web3Service) {

    this.dashboardTableDetails = new Array<AccountBalance>();
    this.addAccountBalance("Ethereum","ETH");
    this.addAccountBalance("KusCoin","KUS");
    this.refreshBalance();

    this.subscription = this.web3Service.accountChanged$.subscribe(
      account => {
        //reffresh balance
        this.refreshBalance();
      });
  }

  private addAccountBalance(name: string, symbol: string){
    var coin = new AccountBalance();
    coin.coinName = name;
    coin.symbol = symbol;
    this.dashboardTableDetails.push(coin);
  }

  private refreshBalance() {
    
    this.web3Service.refreshEtherBalance()
      .then(data => {
        this.dashboardTableDetails[0].balance = Utils.roundValueTillTwoDecimal(data);
      })
      .catch(function (err: Error) {
        // console.log('error while fetching ether balance: ', err);
      });

    this.web3Service.refreshKusCoinBalance()
      .then(data => {
        this.dashboardTableDetails[1].balance = Utils.roundValueTillTwoDecimal(data);
      })
      .catch(function (err: Error) {
        // console.log('error while fetching KusCoin balance: ', err);
        // this.dashboardTableDetails[1].balance = 0;
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
