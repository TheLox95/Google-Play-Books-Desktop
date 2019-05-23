import * as gApi from "googleapis";
import { IncomingMessage } from "http";
import { injectable } from "inversify";
import { inject } from "inversify";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { Book } from "../entities/Book";
import { TYPES } from "../injections";
import { IDonwloadProgress, IHttp } from "../utils/Http";
import { IConfigService } from "./ConfigService";
import { IFileService } from "./FileService";
import { IServer } from "./login";

export interface IBookService {
    donwload(book: Book): Observable<IDonwloadProgress>;
    getAll(index?: number): Promise<Book[]>;
}

@injectable()
export class BookService implements IBookService {
    private _progress: IDonwloadProgress = {size: 0, soFar: 0};
    private _filetype = "";
    private _oauth2Client;
    private _ammoItemsPerCall = 10;

    constructor(
        @inject(TYPES.IHttp) private _http: IHttp,
        @inject(TYPES.IConfigService) private _config: IConfigService,
        @inject(TYPES.IFileService) private _fileService: IFileService) {
            this._oauth2Client = new gApi.google.auth.OAuth2(
                this._config.CLIENT_ID,
                this._config.CLIENT_SECRET,
                this._config.CALLBACK_LOGIN_URL,
              );
            const credentials = _config.USER_CREDENTIALS;
            this._oauth2Client.setCredentials(credentials);
        }

    public async getAll(index: number = 0): Promise<Book[]> {
        const apis = new gApi.GoogleApis();
        const b = new gApi.books_v1.Books({}, apis);
        const r = new gApi.books_v1.Resource$Volumes$Useruploaded(b);
        const a = await r.list({
            auth: this._oauth2Client,
            startIndex: index * this._ammoItemsPerCall,
        });
        return Book.fromGoogleApiRes(a.data.items);
    }

    public donwload(book: Book): Observable<IDonwloadProgress> {

        return Observable.create( async (observer: Subscriber<{}>) => {
            const request = await this._http.getFile(book.downloadUrl.toString());

            request.subscribe((e) => console.log(e));

        });

    }
}
