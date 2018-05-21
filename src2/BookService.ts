import { createWriteStream} from "fs";
import { IncomingMessage } from "http";
import { inject, injectable } from "inversify";
import { join} from "path";
import { get } from "request";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { Url } from "url";
import { IConfigService } from "./ConfigService";
import { Book } from "./entities/Book";
import TYPES from "./injections/Injections";

export interface IDonwloadProgress {
    size: number;
    soFar: number;
}

export interface IHttp {
    getFile( url: string): Promise<IStreamEvent>;
}

interface IStreamEvent {
    on(event: "response", fn: (message: IncomingMessage) => void): this;
    on(event: "data", fn: (buffer: Buffer) => void): this;
    on(event: "error", fn: (err: Error) => void): this;
    on(event: "complete", fn: () => void): this;
    pipe<WritableStream>(stream: WritableStream): this;
}

export interface IBookService {
    donwload(book: Book): Observable<IDonwloadProgress>;
}

export class BookService implements IBookService {
    private _progress: IDonwloadProgress = {size: 0, soFar: 0};
    private _filetype = "";

    constructor(
        private _http: IHttp,
        @inject(TYPES.IConfigService) private _config: IConfigService) {}

    public donwload(book: Book): Observable<IDonwloadProgress> {

        return Observable.create( async (observer: Subscriber<{}>) => {
            const request = await this._http.getFile(book.downloadUrl.toString());

            request.on("response", (data: IncomingMessage) => {
                this._progress.size = parseInt(data.headers["content-length"], undefined);
                this._filetype = data.headers["content-type"].split(`/`)[1];
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

            // request.pipe(this._getFileStream(book));
        });

    }

    private _getFileStream(book: Book) {
        return createWriteStream(join(this._config.BOOKS_FOLDER_ROUTE, `${book.title}.${this._filetype}`));
    }

}
