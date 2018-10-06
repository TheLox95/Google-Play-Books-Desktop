import * as React from "react";
import { Else, If, Then } from "react-if";
import {
  Button, Container,
  Divider, Grid,
  Header, Icon,
} from "semantic-ui-react";
import { URL } from "url";
import BooksGrid from "./components/BooksGrid";
import SideMenu, { OPTIONS } from "./components/SideMenu";
import { Book } from "./entities";

interface IState {
  onlineBooks: Book[];
  offlineBooks: Book[];
  previewBook: Book;
  showOnly: OPTIONS;
}

export class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    const books: Book[] = [];
    for (let index = 0; index < 6; index++) {
      const randomBool = (Math.floor(Math.random() * (2 - 1 + 1)) + 1) === 1;
       // tslint:disable-next-line:max-line-length
      const book = new Book((Math.random() * 1000).toString(), this.makeid(), new URL(`https://picsum.photos/300/450`), new URL(`http://google.com`), new URL(`http://google.com`), "pdf");
      book.isDownloaded = randomBool;
      books.push(book);
     }

    const offlineBooks = books.filter((i) => i.isDownloaded === false);
    const onlineBooks = books.filter((i) => i.isDownloaded === true);

    this.state = {
      offlineBooks,
      onlineBooks,
      previewBook: onlineBooks[0] || offlineBooks[0],
      showOnly: OPTIONS.ALL,
    };
  }

  public makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  public onOptionSelected = (optionName) => {
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
     const { offlineBooks, onlineBooks, showOnly, previewBook } = this.state;
     return (
    <div className="window">
    <div className="window-content">
      <div className="pane-group">
        <If condition={offlineBooks.length !== 0 || onlineBooks.length !== 0}>
          <Then>
            <React.Fragment>
            <SideMenu book={previewBook} onOptionSelected={this.onOptionSelected} />
        <div className="pane" style={{overflowX: "hidden"}}>
          <Container style={{padding: "30px", boxSizing: "border-box"}}>
            <If condition={onlineBooks.length !== 0 && (showOnly === OPTIONS.ALL || showOnly === OPTIONS.ONLINE)}>
              <Then>
                <React.Fragment>
                  <BooksGrid
                    onBookSelected={this.onBookSelected}
                    title={"Online books"}
                    books={onlineBooks}/>
                  <Divider />
                </React.Fragment>
              </Then>
            </If>
            <If condition={offlineBooks.length !== 0 && (showOnly === OPTIONS.ALL || showOnly === OPTIONS.OFFLINE)}>
              <Then>
                <BooksGrid
                  onBookSelected={this.onBookSelected}
                  title={"Offline books"}
                  books={offlineBooks}/>
              </Then>
            </If>
            <Button fluid>Load More</Button>
          </Container>
        </div>
            </React.Fragment>
          </Then>
          <Else>
          <Container style={{padding: "30px", boxSizing: "border-box"}}>
            <Grid>
              <Grid.Column textAlign="center">
                <Header as="h2" icon>
                  <Icon name="exclamation triangle" />
                  Could not load the book list
                  <Header.Subheader>Make sure you have an active internet connection,</Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid>
            </Container>
        </Else>
        </If>
      </div>
    </div>
  </div>
  );
   }

   private onBookSelected = (book: Book) => {
    this.setState({ previewBook: book });
  }
}
