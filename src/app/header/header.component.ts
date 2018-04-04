import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';
import { AuthenticationService } from '../shared/servcies/authentication.service';
import { Router } from '@angular/router';
import { Account } from 'web3/types';
import { GlobalService } from '../shared/servcies/global.service';
import { WalletService } from '../shared/servcies/wallet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public web3: Web3Service;
  public auth: AuthenticationService;
  public global: GlobalService;
  public wallet: WalletService

  constructor(private web3Service: Web3Service,
    private authService: AuthenticationService,
    private router: Router,
    private globalService: GlobalService,
    private walletService: WalletService) {
    this.web3 = web3Service;
    this.auth = authService;
    this.global = globalService;
    this.wallet = walletService;
  }
  logOff() {
    this.web3.resetValues();
    this.authService.logOff();
    this.global.resetValues();
    this.router.navigateByUrl('/app-login');
  }

  ngOnInit() {
  }

  responsiveMenuFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  selectedUserChanged() {
    this.wallet.changeAccount(this.global.selectedAccount);
  }

}
