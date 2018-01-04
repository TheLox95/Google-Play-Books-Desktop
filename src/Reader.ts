const {app, BrowserWindow} = require('electron').remote;
import {existsSync} from 'fs'
import {join} from 'path'
import {format, URL} from 'url'
const PDFWindow = require('electron-pdf-window')
import { BOOKS_FOLDER_URL } from './Credentials';


export class Reader{
    private _bookRoute: string
    private _bookURI: URL

    constructor(private _fileName:string){
        console.log(this._fileName);
        this._bookURI = new URL(this._fileName) 
        this._openReader()       
    }

    private _openReader(){
        const bookId = this._bookURI.searchParams.get('id')
        if (!bookId) {
            return
        }
        this._bookRoute = join(BOOKS_FOLDER_URL, bookId);

        if (existsSync(`${this._bookRoute}.epub`)) {
            console.log('exist epub')
            console.log(`${this._bookRoute}.epub`)
            let win = new BrowserWindow({ width: 800, height: 600, title: 'Epub', webPreferences: { preload: join(app.getAppPath(), 'epub-reader.js') } })
            //win.setMenu(null)
            win.loadURL(format({
                pathname: join(app.getAppPath(), 'views/epub-reader.html'),
                protocol: 'file:',
                slashes: true,
                query: { id: bookId, books_folder: BOOKS_FOLDER_URL }
            }));
        } else if (existsSync(`${this._bookRoute}.pdf`)) {
            console.log('exist pdf')

            const win = new BrowserWindow({ width: 800, height: 600, webPreferences: { webSecurity: false } })
            win.setMenu(null)
            PDFWindow.addSupport(win)
            win.loadURL(`file://${join(BOOKS_FOLDER_URL, `${bookId}.pdf`)}`)
        }else{
            let win = new BrowserWindow({ width: 800, height: 600, webPreferences: { preload: join(app.getAppPath(), 'reader.js') } })
            win.setMenu(null)
            win.loadURL(this._bookURI.toString())
        }
    }
}