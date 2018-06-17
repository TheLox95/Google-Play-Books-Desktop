import {URL} from "url";
import { BookService } from "../src2/services/BookService";
import { IConfigService } from "../src2/services/ConfigService";
import { IFileService } from "../src2/services/FileService";
import { IDonwloadProgress, IHttp } from "../src2/utils/Http";
import TYPES from "./../src2/injections/Injections";
import PDF_BOOK from "./book";
import GoogleApiResJson from "./GoogleApiResponse";

describe("BookService", () => {
  const mockErrorHttp = {
    getFile: (book) => {
      return Promise.resolve({
        on: (event, cb) => {
          if (event === "error") {
            cb(new Error("My http error"));
          }
        },
      });
    },
  } as IHttp;

  const mockCompleteHttp = {
    getFile: (book) => {
      return Promise.resolve({
        on: (event, cb) => {
          if (event === "response") {
            cb({headers: {"content-length" : 10, "content-type": "application/pdf"}});
          }
          if (event === "data") {
            cb({length: 10});
          }
          if (event === "complete") {
            cb();
          }
        },
      });
    },
  } as IHttp;

  const mockBookResponse = {
    get: (book) => {
      return Promise.resolve(GoogleApiResJson);
    },
  } as IHttp;

  const fakeFileService = {
    save: (file) => {
      return Promise.resolve(true);
    },
  };

  const fakeBadFileService = {
    save: (file) => {
      return Promise.reject(new Error(`Error saving file`));
    },
  };

  const fakeConfig = {API_URL: "google.com", BOOKS_FOLDER_ROUTE: "folder/"} as IConfigService;

  it("should return a IDonwloadProgress with size & soFar property with the same value on complete", (done) => {
    const service = new BookService(mockCompleteHttp, fakeConfig, fakeFileService);
    const observer = service.donwload(PDF_BOOK);
    let progress: IDonwloadProgress;

    observer.subscribe((progressRes: IDonwloadProgress) => {
      progress = progressRes;
    }, undefined, () => {
      expect(progress.size).toBe(10);
      expect(progress.soFar).toBe(10);
      done();
    });
  });

  it("should trow an Exception object on stream error", (done) => {
    const service = new BookService(mockErrorHttp, fakeConfig, fakeFileService);
    const observer = service.donwload(PDF_BOOK);

    observer.subscribe(undefined, (err: Error) => {
      expect(err).toBeDefined();
      expect(err.message).toBe("My http error");
      done();
    }, undefined);

  });

  it("should throw an error on file saving error", (done) => {
    const service = new BookService(mockCompleteHttp, fakeConfig, fakeBadFileService);
    const observer = service.donwload(PDF_BOOK);

    observer.subscribe(undefined, (err: Error) => {
      expect(err).toBeDefined();
      expect(err.message).toBe(`Error saving file`);
      done();
    }, undefined);

  });

  it("should return an array of Book", async (done) => {
    const service = new BookService(mockBookResponse, fakeConfig, fakeFileService);
    const books = await service.getAll();

    expect(books.length).toBe(1);
    done();

  });
});
