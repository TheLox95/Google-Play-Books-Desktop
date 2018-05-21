import {URL} from "url";
import { BookService, IDonwloadProgress, IHttp } from "../src2/services/BookService";
import { IConfigService } from "../src2/services/ConfigService";
import { IFileService } from "../src2/services/FileService";
import TYPES from "./../src2/injections/Injections";
import CONFIG_CONTAINER from "./../src2/injections/inversify.config";
import PDF_BOOK from "./book";

describe("BookService", () => {
  const mockErrorHttp = {
    getFile: (book) => {
      return Promise.resolve({
        on: (event, cb) => {
          if (event === "error") {
            cb(new Error("My http error"));
          }
        },
        pipe: (stream) => {
          return mockErrorHttp;
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
        pipe: (stream) => {
          return mockErrorHttp;
        },

      });
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

  it("should return a IDonwloadProgress with size & soFar property with the same value on complete", (done) => {
    const service = new BookService(mockCompleteHttp, fakeFileService);
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
    const service = new BookService(mockErrorHttp, fakeFileService);
    const observer = service.donwload(PDF_BOOK);

    observer.subscribe(undefined, (err: Error) => {
      expect(err).toBeDefined();
      expect(err.message).toBe("My http error");
      done();
    }, undefined);

  });

  it("should throw an error on file saving error", (done) => {
    const service = new BookService(mockCompleteHttp, fakeBadFileService);
    const observer = service.donwload(PDF_BOOK);

    observer.subscribe(undefined, (err: Error) => {
      expect(err).toBeDefined();
      expect(err.message).toBe(`Error saving file`);
      done();
    }, undefined);

  });
});
