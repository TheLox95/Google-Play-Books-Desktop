import {google} from "googleapis";
import { inject } from "inversify";
import "reflect-metadata";
import { IServer } from ".";
import {TYPES} from "../../injections";
import { CLIENT_ID, CLIENT_SECRET, LOCAL_SERVER, SCOPE } from "../../utils/Credential";

export class LoginService {

    private _oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        LOCAL_SERVER,
      );

    private _scopes = [
        SCOPE,
    ];

    constructor(
        @inject(TYPES.IServer) private _server: IServer) {}

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
