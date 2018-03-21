import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { ActivityLog } from '../models/activity-log';

@Injectable()
export class FirebaseService {

  constructor(private fbDB: AngularFireDatabase) { }

  public logBoughtKusCoinTransaction(log: ActivityLog) {
    var teee = this.fbDB.object<any>("boughtKusCoin/" + log.timeStamp).set(log);
  }

}
