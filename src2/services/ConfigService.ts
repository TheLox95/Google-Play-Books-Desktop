import {app, remote} from "electron";
import { injectable } from "inversify";
import { join } from "path";
import "reflect-metadata";
import { LOCAL_PORT } from "./../utils/Credential";

@injectable()
export class ConfigService implements IConfigService {
    private _app: Electron.App = app || remote.app;
    private readonly DIRECTORY = "documents";
    private readonly FOLDER_NAME = "GooglePlayBooks";

    get APP_PATH() {
        return this._app.getAppPath();
    }

    get BOOKS_FOLDER_ROUTE() {
        return join(this._app.getPath(this.DIRECTORY), this.FOLDER_NAME);
    }

    get API_URL() {
        return join("", `GooglePlayBooks`);
    }

    get SERVER_PORT_NUMBER() {
        return LOCAL_PORT;
    }
}

export interface IConfigService {
    readonly BOOKS_FOLDER_ROUTE: string;
    readonly APP_PATH: string;
    readonly API_URL: string;
    readonly SERVER_PORT_NUMBER: number;
}
