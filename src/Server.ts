import { createServer } from 'http';
import { Server as NetServer } from 'net';
import { LOCAL_PORT } from './Credentials'
import { Observable } from 'rxjs/Observable';


export class Server {

    static server: NetServer
    static observable: Observable<string>

    constructor() { }

    listen(): Observable<string> {
        return this._createServer();
    }

    private _createServer(): Observable<string> {
        if (Server.server) {
            return Server.observable
        }
        let jsonResponse = {
            url: ''
        };

        Server.server = createServer();

        Server.observable = new Observable(observer => {
            Server.server.on('request', (req, res) => {
                res.end();
                observer.next(req.url)
            })
        })


        Server.server.listen(LOCAL_PORT, (err: any) => {
            if (err) {
                return console.log('something bad happened', err)
            }

            console.log(`server is listening on ${LOCAL_PORT}`)
        })

        return Server.observable;
    }
}