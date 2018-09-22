import {createServer} from "http";
import { inject } from "inversify";
import "rxjs/add/observable/from";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/retry";
import { Observable } from "rxjs/Observable";
import { fromEvent } from "rxjs/observable/fromEvent";
import { Subject } from "rxjs/Subject";
import {URL} from "url";
import TYPES from "../../injections/Injections";
import { ILogger } from "../../utils/Logger";
import { IConfigService } from "../ConfigService";

export class Server {
    constructor(private _config: IConfigService, private _logger: ILogger) {}

    public listen() {
        const server = createServer();
        const listenMessage = `listen on port ${this._config.SERVER_PORT_NUMBER}`;
        server.listen(this._config.SERVER_PORT_NUMBER, () => this._logger.log("info", listenMessage, "server") );

        return fromEvent(server, "request", Array.of).map(([request, response]) => {
            this._logger.log("info", `reques recieved`);
            const currentUrl = new URL(`http://localhost:${this._config.SERVER_PORT_NUMBER}${request.url}`);

            const accessError = currentUrl.searchParams.get(`error`);
            if (accessError) {
                this._logger.log("error", new Error(accessError));
                this._responseCall(response, "ERROR");
                return new Error(accessError);
            }

            const code = currentUrl.searchParams.get(`code`) || `NO_CODE_PRESENT`;
            if (code === `NO_CODE_PRESENT`) {
                this._logger.log("error", new Error(`code not presnet`));
                this._responseCall(response, "ERROR");
                return new Error(code);
            }
            this._responseCall(response, "OK");
            return code;
        }).retry();

    }

    private _responseCall(response, status: string) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify({res: status}));
    }
}
