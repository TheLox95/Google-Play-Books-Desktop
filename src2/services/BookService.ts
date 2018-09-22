import { IncomingMessage } from "http";
import { inject } from "inversify";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { Book } from "../entities/Book";
import { TYPES } from "../injections";
import { IDonwloadProgress, IHttp } from "../utils/Http";
import { IConfigService } from "./ConfigService";
import { IFileService } from "./FileService";

export interface IBookService {
    donwload(book: Book): Observable<IDonwloadProgress>;
}

export class BookService implements IBookService {
    private _progress: IDonwloadProgress = {size: 0, soFar: 0};
    private _filetype = "";

    constructor(
        private _http: IHttp,
        @inject(TYPES.IConfigService) private _config: IConfigService,
        @inject(TYPES.IFileService) private _fileService: IFileService) {}

    public async getAll(index: number = 0): Promise<Book[]> {
        const response = await this._http.get(this._config.API_URL);
        return Book.fromGoogleApiRes(response);
    }

    public donwload(book: Book): Observable<IDonwloadProgress> {

        return Observable.create( async (observer: Subscriber<{}>) => {
            const request = await this._http.getFile(book.downloadUrl.toString());

            request.on("response", (data: IncomingMessage) => {
                this._progress.size = parseInt(data.headers["content-length"], undefined);
                this._filetype = data.headers["content-type"].split(`/`)[1];
            });

            request.on("data", (chunk: Buffer) => {
                this._progress.soFar += chunk.length;
                let soFar = this._progress.soFar;
                soFar--;
                observer.next({soFar, size: this._progress.size});
            });

            request.on("complete", async () => {
                const fileName = `${book.title}.${book.type}`;
                try {
                    const saved = await this._fileService.save({data: this._progress.soFar, fileName});

                    observer.next(this._progress);
                    observer.complete();
                } catch (error) {
                    observer.error(error);
                }
            });

            request.on("error", (err: Error) => {
                observer.error(err);
            });

        });

    }
}
