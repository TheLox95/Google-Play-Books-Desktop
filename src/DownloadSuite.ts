import {DownloadItem, WebContents, Event, BrowserWindow } from 'electron'
import { DownloadManager } from './DownloadManager'

export class DownloadSuite{
    private _downloadManagerList: Map<string,DownloadManager> = new Map();
    
    constructor(private _window: BrowserWindow) { }
    
    queueDownload = (event: Event, item: DownloadItem, webContents: WebContents) => {
        event.preventDefault();        
        if (this._downloadManagerList.has(item.getURLChain()[0]) === false) {
            const downloadManager = new DownloadManager(this._window)
            this._downloadManagerList.set(item.getURLChain()[0],  downloadManager)
            downloadManager.download(event, item, webContents);
        }
        
    }

    interuptDownload  = (e: Event) => {
        for(let manager of Array.from(this._downloadManagerList.values())){
            manager.downloadWillInterrupt(e)
        }
    }
}