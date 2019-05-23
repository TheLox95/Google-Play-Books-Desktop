import { app, BrowserWindow, remote } from "electron";
import {google} from "googleapis";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Observable } from "rxjs/Observable";
import { IServer } from ".";
import { IConfigService } from "../";
import { TYPES } from "../../injections";

@injectable()
export class LoginService implements ILoginService {

    private _loginWindow: BrowserWindow;

    constructor(
        @inject(TYPES.IServer) private _server: IServer,
        @inject(TYPES.IConfigService) private _config: IConfigService,
        ) {}

    public saveToken(code) {
        const oauth2Client = this._config.OAUTH_CLIENT;
        return oauth2Client.getToken(code)
        .then((tokens) => {
          localStorage.setItem("credentials", JSON.stringify(tokens.tokens));
          this._loginWindow.close();
          return true;
        });
    }

    public appNeedsLogin() {
        if (localStorage.getItem("credentials") !== null) {
            return false;
        }
        return true;
    }

    public listenUserLogin() {
        this._loginWindow = new remote.BrowserWindow({ width: 1000, height: 1000, title: "Google Play Books Desktop"});
        this._loginWindow.setMenu(null);
        this._loginWindow.webContents.openDevTools();
        this._loginWindow.loadURL(this._config.OAUTH_URL);

        return this._server.listen();
    }
}

export interface ILoginService {
    appNeedsLogin: () => boolean;
    listenUserLogin: () => Observable<string>;
    saveToken: (code: string) => Promise<boolean>;
}
