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
            <div style={{flex: "0 1 auto", display: "flex", justifyContent: "flex-end", marginBottom: "5%" }}>
                <Menu pointing secondary vertical>
                <Menu.Item name={OPTIONS.ALL} active={optionActive === OPTIONS.ALL} onClick={this.onOptionSelected()} />
                <Menu.Item
                    name={OPTIONS.ONLINE}
                    active={optionActive === OPTIONS.ONLINE}
                    onClick={this.onOptionSelected()}
                />
                <Menu.Item
                    name={OPTIONS.OFFLINE}
                    active={optionActive === OPTIONS.OFFLINE}
                    onClick={this.onOptionSelected()}
                />
                </Menu>
            </div>
        </div>
        );
    }
}
