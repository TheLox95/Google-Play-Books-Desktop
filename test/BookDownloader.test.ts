import {URL} from "url";
import { BookService, IDonwloadProgress, IHttp } from "../src2/BookService";
import { IConfigService } from "../src2/ConfigService";
import { Book } from "../src2/entities/Book";
import TYPES from "./../src2/injections/Injections";
import CONFIG_CONTAINER from "./../src2/injections/inversify.config";
import PDF_BOOK from "./book";

describe("BookService", () => {
  const mockErrorHttp = {
    getFile: (book) => {
      return Promise.resolve({
        on: (event, cb) => {
          if (event === "error") {
            cb(new Error("My error"));
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

  it("should return a IDonwloadProgress with size & soFar property with the same value on complete", (done) => {
    const service = new BookService(mockCompleteHttp, CONFIG_CONTAINER.get<IConfigService>(TYPES.IConfigService));
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
    const service = new BookService(mockErrorHttp, CONFIG_CONTAINER.get(TYPES.IConfigService));
    const observer = service.donwload(PDF_BOOK);

    observer.subscribe(undefined, (err) => {
      expect(err).toBeDefined();
      done();
    }, undefined);

  });
});
