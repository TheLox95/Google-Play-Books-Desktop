import * as gApi from "googleapis";
import { URL } from "url";
import * as uuidv4 from "uuid/v4";
import { CONTAINER } from "../injections";
import { FileService, IFileService } from "../services";

type BookType = "pdf" | "epub";

export class Book {
    public static async fromGoogleApiRes(gJsonRes: gApi.books_v1.Schema$Volume[] | undefined): Promise<Book[]> {
        const gBooks  = gJsonRes || [];
        const books: Book[] = [];
        const fService = CONTAINER.resolve<IFileService>(FileService);

        for (const gBook of gBooks) {
            let type: BookType = "epub";
            let donwloadURL = new URL(`https://www.npmjs.com/package/uuid`);

            if (gBook.accessInfo.epub) {
                donwloadURL = new URL(gBook.accessInfo.epub.downloadLink);
            }

            if (gBook.accessInfo.pdf ) {
                type = "pdf";
                donwloadURL = new URL(gBook.accessInfo.pdf.downloadLink);
            }

            books.push(new Book(
                gBook.id || uuidv4(),
                gBook.volumeInfo.title,
                new URL(gBook.volumeInfo.imageLinks.thumbnail),
                new URL(gBook.accessInfo.webReaderLink),
                donwloadURL,
                type,
                await fService.fileIsSaved(gBook.volumeInfo.title),
                gBook.userInfo.updated || null,
                gBook.volumeInfo.description || null,
            ));
        }
        return books;
    }

    constructor(private _id: string,
                private _title: string,
                private _thumbnail: URL,
                private _webReaderUrl: URL,
                private _downloadUrl: URL,
                private _bookType: BookType,
                private _isDownloaed: boolean,
                private _uploadDate: string | null,
                private _description: string | null,
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

    public get uploadDate() {
        return this._uploadDate;
    }

    public get description() {
        return this._description;
    }
}
