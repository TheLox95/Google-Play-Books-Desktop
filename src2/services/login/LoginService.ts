import {google} from "googleapis";
import TYPES from "../../injections/Injections";
import {CONFIG_CONTAINER, ILoggerFactory } from "../../injections/inversify.config";
import { CLIENT_ID, CLIENT_SECRET, LOCAL_SERVER, SCOPE } from "../../utils/Credential";
import { IConfigService } from "./../ConfigService";
import { Server } from "./Server";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IServer } from ".";


export class LoginService {

    constructor(
        @inject(TYPES.IServer) private _server: IServer){}

    private _oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        LOCAL_SERVER,
      );

    private _scopes = [
        SCOPE,
    ];

    public getLoginUrl() {
        return this._oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: "offline",
            // If you only need one scope you can pass it as a string
            scope: this._scopes,
          });
    }

    public listenLoginCallbackCode() {
        return this._server.listen();
    }
}
