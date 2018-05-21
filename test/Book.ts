import {URL} from "url";
import { Book } from "../src2/entities";

const PDF_BOOK = new Book(
    "g06dIAAAAEAJ",
    "Winning the Loser's Game",
    // tslint:disable-next-line:max-line-length
    new URL("http://books.google.com/books/content?id=g06dIAAAAEAJ&printsec=frontcover&img=1&zoom=1&uvs=3&source=gbs_api"),
    new URL("http://play.google.com/books/reader?id=g06dIAAAAEAJ&hl=&printsec=frontcover&source=gbs_api"),
    // tslint:disable-next-line:max-line-length
    new URL("http://books.google.co.ve/books/download/Winning_the_Loser_s_Game_7th_Edition_201?id=g06dIAAAAEAJ&hl=&output=uploaded_content&source=gbs_api"),
    "pdf",
);

export default PDF_BOOK;
