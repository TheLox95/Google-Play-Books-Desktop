// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import { GoogleLoginHandler } from './src/GoogleLoginHandler';
import { Navigation } from './src/Navigation';
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer
import Store = require('electron-store');
const configStore = new Store('config');
import { DaoBook } from './src/DaoBook'
import { onBookItemClick, onDownloadButtonClick, onTitleBookClick, onLoadMoreButtonClick } from './ViewHelper'
import { ConnectionManager } from './src/ConnectionManager';
import { Server } from './src/Server';
interface JQueryProgress extends JQuery<HTMLElement> {
    progress(): void;
    progress(name: string, value: any): void;
}

new Server().listen()

const navigatorHelper = new Navigation(`includedContent`);
let sidebar;


ConnectionManager.thereIsInternetConnection()
    .then(thereisConnection => {
        const books = DaoBook.getAll();
        console.log(books.length)
        if (thereisConnection === false && books.length == 0) {
            const desactivatedFrom = navigatorHelper.loadView(`desactivate-form`);
            desactivatedFrom.then(() => {
                sidebar = $('#sidebar');
                sidebar.hide();
            });
        } else if (thereisConnection === false && books.length > 0) {
            const bookViewPromise = navigatorHelper.loadView(`books`, { 'offline-books': books });

            bookViewPromise.then(() => {
                onLoadMoreButtonClick()
                onTitleBookClick()
                onDownloadButtonClick(library)
                onBookItemClick(library);
            });
        } else if (
            (thereisConnection === true && books.length == 0 && !configStore.get('refresh_token')) ||
            (thereisConnection === true && books.length > 0 && !configStore.get('refresh_token'))) {
            const login = navigatorHelper.loadView(`login`);
            login.then(() => {
                sidebar = $('#sidebar');
                sidebar.hide();
                $('#logIn').on('click', async function (e) {
                    let a = new GoogleLoginHandler();
                    a.launchLoginWindow();
                })
                DaoBook.getBooksFromApi()

            });
        } else if (thereisConnection === true && configStore.get('refresh_token')) {
            DaoBook.getBooksFromApi()
        }

    });



const library = new Map();

const observer = DaoBook.onBookResponse()
observer.subscribe(changes => {
    if (sidebar) {
        sidebar.show();
    }
    changes.books.forEach(item => library.set(item.id, item));

    library.forEach((value, key, map) => {
        for (let book of DaoBook.getAll()) {
            if (map.has(book.id) === true) {
                map.delete(book.id)
            }
        }
    });
    console.log(remote.app.getPath('userData'))
    const bookViewPromise = navigatorHelper.loadView(`books`, { books: Array.from(library.values()), 'offline-books': DaoBook.getAll() });

    bookViewPromise.then(function (bookView) {


        onLoadMoreButtonClick()
        onTitleBookClick()
        onDownloadButtonClick(library)
        onBookItemClick(library);


    });

},
    err => {
        const login = navigatorHelper.loadView(`login`);
        login.then(() => {
            sidebar = $('#sidebar');
            sidebar.hide();
            $('#logIn').on('click', async function (e) {
                let a = new GoogleLoginHandler();
                a.launchLoginWindow();
            })
        });
        let myNotification = new Notification('Autentication Failed', {
            body: `In order to use the application you must accept the permissions.`
        })
    })
