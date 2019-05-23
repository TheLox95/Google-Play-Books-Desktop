import { resolve } from "dns";
import { injectable } from "inversify";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@injectable()
export class ConnectivityService implements IConnectivityService {

  private _subject = new Subject<boolean>();

  constructor() {
    const root = this;
    setInterval(function job() {
      root.getConnectionStatus()
      .then((s) => root._subject.next(s));
    }, 5 * 1000);
  }

  public getConnectionStatus() {
    return new Promise<boolean>((resolvePromise) => {
      resolve("www.google.com", (err) => {
        if (err) {
          resolvePromise(false);
        } else {
          resolvePromise(true);
        }
      });
    });
  }

  public observeConnection() {
    return this._subject.asObservable();
  }
}

export interface IConnectivityService {
  getConnectionStatus(): Promise<boolean>;
  observeConnection(): Observable<boolean>;
}
