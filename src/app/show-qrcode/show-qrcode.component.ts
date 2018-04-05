import { Component, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';
import * as QRScanner from 'qr-code-scanner';
import { GlobalService } from '../shared/servcies/global.service';
import { Subscription } from 'rxjs';
import { WalletService } from '../shared/servcies/wallet.service';


@Component({
  selector: 'app-show-qrcode',
  templateUrl: './show-qrcode.component.html',
  styleUrls: ['./show-qrcode.component.css']
})
export class ShowQrcodeComponent implements OnInit {

  subscription: Subscription;

  constructor(private globalService: GlobalService,
    private walletService: WalletService) {
    this.subscription = this.walletService.accountChanged$.subscribe(
      account => {
        //reffresh balance
        this.showQRCode();
      });
  }

  ngOnInit() {
    this.showQRCode();
  }

  scanQRCode() {
    QRScanner.initiate({
      // match: /^[a-zA-Z0-9]{16,18}$/, // optional 
      onResult: function (result) { console.info('DONE: ', result); },
      onError: function (err) { console.error('ERR :::: ', err); }, // optional 
      onTimeout: function () { console.warn('TIMEDOUT'); } // optional 
    });
  }

  showQRCode() {
    QRCode.toCanvas(document.getElementById('canvas'), this.globalService.selectedAccount.address, function (error) {
      if (error) console.error(error)
      console.log('success!');
    });
  }

}
