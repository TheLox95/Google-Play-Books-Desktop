import {URL} from "url";

export class Book{
    private _isDownloaed = false

    constructor(private _id:string,
        private _title:string,
        private _thumbnail:URL,
        private _webReaderUrl:URL,
        private _downloadUrl:URL,
        private _bookType: 'pdf' | 'epub',
        ){

    }

    
    public get id() : string {
        return this._id
    }

    
    public get title() : string {
        return this._title
    }

    
    public get thumbnail() : URL {
        return this._thumbnail
    }

    
    public set thumbnail(v : URL) {
        this._thumbnail = v;
    }
    
    
    public get webReaderUrl() : URL {
        return this._webReaderUrl
    }

    
    public get downloadUrl() : URL {
        return this._downloadUrl
    }

    
    public get type() : string {
        return this._bookType
    }

    
    public get isDownloaded() : boolean {
        return this._isDownloaed
    }

    
    public set isDownloaded(v : boolean) {
        this._isDownloaed = v;
    }
    
}