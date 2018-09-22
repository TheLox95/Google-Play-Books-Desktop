import * as React from "react";
import { If, Then } from "react-if";
import { Button, Card, Header, Image } from "semantic-ui-react";
import { Book } from "../entities";

interface IProps {
    book: Book;
    detailed?: boolean;
}

const bookContainer: React.SFC<IProps> = (props) => {
    return (
        <Card centered={true}>
            <Image src={props.book.thumbnail.toString()} disabled={!props.book.isDownloaded}/>
            <Card.Content>
            <Header as="h2" disabled={!props.book.isDownloaded}>
                {props.book.title}
            </Header>
            <If condition={props.detailed === true}>
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
            <Button basic color="teal" disabled={!props.book.isDownloaded}>
                Read online
            </Button>
            <If condition={ props.book.isDownloaded }>
                <Then>
                    <Button basic color="olive">
                        Read offline
                    </Button>
                </Then>
            </If>
            </div>
        </Card.Content>
        </Card>
    );
};

bookContainer.defaultProps = {
    detailed: false,
};

export {bookContainer};
