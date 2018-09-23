import * as React from "react";
import { If, Then } from "react-if";
import { Button, Container, Divider } from "semantic-ui-react";
import { URL } from "url";
import BooksGrid from "./components/BooksGrid";
import SideMenu, { OPTIONS } from "./components/SideMenu";
import { Book } from "./entities";

interface IState {
  onlineBooks: Book[];
  offlineBooks: Book[];
  showOnly: OPTIONS;
}

export class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    const books: Book[] = [];
    for (let index = 0; index < 6; index++) {
      const randomBool = (Math.floor(Math.random() * (2 - 1 + 1)) + 1) === 1;
       // tslint:disable-next-line:max-line-length
      const book = new Book((Math.random() * 1000).toString(), `Harry potter`, new URL(`https://images-na.ssl-images-amazon.com/images/I/A1W8h-ozngL._RI_SX300_.jpg`), new URL(`http://google.com`), new URL(`http://google.com`), "pdf");
      book.isDownloaded = randomBool;
      books.push(book);
     }

    this.state = {
      offlineBooks: books.filter((i) => i.isDownloaded === false),
      onlineBooks: books.filter((i) => i.isDownloaded === true),
      showOnly: OPTIONS.ALL,
    };
  }
  public onOptionSelected = (e, { name: optionName }) => {
    if (optionName === OPTIONS.ALL) {
      this.setState({ showOnly: OPTIONS.ALL});
    }

    if (optionName === OPTIONS.OFFLINE) {
      this.setState({ showOnly: OPTIONS.OFFLINE});
    }

    if (optionName === OPTIONS.ONLINE) {
      this.setState({ showOnly: OPTIONS.ONLINE });
    }
  }
   public render() {
     const { offlineBooks, onlineBooks, showOnly } = this.state;
     return (
    <div className="window">
    <div className="window-content">
      <div className="pane-group">
        <SideMenu book={offlineBooks[0] || onlineBooks[0]} onOptionSelected={this.onOptionSelected} />
        <div className="pane" style={{overflowX: "hidden"}}>
          <Container style={{padding: "30px", boxSizing: "border-box"}}>
            <If condition={onlineBooks.length !== 0 && (showOnly === OPTIONS.ALL || showOnly === OPTIONS.ONLINE)}>
              <Then>
                <React.Fragment>
                  <BooksGrid
                    title={"Online books"}
                    books={onlineBooks}/>
                  <Divider />
                </React.Fragment>
              </Then>
            </If>
            <If condition={offlineBooks.length !== 0 && (showOnly === OPTIONS.ALL || showOnly === OPTIONS.OFFLINE)}>
              <Then>
                <BooksGrid
                  title={"Offline books"}
                  books={offlineBooks}/>
              </Then>
            </If>
            <Button fluid>Load More</Button>
          </Container>
        </div>
      </div>
    </div>
  </div>
  );
   }
}
