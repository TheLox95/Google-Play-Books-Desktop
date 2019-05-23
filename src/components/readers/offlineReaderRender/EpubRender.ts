import { BrowserWindowConstructorOptions, remote } from "electron";
import { join } from "path";

export default class EpubReader {
  private appPath = "";
  private readonly browserProperties: BrowserWindowConstructorOptions = {
    height: 600,
    title: "Epub",
    webPreferences: {
      preload: join(this.appPath, "epub-reader.js"),
    },
    width: 800,
  };
  private epubWindow: Electron.BrowserWindow;

  constructor(appPath?: string) {
    if (!appPath) {
      throw new Error("Path not provided");
    }
    this.appPath = appPath;
  }

  public open() {
    this.epubWindow = new remote.BrowserWindow(this.browserProperties);
    this.epubWindow.setMenu(null);
  }
}
