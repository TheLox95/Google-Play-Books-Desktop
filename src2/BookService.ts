import { createWriteStream} from "fs";
import { IncomingMessage } from "http";
import { join} from "path";
import { get } from "request";
import "rxjs/add/observable/defer";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { Url } from "url";
import { Book } from "./Book";

export interface IDonwloadProgress {
    size: number;
    soFar: number;
}

export interface IHttp {
    get( url: string): Promise<IStreamEvent>;
}

interface IStreamEvent {
    on(event: "response", fn: (message: IncomingMessage) => void);
    on(event: "data", fn: (buffer: Buffer) => void);
    on(event: "error", fn: (err: Error) => void);
    on(event: "complete", fn: () => void);
}

export class BookService {
    private _outfile = createWriteStream(join("", "title"));
    private _progress: IDonwloadProgress = {size: 0, soFar: 0};

    constructor(private _http: IHttp) {}

    public donwload(url: Url): Observable<IDonwloadProgress> {

        return Observable.create( async (observer: Subscriber<{}>) => {
            const request = await this._http.get(url.toString());

            request.on("response", (data: IncomingMessage) => {
                this._progress.size = parseInt(data.headers["content-length"], undefined);
            });

            request.on("data", (chunk: Buffer) => {
                this._progress.soFar += chunk.length;
                observer.next(this._progress);
            });

            request.on("complete", () => {
                observer.complete();
            });

            request.on("error", (err: Error) => {
                observer.error(err);
            });
        });

    }

}
