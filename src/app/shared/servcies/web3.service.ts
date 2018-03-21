import { Injectable, ErrorHandler } from '@angular/core';
import { CanActivate } from '@angular/router';
import Web3 from 'web3';
import { default as contract } from 'truffle-contract';
import kuscoin_artifacts from '../../../../build/contracts/KusCoin.json';
import { Subject } from 'rxjs/Rx';
import { Account } from 'web3/types';
import Utils from '../utils/utils';
import { Observable } from 'rxjs/Observable';
import { throws } from 'assert';
import * as CryptoJS from 'crypto-js';
import * as Tx from 'ethereumjs-tx';
import { environment } from '../../../environments/environment';
import { FirebaseService } from './firebase.service';
import { ActivityLog } from '../models/activity-log';
import { AlertComponent } from '../../alert-dialogbox.component';
import { DialogService } from 'ng2-bootstrap-modal';

declare let window: any;
declare const Buffer;

@Injectable()
export class Web3Service implements CanActivate {
  private web3: Web3;
  public accounts: Array<Account> = [];
  public selectedAccount: Account;
  public ready = false;
  public KusCoin: any;
  public accountChangedObservable = new Subject<Account>();

  accountChanged$ = this.accountChangedObservable.asObservable();

  // using this to prevent access to other tabs if user doesn't have any imported key
  canActivate() {
    if (this.accounts.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  // Service message commands
  changeAccount(account: Account) {
    this.selectedAccount = account;
    this.accountChangedObservable.next(account);
  }

  constructor(private firebaseService: FirebaseService, private dialogService: DialogService) {

    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();

      this.artifactsToContract(kuscoin_artifacts)
        .then((KusCoinAbstraction) => {
          this.KusCoin = KusCoinAbstraction;
        });

      this.retrieveAccountsFromLocalDB();

    });
  }

  public bootstrapWeb3() {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

    this.web3 = new Web3(new Web3.providers.HttpProvider(environment.networkURL));
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  public async buyKusCoin(amountInEther: number) {
    this.signTransactionLocally(amountInEther);
  }

  public async signTransactionLocally(amountInEther: number) {
    const contractAddress = await this.KusCoin.deployed();
    const nonce_available = await this.web3.eth.getTransactionCount(this.selectedAccount.address, "latest");
    const gas_price = await this.web3.eth.getGasPrice();

    console.log("gas price : ", gas_price);

    var privateKeyBuffer = new Buffer(this.selectedAccount.privateKey.slice(2), 'hex')
    var rawTx = {
      nonce: nonce_available,
      gasPrice: gas_price / 100, // keeping it 10 times more for faster response
      gasLimit: environment.gasLimit,// This parameter can be retrieved from network to get estimate
      to: contractAddress.address,
      value: Utils.convertEtherToWei(amountInEther),
      data: '0x0'
    }
    var tx = new Tx(rawTx);
    tx.sign(privateKeyBuffer);
    var serializedTx = tx.serialize();

    var log = new ActivityLog();
    log.address = this.selectedAccount.address;

    var firebase = this.firebaseService;
    var dialog = this.dialogService;

    this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', function (hash) {
        log.transactionHash = hash;
        firebase.logBoughtKusCoinTransaction(log);
        dialog.addDialog(AlertComponent, { title: 'Ethereum wallet - Alert', message: "Request for buying KusCoin is  under process and might take some time depending on the network." });
      });

  }

  public async refreshKusCoinBalance() {
    const deployedKusCoin = await this.KusCoin.deployed();
    const KusCoinBalance = await deployedKusCoin.balanceOf.call(this.selectedAccount.address);
    return Utils.convertPriToKus(KusCoinBalance);
  }

  public async refreshEtherBalance() {
    const BalanceInWei = await this.web3.eth.getBalance(this.selectedAccount.address, "latest");
    return Utils.convertWeiToEther(BalanceInWei);
  }

  public retrieveAccountFromPrivateKey(key: string) {
    var account = this.web3.eth.accounts.privateKeyToAccount(key);
    this.retrieveAccountsFromLocalDB();
    this.saveAccountsInLocalDB(account);

    this.selectedAccount = account;

    this.changeAccount(this.selectedAccount);
  }

  private saveAccountsInLocalDB(accountToAdd: Account) {
    this.accounts.push(accountToAdd);
    // Ideally this secret passphrase, we can ask from User as a login/password
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.accounts), "getPasswordFromUser");
    localStorage.setItem("accounts", encrypted);
  }

  public retrieveAllAccount() {
    this.retrieveAccountsFromLocalDB();
  }

  private retrieveAccountsFromLocalDB() {
    this.accounts = new Array<Account>();
    if (localStorage.length > 0 && localStorage.getItem("accounts") != null) {

      var localAccounts = localStorage.getItem("accounts");

      var decrypted = CryptoJS.AES.decrypt(localAccounts, "getPasswordFromUser").toString(CryptoJS.enc.Utf8);

      this.accounts = JSON.parse(decrypted);
      this.selectedAccount = this.accounts[0];
    }
  }

}
