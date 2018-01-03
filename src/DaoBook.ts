import { URL } from "url";
import { readdirSync } from "fs";
import { Book } from "./entities/Book";
import { join } from 'path'
import { Server } from './Server'
import { get, post } from 'request';
import Store = require('electron-store');
import { PORT, SCOPE, CLIENT_ID, CODE_CHALLENGE, OAUTHTOKEN, GOOGLE_OAUTH_URL, CLIENT_SECRET, LOCAL_SERVER, API_KEY, LOCAL_PORT } from './Credentials'
import { Observable } from 'rxjs/Observable';
import { GoogleApi } from "./GoogleApi";

const remote = require('electron').remote
let app: any = null
if (remote) {
    app = remote.app
} else {
    app = require('electron').app
}
const bookStore = new Store({ name: `books` });

export class DaoBook {
    static gApi = new GoogleApi();
    static observer = new Server().listen()
    static itemsAmount = 0
    static getBooksFromApi;

    static saveBook(book: Book) {
        bookStore.set(book.id, book)
    }

    static getBookById(id: string) {
        return DaoBook.fromDataBase(id)
    }


    static onBookResponse(): Observable<{ books: Array<Book>, itemsAmount: number }> {
        let booksObserver;
        booksObserver = Observable.create(observer => {

            DaoBook.getBooksFromApi = () => {
                let requestUrl = `https://www.googleapis.com/books/v1/volumes/useruploaded?key=${API_KEY}`

                if (DaoBook.itemsAmount != 0) {
                    requestUrl = `https://www.googleapis.com/books/v1/volumes/useruploaded?startIndex=${DaoBook.itemsAmount}&key=${API_KEY}`
                }

                DaoBook.gApi.requestAutentication()
                    .then(accessToken => {

                        const booksList = get(requestUrl, {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }, function (err, res) {
                            console.log(err)
                            const response: { items: Array<{}>, totalItems: string } = JSON.parse(res.body);
                            console.log(response)
                            DaoBook.itemsAmount = DaoBook.itemsAmount + response.items.length
                            observer.next({
                                "books": DaoBook.fromJsonArray(response.items),
                                'itemsAmount': response.items.length + DaoBook.itemsAmount
                            })
                        });
                    })
                    .catch(err => {
                        observer.error(err);
                    });
            }
        })

        return booksObserver as Observable<{ books: Array<Book>, itemsAmount: number }>
    }


    static fromJson(jsonBook: any) {
        let type: 'pdf' | 'epub'
        let donwloadURL;

        if (jsonBook.accessInfo.epub) {
            type = 'epub'
            donwloadURL = new URL(jsonBook.accessInfo.epub.downloadLink)
        } else {
            type = 'pdf'
            donwloadURL = new URL(jsonBook.accessInfo.pdf.downloadLink)
        }


        return new Book(
            jsonBook.id,
            jsonBook.volumeInfo.title,
            new URL(jsonBook.volumeInfo.imageLinks.thumbnail),
            new URL(jsonBook.accessInfo.webReaderLink),
            donwloadURL,
            type);
    }

    static fromJsonArray(jsonBookArr: any[]) {
        const gBooks: Book[] = []
        for (let gBook of jsonBookArr) {
            if (gBook) {
                gBooks.push(DaoBook.fromJson(gBook))
            }
        }

        return gBooks
    }

    static fromDataBase(id: string): Book | undefined {
        if (bookStore.has(id) === false) {
            return undefined
        }

        const bookRaw = bookStore.get(id)

        const book = new Book(
            bookRaw._id,
            bookRaw._title,
            new URL(bookRaw._thumbnail),
            new URL(bookRaw._webReaderUrl),
            bookRaw._downloadUrl,
            bookRaw._bookType);
        book.isDownloaded = bookRaw._isDownloaed
        return book
    }

    static getAll(): Book[] {
        const booksArray: Book[] = []
        
        try {
            let books = readdirSync(join(app.getPath("documents"), `GooglePlayBooks`))
            books = books.map(el => {
                return el.split('.')[0]
            });
            console.log(bookStore.size);
            for (let bookId of books) {
                if (bookStore.has(bookId) === true) {
                    const book = DaoBook.fromDataBase(bookId)
                    if (book) {
                        booksArray.push(book)
                    }
                }
            }

            return booksArray
        } catch (error) {
            return booksArray;
        }
    }
}