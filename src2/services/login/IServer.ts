import { Observable } from "rxjs/Observable";
export interface IServer {
    listen(): Observable<string>;
}
