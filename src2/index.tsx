import * as React from "react";
import * as ReactDOM from "react-dom";
import "../node_modules/photonkit/dist/css/photon.css";
import "../node_modules/semantic-ui/dist/semantic.css";
import {AppContainer} from "./components/App";
import "./app.css";

ReactDOM.render(
  <AppContainer/>,
  document.getElementById("root"),
);
