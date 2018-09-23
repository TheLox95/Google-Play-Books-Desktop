import * as React from "react";
import { If, Then } from "react-if";
import { Button, Card, Header, Image } from "semantic-ui-react";
import { Book } from "../entities";
import { CONTAINER } from "../injections";
import { ConfigService, IConfigService } from "../services";
import { OfflineReader, OnlineReader } from "./readers";

interface IProps {
    book: Book;
    detailed?: boolean;
    forceActive?: boolean;
}

enum ReaderType {
    ONLINE,
    OFFLINE,
}

export default class BookContainer extends React.Component<IProps, {}> {
    public static defaultProps = { detailed: false, forceActive: false };

    public render() {
        const { book, detailed, forceActive } = this.props;
        const isDisabled = !forceActive && !book.isDownloaded;
        return (
            <Card centered={true}>
                <Image src={book.thumbnail.toString()} disabled={isDisabled}/>
                <Card.Content>
                <Header as="h2" disabled={isDisabled}>
                    {book.title}
                </Header>
                <If condition={detailed === true}>
                    <Then>
                        <React.Fragment>
                            <Card.Meta>
                            <span className="date">Joined in 2015</span>
                            </Card.Meta>
                                <Card.Description >Matthew is a musician living in Nashville.</Card.Description>
                        </React.Fragment>
                    </Then>
                </If>
                </Card.Content>
                <Card.Content extra>
                <div className="ui two buttons">
                <Button basic color="teal" disabled={!book.isDownloaded} onClick={this.openReader(ReaderType.ONLINE)}>
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
