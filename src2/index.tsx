import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./App";
ReactDOM.render(
  <App compiler="npm" framework="React Electron"  bundler="webpack"/>,
  document.getElementById("root")
);