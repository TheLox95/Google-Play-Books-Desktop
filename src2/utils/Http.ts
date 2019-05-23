import * as electron from "electron";
import * as axios from "axios";
import { createWriteStream, WriteStream, unlink } from "fs";
import { injectable } from "inversify";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { Readable } from "stream";
import { HttpError } from "./HttpError";
import { TYPES } from "../injections";
import { inject } from "inversify";
import { IConfigService, OauthClient } from "../services";
import * as request from 'request';

@injectable()
export class Http implements IHttp {
    private net: electron.Net | null = null;

    constructor(
        @inject(TYPES.IConfigService) private _config: IConfigService,
    ) {
        this._config.APP.on("ready", () => {
            this.net = electron.net;
        });
    }
    public async getFile(url: string) {
        const tokens = this._config.USER_CREDENTIALS;
        console.log(url);
        console.log(tokens);

        request("http://books.google.co.ve/books/download/Libro_7_La_dama_del_lago_Andrzej_Sapkows?id=6H8pIwAAAEAJ&hl=&output=uploaded_content&source=gbs_api")
            .pipe(createWriteStream("./file.html"));

        return Promise.resolve((new Subject()).asObservable());

        /*return axios.default({
            method: "GET",
            maxRedirects: 0,
            headers: {
                "Authorization": `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/octet-stream',
            },
            url,
            responseType: "stream",
          })*/
        /*const client = new OauthClient();
        client.setCredentials(tokens);
        return client.request<any>({
            url: `${url}?access_token=${tokens.access_token}`,
        })
        .then((response) => {
            return response.data.pipe(createWriteStream('./ada_lovelace.html'))
        })
        .catch(err => console.log(err));*/
    }

    public async get(url: string) {
        return fetch(url)
        .then((res) => res.json());
    }
}

export interface IHttp {
    getFile( url: string): Promise<Observable<any>>;
    get(url: string): Promise<any>;
}

export interface IDonwloadProgress {
    size: number;
    soFar: number;
}
