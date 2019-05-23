import { access, constants, createWriteStream} from "fs";
import { inject, injectable } from "inversify";
import { IConfigService } from ".";
import { Book } from "../entities";
import { TYPES } from "../injections";

export interface IFileService {
  save(file: IFile): Promise<boolean>;
  fileIsSaved(book: Book): Promise<boolean>;
}

export interface IFile {
  data: number;
  fileName: string;
}

@injectable()
export class FileService implements IFileService {
  constructor(@inject(TYPES.IConfigService) private _config: IConfigService) {}

  public fileIsSaved(book: Book) {
    return new Promise<boolean>((resolve, rejected) => {
      const path = `${this._config.BOOKS_FOLDER_ROUTE}/${book.title}`;
      access(path, constants.F_OK, (err) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  public save(file: IFile): Promise<boolean> {
    const writeStream = createWriteStream(file.fileName);

    // write some data with a base64 encoding
    writeStream.write(file.data);

    // close the stream
    writeStream.end();

    return new Promise((resolved, rejected) => {
      writeStream.on("error", (error) => {
        rejected(error);
      });
      // the finish event is emitted when all data has been flushed from the stream
      writeStream.on("finish", () => {
        resolved(true);
      });

    });
  }
}
