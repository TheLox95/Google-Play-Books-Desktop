import { Book } from './src/entities/Book'
import { ipcRenderer } from 'electron'
import { DaoBook } from './src/DaoBook'
import { Navigation } from './src/Navigation';
import { Reader } from './src/Reader'
import { join } from 'path'
import { ConnectionManager } from './src/ConnectionManager'

const remote = require('electron').remote;

interface JQueryProgress extends JQuery<HTMLElement> {
    progress(): void;
    progress(name: string, value: any): void;
}
export function onDownloadButtonClick(bookList: Map<string, Book>) {
    $('.downloadLink').on('click', async function (e) {
        const thereIsConnection = await ConnectionManager.thereIsInternetConnection();
        if (thereIsConnection === false) {
            let myNotification = new Notification('Title', {
                body: `Could not download book. There is not internet`
            })
            return
        }
        remote.getCurrentWebContents().downloadURL($(this).data('url'));

        const book = bookList.get($(this).data('id'))
        ipcRenderer.on('download-book', (event, message) => {
            if (!message) {
                return
            }
            $(this).hide()
            const progressBar = $(`#${message.id}  #progressBar`) as JQueryProgress

            if (progressBar.is(":visible") === false) {
                progressBar.progress();
                progressBar.show()
                progressBar.progress(`set total`, message.size);
            }
            progressBar.progress(`set progress`, message.percent);
            if (message.isDone === true) {
                let book = DaoBook.getBookById(message.id)
                if (!book) {
                    book = bookList.get(message.id)
                }
                if (!book) {
                    return
                }
                book.isDownloaded = true
                DaoBook.saveBook(book)
            }
        })
    })
}


export function onBookItemClick(bookList: Map<string, Book>) {
    $('.bookItem').on('click', async function (e) {
        const navigatorHelper = new Navigation(`sidebar`);
        const id = $(this).attr('id')
        if (!id) {
            return
        }
        let book = DaoBook.getBookById(id)
        if (!book) {
            book = bookList.get(id)
        }

        await navigatorHelper.loadView(`bookinfo`, book);

        $('.onlineReader').on('click', async function (e) {
            const thereIsConnection = await ConnectionManager.thereIsInternetConnection();
            if (thereIsConnection === false) {
                let myNotification = new Notification('Title', {
                    body: `Could not open book. There is not internet`
                })
                return
            }
            let win = new remote.BrowserWindow({ width: 800, height: 600, webPreferences: { preload: join(remote.app.getAppPath(), 'reader.js') } })
            win.setMenu(null);
            win.loadURL($(this).data('url'))
        });

        $('.offlineReader').on('click', function (e) {
            const reader = new Reader($(this).data('filename'));
        });
    })
}


export function onLoadMoreButtonClick() {
    $('#loadMore').on('click', async function (e) {
        const thereIsConnection = await ConnectionManager.thereIsInternetConnection();
        if (thereIsConnection === false) {
            let myNotification = new Notification('Title', {
                body: `Could not load more books. There is not internet`
            })
            return
        }
        DaoBook.getBooksFromApi()
    })

}

export function onTitleBookClick() {
    const bookLink = $('.titleBook').on('click', async function (e) {
        const thereIsConnection = await ConnectionManager.thereIsInternetConnection();
        if (thereIsConnection === false) {
            let myNotification = new Notification('Title', {
                body: `Could not open book. There is not internet`
            })
            return
        }
        const reader = new Reader($(this).data('url'));
    });
}    