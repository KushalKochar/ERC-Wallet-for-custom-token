import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';
import { LoaderService } from '../shared/servcies/loader.service';
import { WalletService } from '../shared/servcies/wallet.service';

@Component({
  selector: 'app-buy-kuscoin',
  templateUrl: './buy-kuscoin.component.html',
  styleUrls: ['./buy-kuscoin.component.css']
})
export class BuyKuscoinComponent implements OnInit {

  public selectedAmountInEther: number = 0;

  constructor(private web3Service: Web3Service, private loaderService: LoaderService,
  private walletService : WalletService) { }

  ngOnInit() {
  }

  public buyKusCoin() {
    this.loaderService.display(true);
    this.walletService.buyKusCoin(this.selectedAmountInEther);
    // this.web3Service.buyKusCoin(this.selectedAmountInEther);
  }

}
