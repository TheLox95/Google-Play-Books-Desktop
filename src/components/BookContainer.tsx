import * as React from "react";
import { If, Then } from "react-if";
import { Button, Card, Header, Image } from "semantic-ui-react";
import { Book } from "../entities";
import { CONTAINER } from "../injections";
import { BookService, ConfigService, IBookService, IConfigService } from "../services";
import { OfflineReader, OnlineReader } from "./readers";

interface IProps {
    book: Book;
    detailed?: boolean;
    forceActive?: boolean;
    disableAnimation?: boolean;
    onBookSelected?: (book: Book) => void;
}

enum ReaderType {
    ONLINE,
    OFFLINE,
}

export default class BookContainer extends React.Component<IProps, {}> {
    public static defaultProps = { detailed: false, forceActive: false, disableAnimation: false };

    public render() {
        const { book, detailed, forceActive } = this.props;
        const isDisabled = this.isDisabled();
        return (
            <Card centered={true} onClick={this.onBookSelected}>
                <Image src={book.thumbnail.toString()} disabled={isDisabled} />
                <Card.Content>
                    <Header as="h2" disabled={isDisabled}>
                        {book.title}
                    </Header>
                    <If condition={detailed === true}>
                        <Then>
                            <React.Fragment>
                                <Card.Meta>
                                    {book.uploadDate && (
                                        <span className="date">
                                            Upload date {book.uploadDate}
                                        </span>
                                    )}
                                </Card.Meta>
                                {book.description && (
                                    <Card.Description>
                                        {book.description}
                                    </Card.Description>
                                )}
                            </React.Fragment>
                        </Then>
                    </If>
                </Card.Content>
                <Card.Content extra>
                    <div className="ui three buttons">
                    <Button basic color="teal" disabled={isDisabled} onClick={this.openReader(ReaderType.ONLINE)}>
                        Read online
                    </Button>
                    <If condition={ book.isDownloaded }>
                        <Then>
                            <Button basic color="olive" onClick={this.openReader(ReaderType.OFFLINE)}>
                                Read offline
                            </Button>
                        </Then>
                    </If>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    private isDisabled() {
        const { forceActive } = this.props;
        if (forceActive === true) {
            return false;
        }
        return true;
    }

    private onBookSelected = (ev, data) => {
        const { book, onBookSelected } = this.props;
        if (onBookSelected) {
            onBookSelected(book);
        }
    }

    private download = (book) => () => {
        const bService = CONTAINER.resolve<IBookService>(BookService);
        const progress = bService.donwload(book);
        progress.subscribe((progress) => console.log(progress));
    }

    private openReader = (readerType) => () => {
        const { book } = this.props;
        if (readerType === ReaderType.OFFLINE) {
            const offlineReader = new OfflineReader(CONTAINER.resolve<IConfigService>(ConfigService));
            offlineReader.open(book);
        }

        if (readerType === ReaderType.ONLINE) {
            OnlineReader.open(book);
        }
    }
}
