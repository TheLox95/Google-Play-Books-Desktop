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

export enum APP_STATUS {
  BOOTSTRAP,
  LOGIN_NEEDED,
  FETCHING,
  LOADED,
}

export interface IError {
  error: {
    hasError: boolean;
    message: string,
  };
  setError: (msg: string) => void;
}

export interface IGlobalState extends IError {
  status: APP_STATUS;
  setStatus: (msg: IGlobalState) => void;
}
export const defaultContext = {
  error: {
    hasError: false,
    message: "NO_ERROR",
  },
  setError: (msg: string) => {
    return msg;
  },
  setStatus: (obj: IGlobalState) => {
    return obj;
  },
  status: APP_STATUS.BOOTSTRAP,
};
export const GLOBAL_CONTEXT = React.createContext<IGlobalState>(defaultContext);

import { Root } from "../Root";
import { AppPresentational } from "./AppPresentational";

interface IState {
  onlineBooks: Book[];
  offlineBooks: Book[];
  previewBook?: Book;
  showOnly: OPTIONS;
  canConnect: boolean;
  index: number;
  allLoaded: boolean;
}

export class AppContainer extends Root<{}, IState> {
  public static contextType = GLOBAL_CONTEXT;

  constructor(props) {
    super(props);

    this.state = {
      allLoaded: false,
      canConnect: false,
      index: 0,
      offlineBooks: [],
      onlineBooks: [],
      showOnly: OPTIONS.ALL,
    };
  }

  public componentDidMount() {
    this.onComponentDidMount();
    const conectivityS = CONTAINER.resolve<IConnectivityService>(ConnectivityService);

    conectivityS.getConnectionStatus()
      .then((canConnect) => {
        const state = {
          canConnect,
        };
        this.setState(state);
        if (canConnect === true) {
          this._onBootstrap();
        }
        conectivityS.observeConnection()
          .subscribe(
            (canConnectRes) => this.setState({canConnect: canConnectRes}),
            (err) => {
              this.setState({canConnect: false});
              this.setError(err);
            });
      })
      .catch((err) => {
        this.setState({canConnect: false});
        this.setError(err);
      });
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
    const { index, offlineBooks, onlineBooks, showOnly, canConnect, allLoaded, previewBook } = this.state;

    return (
      <GLOBAL_CONTEXT.Provider value={ this.currentGlobalState }>
          <AppPresentational
            onlineBooks={onlineBooks}
            offlineBooks={offlineBooks}
            previewBook={previewBook}
            showOnly={showOnly}
            status={this.currentGlobalState.status}
            canConnect={canConnect}
            index={index}
            allLoaded={allLoaded}
            onLoadMore={this._onLoadMore}
            onBookSelected={this.onBookSelected}
            onOptionSelected={this.onOptionSelected}
          />
      </GLOBAL_CONTEXT.Provider>
    );
   }

   private _onLoadMore = () => () => {
    const { index } = this.state;
    this._fetchBooks(index);
   }

   private _onBootstrap() {
    const loginS = CONTAINER.resolve<ILoginService>(LoginService);

    if (loginS.appNeedsLogin() === true) {
      this.updateContext({ status: APP_STATUS.LOGIN_NEEDED});
      loginS.listenUserLogin()
      .subscribe((code) => {
          loginS.saveToken(code)
          .then(() => {
            this._fetchBooks();
          });
      }, this.setError);
    } else {
      this._fetchBooks();
    }
  }

  private _fetchBooks(index = 0) {
    const service = CONTAINER.resolve<IBookService>(BookService);

    this.updateContext({ status: APP_STATUS.FETCHING});

    return service.getAll(index)
    .then((booksRes) => {
      this._updateBookList(booksRes);
      let { index: currentIndex } = this.state;
      currentIndex++;
      this.setState({ index: currentIndex });
    })
    .catch(this.setError);
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
    });
    this.updateContext({ status: APP_STATUS.LOADED });
  }

   private onBookSelected = () => (book: Book) => {
    this.setState({ previewBook: book });
  }
}
