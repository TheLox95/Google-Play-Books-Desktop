import { Book } from "../src2/Book";
import { ApiResponse } from "./../src2/types/ApiResponse.d";
import GoogleApiResJson from "./GoogleApiResponse";

describe("Book", () => {

  it("should return an empty array when ApiResponse.items is undefined or null", () => {
    const gApiResponce: ApiResponse = {...GoogleApiResJson};

    gApiResponce.items = null;
    const books1 = Book.fromGoogleApiRes(gApiResponce);
    expect(books1.length).toBe(0);

    gApiResponce.items = undefined;
    const books2 = Book.fromGoogleApiRes(gApiResponce);
    expect(books2.length).toBe(0);
  });

  it("should return a simple book object", () => {
    const gApiResponce: ApiResponse = {...GoogleApiResJson};
    const book = Book.fromGoogleApiRes(gApiResponce);

    expect(book[0].id).toBe("g06dIAAAAEAJ");
    expect(book[0].title).toBe("Winning the Loser's Game");
    expect(book[0].type).toBe("epub");
    expect(book[0].isDownloaded).toBe(false);
    expect(book[0].downloadUrl.toString())
        // tslint:disable-next-line:max-line-length
        .toBe("http://books.google.co.ve/books/download/Winning_the_Loser_s_Game_7th_Edition_201?id=g06dIAAAAEAJ&hl=&output=uploaded_content&source=gbs_api");
    expect(book[0].webReaderUrl.toString())
        // tslint:disable-next-line:max-line-length
        .toBe("http://play.google.com/books/reader?id=g06dIAAAAEAJ&hl=&printsec=frontcover&source=gbs_api");
  });
});
