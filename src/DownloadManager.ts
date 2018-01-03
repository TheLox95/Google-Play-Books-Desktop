import { app, App, dialog, remote, DownloadItem, WebContents, BrowserWindow } from 'electron'
import { IncomingMessage } from 'http'
import { createWriteStream, unlinkSync, writeFileSync, existsSync, mkdirSync} from 'fs'
import { URL } from 'url'
import { get } from 'request'
import { join } from 'path'
import { DaoBook } from './DaoBook'
import { mkdir } from 'original-fs';


interface myApp extends App {
    showExitPrompt: boolean
}

interface DownloadBookInfo {
    id: string
    percent: number
    size: number
    isDone: boolean
    state: string
}



export class DownloadManager {
    private _downloadIsComplete = false
    private _bookTitle: string
    private _bookId: string = ''
    private _booksFolderRoute = join(app.getPath("documents"), `GooglePlayBooks`);

    constructor(private _window: BrowserWindow) { }

    download = async (event: Event, item: DownloadItem, webContents: WebContents) => {
        let received_bytes = 0;
        let total_bytes = 0;
        const bookUrl = item.getURL()

        try {
            this._getRoute(item)
            this._createBooksFolderIfNotExits();

            let defaultMsg = {
                id: this._bookId,
                percent: received_bytes,
                size: total_bytes,
                isDone: false,
                state: 'donwloading'
            }

            if (existsSync(join(this._booksFolderRoute, this._bookTitle)) === false) {
                writeFileSync(join(this._booksFolderRoute, this._bookTitle), '');
            }

            const out = createWriteStream(join(this._booksFolderRoute, this._bookTitle));
            const req = await get(bookUrl);

            out.on('open', fd => {
                req.pipe(out);

                req.on('response', (data: IncomingMessage) => total_bytes = parseInt(data.headers['content-length']));

                req.on('data', (chunk: Buffer) => {
                    received_bytes += chunk.length;
                    defaultMsg.percent = received_bytes
                    defaultMsg.size = total_bytes
                    this._notify(defaultMsg);
                });

                req.on('end', () => {
                    console.log("File succesfully downloaded");
                    this._downloadIsComplete = true;

                    defaultMsg.isDone = true;
                    defaultMsg.state = 'finished'

                    this._notify(defaultMsg);
                });

                req.on('error', (err: Error) => this._cleanFileOnError(this._booksFolderRoute, this._bookTitle));
            });
        } catch (error) {
            console.log(error);
        }
    }

    private _notify(msg: DownloadBookInfo) {
        if (this._window.isDestroyed() === false) {
            this._window.webContents.send('download-book', msg)
        }
    }

    downloadWillInterrupt = (e: Event) => {
        const appConst = app as myApp

        if (appConst.showExitPrompt === false) {
            return
        }

        if (this._downloadIsComplete === true) {
            return
        }

        e.preventDefault() // Prevents the window from closing 
        dialog.showMessageBox({
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'A book is being donwloaded right now. Do you want to exit?'
        }, (response) => {
            if (response === 0) { // Runs the following if 'Yes' is clicked
                if (this._downloadIsComplete == false) {
                    this._cleanFileOnError(this._booksFolderRoute, this._bookTitle)
                }
                appConst.showExitPrompt = false
                this._window.close()
            }
        })
    }

    private _cleanFileOnError(route: string, tile: string) {
        const bookRoute = join(this._booksFolderRoute, this._bookTitle);
        if (existsSync(bookRoute) === true) {
            unlinkSync(bookRoute);
        }
    }

    private _getRoute(item: DownloadItem) {
        const donwloadLink = item.getURLChain()[0]
        const fileName = item.getFilename()
        const uri = new URL(donwloadLink)

        const id = uri.searchParams.get('id');
        if (id) {
            this._bookId = id
        }
        let fileComposeName = id

        const fileType = fileName.split(`.`)[1];

        if (fileType === `epub`) {
            fileComposeName = fileComposeName + `.epub`
        } else {
            fileComposeName = fileComposeName + `.pdf`
        }

        this._bookTitle = fileComposeName;
    }

    private _createBooksFolderIfNotExits(){
        if (existsSync(this._booksFolderRoute) === false) {
            mkdirSync(this._booksFolderRoute);
        }

    }
}