
export class ActivityLog {
    public timeStamp : number = new Date().valueOf(); // Will just use this for sorting
    public transactionHash : String = "";
    public address : String = "";
}
