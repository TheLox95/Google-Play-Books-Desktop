import { resolve } from "dns";
import { injectable } from "inversify";
import "rxjs/add/operator/catch";
import 'rxjs/add/Observable/throw';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { AppError } from "../utils/Error";
import { ErrorCode } from "../utils/ErrorCodes";

@injectable()
export class ConnectivityService implements IConnectivityService {

  private _subject = new Subject<boolean>();

  constructor() {
    const root = this;
    setInterval(function job() {
      root.getConnectionStatus()
      .then((s) => root._subject.next(s))
      .catch((err) => {
        const e = new AppError({
          message: err.toString(),
          code: ErrorCode.UNKNOWN_ERROR,
        });
        root._subject.error(e);
      });
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
    return this._subject.asObservable()
    .catch((e: any) => Observable.throw(e));
  }
}

export interface IConnectivityService {
  getConnectionStatus(): Promise<boolean>;
  observeConnection(): Observable<boolean>;
}
