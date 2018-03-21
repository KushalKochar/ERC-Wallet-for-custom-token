import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';

@Component({
  selector: 'app-buy-kuscoin',
  templateUrl: './buy-kuscoin.component.html',
  styleUrls: ['./buy-kuscoin.component.css']
})
export class BuyKuscoinComponent implements OnInit {

  public selectedAmountInEther: number = 0;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
  }

  public buyKusCoin() {
    this.web3Service.buyKusCoin(this.selectedAmountInEther);
  }

}
