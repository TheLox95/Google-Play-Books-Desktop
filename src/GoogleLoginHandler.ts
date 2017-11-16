import { remote, BrowserWindow, BrowserView } from 'electron';
import { get } from 'request';
import { IncomingMessage } from 'http';
import {GOOGLE_OAUTH_URL } from './Credentials'
import { Server } from './Server';
import { Observable } from 'rxjs/Observable';

export class GoogleLoginHandler {
    private _window: BrowserWindow;
    private _serverObserver: Observable<string>;
    constructor(){
        this._serverObserver = new Server().listen();
    }

    public launchLoginWindow() {
        let loginWindow: BrowserWindow;
        get(GOOGLE_OAUTH_URL, { followRedirect: false })
            .on('response', res => this._buildLogingWindow(res));
    }


    private _buildLogingWindow(response: IncomingMessage) {
        this._window = new remote.BrowserWindow({
            width: 600,
            height: 600,
            parent: remote.getCurrentWindow()
        });
        this._window.setMenu(null);
        this._window.loadURL(response.headers['location']);

        this._serverObserver.subscribe(result =>{
            if (this._window) {
                this._window.close();
            }
        });
    }
}