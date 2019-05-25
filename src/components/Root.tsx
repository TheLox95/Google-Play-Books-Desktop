import * as React from "react";
import { defaultContext, APP_STATUS, GlobalState } from "./App";

type Partial<T> = {
  [P in keyof T]?: T[P];
}

export class Root<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  public bootstrappedContext;
  public currentGlobalState;

  constructor(props) {
    super(props);

    this.currentGlobalState = defaultContext;

  }

  public onComponentDidMount() {
    this.bootstrappedContext = { ...this.context, setStatus: this.updateContext };
  }

  updateContext = (data: Partial<GlobalState>) => {
    this.currentGlobalState = { ...this.currentGlobalState, ...data };
    this.forceUpdate();
  }

  setError = (err) => {
    this.updateContext({
      status: APP_STATUS.LOADED,
      error: {
        hasError: true,
        message: err.toString(),
      }
    });
  }
}