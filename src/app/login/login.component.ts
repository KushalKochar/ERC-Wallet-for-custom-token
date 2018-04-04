import { Component, OnInit } from '@angular/core';
import Utils from '../shared/utils/utils';
import { Web3Service } from '../shared/servcies/web3.service';
import { AuthenticationService } from '../shared/servcies/authentication.service';
import { Router } from '@angular/router';
import { WalletService } from '../shared/servcies/wallet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public password: string;

  constructor(
    private wdb3Service: Web3Service,
    private authService: AuthenticationService,
    private router: Router,
    private walletService: WalletService) {
  }

  login() {
    if (this.walletService.loginUser(this.password)) {
      this.router.navigateByUrl('/app-dashboard');
    } else {
    }
  }

  ngOnInit() {
    if (!this.authService.registered) {
      this.router.navigateByUrl('/app-register');
    } else if (this.authService.loggedIn) {
      this.router.navigateByUrl('/app-dashboard');
    }
  }

}
