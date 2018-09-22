import * as React from "react";
import { Menu  } from "semantic-ui-react";
import { Book } from "../entities";
import { bookContainer as BookContainer } from "./BookContainer";

interface IProps {
    book?: Book;
    onOptionSelected: (e, { name }) => void;
}

export enum OPTIONS {
    ALL = "all",
    OFFLINE = "offlineBooks",
    ONLINE = "onlineBooks",
}

export default class SideMenu extends React.Component<IProps, {}> {

    public render() {
        const { onOptionSelected } = this.props;
        return (
        <div
            className="pane-sm sidebar"
            style={{width: "30%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <div style={{flex: 2}}>
                {this.props.book !== undefined && <BookContainer book={this.props.book} detailed={true}/>}
            </div>
            <div style={{flex: 1}}>
            <Menu pointing secondary vertical>
            <Menu.Item name={OPTIONS.ALL} active={true} onClick={onOptionSelected} />
            <Menu.Item
                name={OPTIONS.ONLINE}
                active={true}
                onClick={onOptionSelected}
            />
            <Menu.Item
                name={OPTIONS.OFFLINE}
                active={true}
                onClick={onOptionSelected}
            />
            </Menu>
            </div>
        </div>
        );
    }
}
