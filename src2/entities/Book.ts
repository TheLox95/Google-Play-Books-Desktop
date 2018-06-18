import {URL} from "url";
import { ApiResponse } from "../types/ApiResponse.d";

type BookType = "pdf" | "epub";

export class Book {
    public static fromGoogleApiRes(gJsonRes: ApiResponse): Book[] {
        const gBooks  = gJsonRes.items || [];
        const books: Book[] = [];

        for (const gBook of gBooks) {
            let type: BookType = "epub";
            let donwloadURL = new URL(``);

            if (gBook.accessInfo.epub) {
                donwloadURL = new URL(gBook.accessInfo.epub.downloadLink);
            }

            if (gBook.accessInfo.pdf ) {
                type = "pdf";
                donwloadURL = new URL(gBook.accessInfo.pdf.downloadLink);
            }

            books.push(new Book(
                gBook.id,
                gBook.volumeInfo.title,
                new URL(gBook.volumeInfo.imageLinks.thumbnail),
                new URL(gBook.accessInfo.webReaderLink),
                donwloadURL,
                type,
            ));
        }
        return books;
    }

    private _isDownloaed = false;

    constructor(private _id: string,
                private _title: string,
                private _thumbnail: URL,
                private _webReaderUrl: URL,
                private _downloadUrl: URL,
                private _bookType: BookType,
        ) {

    }

    public get id(): string {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }

    public get thumbnail(): URL {
        return this._thumbnail;
    }

    public set thumbnail(v: URL) {
        this._thumbnail = v;
    }

    public get webReaderUrl(): URL {
        return this._webReaderUrl;
    }

    public get downloadUrl(): URL {
        return this._downloadUrl;
    }

    public get type(): BookType {
        return this._bookType;
    }

    public get isDownloaded(): boolean {
        return this._isDownloaed;
    }

    public set isDownloaded(v: boolean) {
        this._isDownloaed = v;
    }

}
