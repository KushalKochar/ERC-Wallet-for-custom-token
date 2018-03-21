import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public web3: Web3Service;

  constructor(private web3Service: Web3Service) {
    this.web3 = web3Service;
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
    this.web3Service.changeAccount(this.web3.selectedAccount);
  }

}
