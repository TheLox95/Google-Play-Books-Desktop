import * as React from "react";
import * as ReactDOM from "react-dom";
import "../node_modules/photonkit/dist/css/photon.css";
import "../node_modules/semantic-ui/dist/semantic.css";
import "./app.css";
import {AppContainer} from "./components/App";

ReactDOM.render(
  <AppContainer />,
  document.getElementById("root"),
);
