import { BrowserWindowConstructorOptions, remote } from "electron";
import { Book } from "../../entities";

export default class OnlineReader {
  public static open(book: Book) {
    const win = new remote
      .BrowserWindow(OnlineReader.browserProperties);
    win.setMenu(null);
    win.loadURL(book.webReaderUrl.toString());
    win.webContents.addListener("will-navigate", () => {
      win.close();
    });
  }

  private static readonly browserProperties: BrowserWindowConstructorOptions = {
    height: 600,
    width: 800,
  };
}
