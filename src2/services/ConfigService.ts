import {app, remote} from "electron";
import { injectable } from "inversify";
import { join } from "path";
import "reflect-metadata";

@injectable()
export class ConfigService implements IConfigService {
    // private _app: Electron.App = app || remote.app;
    get BOOKS_FOLDER_ROUTE() {
        return join("", `GooglePlayBooks`);
    }

    get API_URL() {
        return join("", `GooglePlayBooks`);
    }
}

export interface IConfigService {
    readonly BOOKS_FOLDER_ROUTE: string;
    readonly API_URL: string;
}
