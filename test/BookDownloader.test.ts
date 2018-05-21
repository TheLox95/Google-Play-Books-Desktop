import {URL} from "url";
import { Book } from "../src2/Book";
import { BookService, IDonwloadProgress, IHttp } from "../src2/BookService";

describe("BookService", () => {
  const mockErrorHttp = {
    get: () => {
      return Promise.resolve({
        on: (event, cb) => {
          if (event === "error") {
            cb(new Error("My error"));
          }
        },
      });
    },
  } as IHttp;

  const mockCompleteHttp = {
    get: () => {
      return Promise.resolve({
        on: (event, cb) => {
          if (event === "response") {
            cb({headers: {"content-length" : 10}});
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

  it("should return a IDonwloadProgress with size & soFar property with the same value on complete", (done) => {
    const service = new BookService(mockCompleteHttp);
    const observer = service.donwload(new URL("http://www.google.com"));
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
    const service = new BookService(mockErrorHttp);
    const observer = service.donwload(new URL("http://www.google.com"));

    observer.subscribe(undefined, (err) => {
      expect(err).toBeDefined();
      done();
    }, undefined);

  });
});
