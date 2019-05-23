import * as React from "react";
import { Menu  } from "semantic-ui-react";
import { Book } from "../entities";
import BookContainer from "./BookContainer";

interface IProps {
    book?: Book;
    onOptionSelected: (option) => void;
}

interface IState {
    optionActive: OPTIONS;
}

export enum OPTIONS {
    ALL = "all",
    OFFLINE = "offlineBooks",
    ONLINE = "onlineBooks",
}

export default class SideMenu extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);
        this.state = {
            optionActive: OPTIONS.ALL,
        };
    }

    public onOptionSelected = () => (e, { name: optionName }) => {
        const { onOptionSelected } = this.props;
        this.setState({ optionActive: optionName });
        onOptionSelected(optionName);
    }

    public render() {
        const { optionActive } = this.state;
        return (
        <div
            className="pane-sm sidebar"
            style={{width: "30%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <div style={{flex: 2}}>
                {this.props.book !== undefined && <BookContainer
                    book={this.props.book}
                    detailed={true}
                    disableAnimation={true}
                    forceActive={true}
                />}
            </div>
        </div>
        );
    }
}
