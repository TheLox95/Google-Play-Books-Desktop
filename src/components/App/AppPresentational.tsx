import * as electron from "electron";
import * as React from "react";
import { If, Then } from "react-if";
import {
  Button, Container,
  Dimmer, Divider,
  Grid, Header,
  Icon, Loader,
  Message,
} from "semantic-ui-react";
import { Book } from "../../entities";
import BooksGrid from "../BooksGrid";
import SideMenu, { OPTIONS } from "../SideMenu";

enum APP_STATUS {
  BOOTSTRAP,
  LOGIN_NEEDED,
  FETCHING,
  LOADED,
}

interface IProp {
  onlineBooks: Book[];
  offlineBooks: Book[];
  previewBook?: Book;
  showOnly: OPTIONS;
  status: APP_STATUS;
  canConnect: boolean;
  index: number;
  allLoaded: boolean;
  onBookSelected();
  onLoadMore();
}

export class AppPresentational extends React.Component<IProp, {}> {
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
    const { canConnect, previewBook } = this.props;

    return (
      <div className="window">
        <div className="window-content">
          <div className="pane-group">
            <React.Fragment>
              <SideMenu book={previewBook} onOptionSelected={this.onOptionSelected} />
              {this._resolveScreen()}
            </React.Fragment>
          </div>
        </div>
        <footer className="toolbar toolbar-footer" style={{ display: canConnect ? "none" : "inline" }}>
          <Message warning>
            <Message.Header>You must register before you can do that!</Message.Header>
            <p>Visit our registration page, then try again.</p>
          </Message>
        </footer>
      </div>
    );
   }

   private _resolveScreen() {
     const {
      offlineBooks,
      onlineBooks,
      showOnly,
      canConnect,
      status,
      allLoaded,
      onBookSelected,
      onLoadMore,
    } = this.props;

     if (status === APP_STATUS.BOOTSTRAP || status === APP_STATUS.FETCHING) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
       );
     }

     if (status === APP_STATUS.LOGIN_NEEDED) {
      return (
        <Container style={{padding: "30px", boxSizing: "border-box"}}>
        <Grid>
          <Grid.Column textAlign="center">
            <Header as="h2" icon>
              <Icon name="exclamation triangle" />
              App requires login
              <Header.Subheader>Please allow access to app.</Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid>
        </Container>
       );
     }

     if (status === APP_STATUS.LOADED) {
      return (
        <div className="pane" style={{overflowX: "hidden"}}>
          <Container style={{padding: "30px", boxSizing: "border-box"}}>
            <If condition={onlineBooks.length !== 0 && (showOnly === OPTIONS.ALL || showOnly === OPTIONS.ONLINE)}>
              <Then>
                <React.Fragment>
                  <BooksGrid
                    onBookSelected={onBookSelected()}
                    title={"Online books"}
                    disabled={canConnect}
                    books={onlineBooks}/>
                  <Divider />
                </React.Fragment>
              </Then>
            </If>
            <If condition={offlineBooks.length !== 0 && (showOnly === OPTIONS.ALL || showOnly === OPTIONS.OFFLINE)}>
              <Then>
                <BooksGrid
                  onBookSelected={onBookSelected()}
                  title={"Offline books"}
                  disabled={canConnect}
                  books={offlineBooks}/>
              </Then>
            </If>
            {!allLoaded && (
              <Button fluid disabled={!canConnect} onClick={onLoadMore()}>
                Load More
              </Button>
            )}
            {allLoaded && (
              <Message warning>
                <Message.Header>You must register before you can do that!</Message.Header>
                <p>Visit our registration page, then try again.</p>
              </Message>
            )}
          </Container>
        </div>
      );
     }

     return (
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
     );
   }
}
