import { Injectable, ErrorHandler } from '@angular/core';
import { CanActivate } from '@angular/router';
import Web3 from 'web3';
import { default as contract } from 'truffle-contract';
import kuscoin_artifacts from '../../../../build/contracts/KusCoin.json';
import { Subject, Subscription } from 'rxjs/Rx';
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
import { LoaderService } from './loader.service';
import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from './local-storage.service';
import * as EthWallet from 'ethereumjs-wallet/hdkey';
import * as BIP39 from 'bip39';
import * as ethUtil from 'ethereumjs-util';
import { AccountDetails } from '../models/account-balance';

declare let window: any;
declare const Buffer;

@Injectable()
export class Web3Service implements CanActivate {
  private web3: Web3;
  public accounts: Array<Account> = [];
  public selectedAccount: Account;
  public ready = false;
  public KusCoin: any;
  // public password: string;
  subscription: Subscription;
  public accountChangedObservable = new Subject<Account>();

  accountChanged$ = this.accountChangedObservable.asObservable();

  // using this to prevent access to other tabs if user doesn't have any imported key
  canActivate() {
    // return false;
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

  constructor(private firebaseService: FirebaseService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private authService: AuthenticationService,
    private localStorageService: LocalStorageService) {

    // this.subscription = this.authService.authorised$.subscribe(
    //   blnFlag => {
    //     //reffresh balance
    //     // this.refreshBalance();
    //     if(blnFlag){
    //       this.retrieveAccountsFromLocalDB();
    //     }else{
    //       this.accounts = new Array<Account>();
    //       this.selectedAccount = null;
    //     }
    //   });

    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();

      this.artifactsToContract(kuscoin_artifacts)
        .then((KusCoinAbstraction) => {
          this.KusCoin = KusCoinAbstraction;
        });



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

  // public async buyKusCoin(amountInEther: number) {
  //   this.signTransactionLocally(amountInEther);
  // }

  public async signTransactionLocally(amountInEther: number, selectedAccount: AccountDetails) {
    // console.log("Wallet is : ", this.web3.eth.accounts.wallet[selectedAccount.index].privateKey);
    // return;
    const contractAddress = await this.KusCoin.deployed();
    const nonce_available = await this.web3.eth.getTransactionCount(selectedAccount.address, "latest");
    const gas_price = await this.web3.eth.getGasPrice();

    var privateKeyBuffer = new Buffer(this.web3.eth.accounts.wallet[selectedAccount.index].privateKey.toString().slice(2), 'hex');
    var rawTx = {
      nonce: nonce_available,
      gasPrice: gas_price * 10, // keeping it 10 times more for faster response
      gasLimit: environment.gasLimit,
      to: contractAddress.address,
      value: Utils.convertEtherToWei(amountInEther),
      data: '0x0'
    }
    var tx = new Tx(rawTx);
    tx.sign(privateKeyBuffer);
    var serializedTx = tx.serialize();

    var log = new ActivityLog();
    log.address = selectedAccount.address;

    var firebase = this.firebaseService;
    var dialog = this.dialogService;
    var loader = this.loaderService;

    this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', function (hash) {
        loader.display(false);
        log.transactionHash = hash;
        firebase.logBoughtKusCoinTransaction(log);
        dialog.addDialog(AlertComponent, { title: 'Ethereum wallet - Alert', message: "Request for buying KusCoin is  under process and might take some time depending on the network." });
      })
      .catch(reason => {
        loader.display(false);
        dialog.addDialog(AlertComponent, { title: 'Ethereum wallet - Error', message: reason.toString() });
      });

  }

  public async getKusCoinBalanceForAccount(address: string) {
    const deployedKusCoin = await this.KusCoin.deployed();
    const KusCoinBalance = await deployedKusCoin.balanceOf.call(address);
    return Utils.convertPriToKus(KusCoinBalance)
  }

  public async getEtherBalanceForAccount(address: string) {
    const BalanceInWei = await this.web3.eth.getBalance(address, "latest");
    return Utils.convertWeiToEther(BalanceInWei)
  }

  public generateMnemonic(): string {
    var mnemonic = BIP39.generateMnemonic();
    return mnemonic;
  }

  public createNewEthAccount(mnemonic: string,pwd: string): boolean {

    var ethWallet = EthWallet.fromMasterSeed(BIP39.mnemonicToSeed(mnemonic));
    var wallet = ethWallet.derivePath("m/44'/60'/0'/0/0").getWallet();

    var newAccount = this.web3.eth.accounts.privateKeyToAccount(wallet.getPrivateKeyString());

    this.saveAccountsInLocalDB(newAccount,pwd);

    return true;
  }

  public retrieveAccountFromPrivateKey(key: string): Account {
    return this.web3.eth.accounts.privateKeyToAccount(key);
  }

  public saveAccountsInLocalDB(accountToAdd: Account, pwd: string) {
    this.retrieveAccountsFromLocalDB(pwd);
    this.web3.eth.accounts.wallet.add(accountToAdd);
    this.web3.eth.accounts.wallet.save(pwd, "Accounts");
  }

  public retrieveAllAccount(pwd: string): Array<Account> {
    this.accounts = this.retrieveAccountsFromLocalDB(pwd);
    return this.accounts;
  }

  private retrieveAccountsFromLocalDB(pwd: string): Array<Account> {
    this.web3.eth.accounts.wallet.clear();
    return this.web3.eth.accounts.wallet.load(pwd, "Accounts");
  }

  public resetValues() {
    this.accounts = new Array<Account>();
    this.selectedAccount = null;
  }

}
