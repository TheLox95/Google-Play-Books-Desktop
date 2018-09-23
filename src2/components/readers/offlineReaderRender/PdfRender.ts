import { BrowserWindowConstructorOptions, remote } from "electron";

export default class PdfReader {
  private readonly browserProperties: BrowserWindowConstructorOptions = {
    height: 600,
    webPreferences: {
      plugins: true,
      webSecurity: false,
    },
    width: 800,
  };
  private pdfWindow: Electron.BrowserWindow;

  constructor(appPath?: string) {
    const path = appPath;
  }

  public open() {
    this.pdfWindow = new remote.BrowserWindow(this.browserProperties);
    this.pdfWindow.setMenu(null);
  }
}
