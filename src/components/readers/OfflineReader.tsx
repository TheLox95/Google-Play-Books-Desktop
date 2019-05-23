import { inject } from "inversify";
import { Book } from "../../entities";
import { TYPES } from "../../injections";
import { IConfigService } from "../../services";
import RenderFactory from "./offlineReaderRender";

export default class OfflineReader {

  constructor(@inject(TYPES.IConfigService) private _config: IConfigService) {}

  public open(book: Book) {
    const renderClass = RenderFactory(book.type);
    const render = new renderClass(this._config.APP_PATH);
    render.open();
  }
}
