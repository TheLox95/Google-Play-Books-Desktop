import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./App";
import './app.css';
import '../node_modules/photonkit/dist/css/photon.css';

ReactDOM.render(
  <App compiler="npm" framework="React Electron"  bundler="webpack"/>,
  document.getElementById("root")
);