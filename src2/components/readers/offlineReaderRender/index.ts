// start:ng42.barrel
import EpubRender from "./EpubRender";
import PdfRender from "./PdfRender";

export default function(bookType) {
  if (bookType === "pdf") {
    return PdfRender;
  } else if (bookType === "epub") {
    return EpubRender;
  } else {
    throw new Error(`Book reader for ${bookType} not implemented`);
  }
}
// end:ng42.barrel
