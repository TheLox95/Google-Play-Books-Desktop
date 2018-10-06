import * as React from "react";
import { Container, Grid, Header } from "semantic-ui-react";
import { Book } from "../entities/Book";
import BookContainer from "./BookContainer";

interface IProps {
    books: Book[];
    title: string;
    onBookSelected?: (book: Book) => void;
 }

export default class BooksGrid extends React.Component<IProps, {}> {

    public toMatrix(arr: any[], elementsPerRow = 3): Book[][] {
        return arr.reduce((rows, key, index) => (index % elementsPerRow === 0 ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows, []);
    }
    public render() {
        const {books, onBookSelected} = this.props;
        const bookTable = this.toMatrix(books);
        return (
            <Container>
                <Header as="h1">{this.props.title}</Header>
                <Grid columns={3}>
                    {bookTable.map((bookRow, idx) => {
                        return (<Grid.Row key={idx}>
                            {bookRow.map((book) => {
                                return (<Grid.Column key={book.id}>
                                    <BookContainer onBookSelected={onBookSelected} book={book}/>
                                </Grid.Column>);
                            })}
                        </Grid.Row>);
                    })}
                </Grid>
            </Container>
        );
    }
 }
