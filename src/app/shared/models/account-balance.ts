import { Account } from 'web3/types';

export class AccountBalance {
    public symbol : string = "";
    public coinName : String = "";
    public balance : number = 0;
}


export class AccountDetails {
    public address : string = "";
    public name : String = "";
    public imported : boolean = false;
    public index : number = 0;
}
