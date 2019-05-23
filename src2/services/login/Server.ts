import { createServer } from "http";
import { inject, injectable } from "inversify";
import { Subject } from "rxjs/Subject";
import { IServer } from ".";
import TYPES from "../../injections/injections";
import { ILogger } from "../../utils/Logger";
import { IConfigService } from "../ConfigService";

@injectable()
export class Server implements IServer {
    constructor(
        @inject(TYPES.IConfigService) private _config: IConfigService) {}

    public listen() {
        const subject = new Subject<string>();
        const server = createServer();
        const listenMessage = `listen on port ${this._config.SERVER_PORT_NUMBER}`;
        server.listen(this._config.SERVER_PORT_NUMBER, () => console.log("Server listening"));

        server.on("request", (req, res) => {
            res.end();
            if (req.url.includes("/?code=")) {
                subject.next(req.url.replace(`/?code=`, ``).split("&")[0]);
            }
            if (req.url.includes("/?error=")) {
                subject.error(req.url.replace(`/?code=`, ``).split("&")[0]);
            }
        });
        return subject.asObservable();
    }
}
