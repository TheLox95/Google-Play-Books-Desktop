import { app, remote } from "electron";
import * as gApi from "googleapis";
import { inject, injectable } from "inversify";
import { join } from "path";
import "reflect-metadata";
import { TYPES } from "../injections";
import { LOCAL_PORT } from "../utils/Credential";
import { IServer } from "./login";
import { OauthClient } from "./OauthClient";

@injectable()
export class ConfigService implements IConfigService {
    private _app: Electron.App = app || remote.app;
    private readonly DIRECTORY = "documents";
    private readonly FOLDER_NAME = "GooglePlayBooks";

    get APP() {
        return this._app;
    }

    get APP_PATH() {
        return this._app.getAppPath();
    }

    get BOOKS_FOLDER_ROUTE() {
        return join(this._app.getPath(this.DIRECTORY), this.FOLDER_NAME);
    }

    get SERVER_PORT_NUMBER() {
        return LOCAL_PORT;
    }

    get CALLBACK_LOGIN_URL() {
        return `http://localhost:${LOCAL_PORT}`;
    }

    get CLIENT_ID() {
         return "309811375351-bdn7uctom5ukq2q947jfjru4nb294pfv.apps.googleusercontent.com";
    }

    get CLIENT_SECRET() {
         return "3aPH74bY6OQhaIxkHvcfrhiE";
    }

    get GOOGLE_SCOPES() {
        return ["https://www.googleapis.com/auth/books"];
    }

    get USER_CREDENTIALS() {
        const c = localStorage.getItem("credentials");
        if (c) {
            return JSON.parse(c);
        }
        return {};
    }

    get OAUTH_CLIENT() {
        return new OauthClient(
            this.CLIENT_ID,
            this.CLIENT_SECRET,
            this.CALLBACK_LOGIN_URL,
          );
    }

    get OAUTH_URL() {
        return this.OAUTH_CLIENT.generateAuthUrl({
            access_type: "offline",
            scope: this.GOOGLE_SCOPES,
          });
    }
}

export interface IConfigService {
    readonly BOOKS_FOLDER_ROUTE: string;
    readonly APP: Electron.App;
    readonly APP_PATH: string;
    readonly CLIENT_ID: string;
    readonly CLIENT_SECRET: string;
    readonly CALLBACK_LOGIN_URL: string;
    readonly GOOGLE_SCOPES: string[];
    readonly USER_CREDENTIALS: {[v: string]: string};
    readonly SERVER_PORT_NUMBER: number;
    readonly OAUTH_URL: string;
    readonly OAUTH_CLIENT: OauthClient;
}
