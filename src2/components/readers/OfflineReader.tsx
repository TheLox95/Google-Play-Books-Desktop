import { BrowserWindowConstructorOptions, remote } from "electron";
import * as PDFWindow from "electron-pdf-window";
import { inject } from "inversify";
import { join } from "path";
import { Book } from "../../entities";
import { TYPES } from "../../injections";
import { IConfigService } from "../../services";

export default class OfflineReader {

  private readonly browserProperties: BrowserWindowConstructorOptions = {
    height: 600,
    webPreferences: { webSecurity: false },
    width: 800,
  };

  constructor(@inject(TYPES.IConfigService) private _config: IConfigService) {}

  public open(book: Book) {
    const win = new remote.BrowserWindow(this.browserProperties);
    win.setMenu(null);
    PDFWindow.addSupport(win);
    win.loadURL(`file://${join(this._config.BOOKS_FOLDER_ROUTE, `${book.id}.pdf`)}`);
  }
}
