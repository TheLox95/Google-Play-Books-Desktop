import * as React from "react";
import { Book } from "../../entities";
import { CONTAINER } from "../../injections";
import {
  BookService,
  ConnectivityService,
  IBookService,
  IConnectivityService,
  ILoginService,
  LoginService,
} from "../../services";
import { OPTIONS } from "../SideMenu";
import { AppPresentational } from "./AppPresentational";

enum APP_STATUS {
  BOOTSTRAP,
  LOGIN_NEEDED,
  FETCHING,
  LOADED,
}

interface IState {
  onlineBooks: Book[];
  offlineBooks: Book[];
  previewBook?: Book;
  showOnly: OPTIONS;
  status: APP_STATUS;
  canConnect: boolean;
  index: number;
  allLoaded: boolean;
}

export class AppContainer extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    const status = APP_STATUS.BOOTSTRAP;

    const conectivityS = CONTAINER.resolve<IConnectivityService>(ConnectivityService);

    conectivityS.getConnectionStatus()
      .then((r) => {
        this._onBootstrap(r);
        conectivityS.observeConnection()
          .subscribe((canConnect) => this.setState({canConnect}));
      });

    this.state = {
      allLoaded: false,
      canConnect: false,
      index: 0,
      offlineBooks: [],
      onlineBooks: [],
      showOnly: OPTIONS.ALL,
      status,
    };
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
    const { index, offlineBooks, onlineBooks, showOnly, canConnect, status, allLoaded, previewBook } = this.state;

    return (<AppPresentational
      onlineBooks={onlineBooks}
      offlineBooks={offlineBooks}
      previewBook={previewBook}
      showOnly={showOnly}
      status={status}
      canConnect={canConnect}
      index={index}
      allLoaded={allLoaded}
      onLoadMore={this._onLoadMore}
      onBookSelected={this.onBookSelected}
    />);
   }

   private _onLoadMore = () => () => {
     let { index } = this.state;
     index++;
     this.setState({
      index,
     }, () => {
      this._fetchBooks(index);
    });

   }

   private _onBootstrap(canConnect) {
    const loginS = CONTAINER.resolve<ILoginService>(LoginService);

    const { status } = this.state;
    const state = {
      canConnect,
      status,
    };

    if (loginS.appNeedsLogin() === true) {
      state.status = APP_STATUS.LOGIN_NEEDED;
      loginS.listenUserLogin()
      .subscribe((code) => {
          loginS.saveToken(code);
      }, (err) => {
          console.log(err);
      });
    } else {
      this._fetchBooks();
    }
    this.setState(state);
  }

  private _fetchBooks(idx = 0) {
    const service = CONTAINER.resolve<IBookService>(BookService);
    const status = APP_STATUS.FETCHING;

    this.setState({
      status,
    });

    return service.getAll(idx)
    .then((booksRes) => {
      this._updateBookList(booksRes);
    })
    .catch((err) => {
      console.log("book service");
      console.log(err);
    });
  }

   private _updateBookList(books) {
    const { offlineBooks, onlineBooks } = this.state;

    const offBooks = books.filter((i) => i.isDownloaded === true);
    const onBooks = books.filter((i) => i.isDownloaded === false);

    offlineBooks.push(...offBooks);
    onlineBooks.push(...onBooks);

    this.setState({
      allLoaded: books.length < 10,
      offlineBooks,
      onlineBooks,
      previewBook: onlineBooks[0] || offlineBooks[0],
      status: APP_STATUS.LOADED,
    });
  }

   private onBookSelected = () => (book: Book) => {
    this.setState({ previewBook: book });
  }
}
