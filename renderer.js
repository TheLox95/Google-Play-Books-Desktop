"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const GoogleLoginHandler_1 = require("./src/GoogleLoginHandler");
const Navigation_1 = require("./src/Navigation");
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const Store = require("electron-store");
const configStore = new Store({ name: `config` });
const DaoBook_1 = require("./src/DaoBook");
const ViewHelper_1 = require("./ViewHelper");
const ConnectionManager_1 = require("./src/ConnectionManager");
const Server_1 = require("./src/Server");
new Server_1.Server().listen();
const navigatorHelper = new Navigation_1.Navigation(`includedContent`);
let sidebar;
ConnectionManager_1.ConnectionManager.thereIsInternetConnection()
    .then(thereisConnection => {
    const books = DaoBook_1.DaoBook.getAll();
    console.log(books.length);
    if (thereisConnection === false && books.length == 0) {
        const desactivatedFrom = navigatorHelper.loadView(`desactivate-form`);
        desactivatedFrom.then(() => {
            sidebar = $('#sidebar');
            sidebar.hide();
        });
    }
    else if (thereisConnection === false && books.length > 0) {
        const bookViewPromise = navigatorHelper.loadView(`books`, { 'offline-books': books });
        bookViewPromise.then(() => {
            ViewHelper_1.onLoadMoreButtonClick();
            ViewHelper_1.onTitleBookClick();
            ViewHelper_1.onDownloadButtonClick(library);
            ViewHelper_1.onBookItemClick(library);
        });
    }
    else if ((thereisConnection === true && books.length == 0 && !configStore.get('refresh_token')) ||
        (thereisConnection === true && books.length > 0 && !configStore.get('refresh_token'))) {
        const login = navigatorHelper.loadView(`login`);
        login.then(() => {
            sidebar = $('#sidebar');
            sidebar.hide();
            $('#logIn').on('click', function (e) {
                return __awaiter(this, void 0, void 0, function* () {
                    let a = new GoogleLoginHandler_1.GoogleLoginHandler();
                    a.launchLoginWindow();
                });
            });
            DaoBook_1.DaoBook.getBooksFromApi();
        });
    }
    else if (thereisConnection === true && configStore.get('refresh_token')) {
        DaoBook_1.DaoBook.getBooksFromApi();
    }
});
const library = new Map();
const observer = DaoBook_1.DaoBook.onBookResponse();
observer.subscribe(changes => {
    if (sidebar) {
        sidebar.show();
    }
    changes.books.forEach(item => library.set(item.id, item));
    library.forEach((value, key, map) => {
        for (let book of DaoBook_1.DaoBook.getAll()) {
            if (map.has(book.id) === true) {
                map.delete(book.id);
            }
        }
    });
    console.log(remote.app.getPath('userData'));
    const bookViewPromise = navigatorHelper.loadView(`books`, { books: Array.from(library.values()), 'offline-books': DaoBook_1.DaoBook.getAll() });
    bookViewPromise.then(function (bookView) {
        ViewHelper_1.onLoadMoreButtonClick();
        ViewHelper_1.onTitleBookClick();
        ViewHelper_1.onDownloadButtonClick(library);
        ViewHelper_1.onBookItemClick(library);
    });
}, err => {
    const login = navigatorHelper.loadView(`login`);
    login.then(() => {
        sidebar = $('#sidebar');
        sidebar.hide();
        $('#logIn').on('click', function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                let a = new GoogleLoginHandler_1.GoogleLoginHandler();
                a.launchLoginWindow();
            });
        });
    });
    let myNotification = new Notification('Autentication Failed', {
        body: `In order to use the application you must accept the permissions.`
    });
});
