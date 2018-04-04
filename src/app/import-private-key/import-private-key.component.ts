import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../shared/servcies/web3.service';
import { AlertComponent } from '../alert-dialogbox.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { WalletService } from '../shared/servcies/wallet.service';

@Component({
  selector: 'app-import-private-key',
  templateUrl: './import-private-key.component.html',
  styleUrls: ['./import-private-key.component.css']
})
export class ImportPrivateKeyComponent implements OnInit {

  public privateKey: string;

  constructor(private web3Service: Web3Service,
    private dialogService: DialogService,
    private walletService: WalletService) { }

  ngOnInit() {
  }

  importPrivateKey() {
    if (this.walletService.retrieveAccountFromPrivateKey(this.privateKey)) {
      this.dialogService.addDialog(AlertComponent, { title: 'Ethereum wallet - Alert', message: "Successfully imported private key and stored in LOCALSTORAGE in encrypted form!" });
      this.privateKey = null;
    } else {
      this.dialogService.addDialog(AlertComponent, { title: 'Ethereum wallet - Alert', message: "Private key already imported and exist under the dropdown!" });
    }

  }

}
