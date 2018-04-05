import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';
import { LoaderService } from '../shared/servcies/loader.service';
import { WalletService } from '../shared/servcies/wallet.service';

@Component({
  selector: 'app-send-eth',
  templateUrl: './send-eth.component.html',
  styleUrls: ['./send-eth.component.css']
})
export class SendEthComponent implements OnInit {

  public toAddress : string;
  public amountInEther : number;
  public gasPrice : number;
  public gasLimit : number;

  constructor(private web3Service: Web3Service, private loaderService: LoaderService,
    private walletService : WalletService) {
      this.web3Service.getGasDetails().then(data => {
        this.gasPrice = data;
      });
     }

  ngOnInit() {
  }

  sendEther(){
    this.loaderService.display(true);
    this.walletService.sendEther(this.toAddress,this.amountInEther,this.gasPrice,this.gasLimit);
  }

}
