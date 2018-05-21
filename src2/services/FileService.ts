import { createWriteStream} from "fs";
import { injectable } from "inversify";
import "reflect-metadata";

export interface IFileService {
  save(file: IFile): Promise<boolean>;
}

export interface IFile {
  data: number;
  fileName: string;
}

@injectable()
export class FileService implements IFileService {

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
