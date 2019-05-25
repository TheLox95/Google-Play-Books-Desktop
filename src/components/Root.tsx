import * as React from "react";
import { APP_STATUS, defaultContext, IGlobalState } from "./App";

type Partial<T> = {
  [P in keyof T]?: T[P];
};

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

  public updateContext = (data: Partial<IGlobalState>) => {
    this.currentGlobalState = { ...this.currentGlobalState, ...data };
    this.forceUpdate();
  }

  public setError = (err) => {
    this.updateContext({
      error: {
        hasError: true,
        message: err.toString(),
      },
      status: APP_STATUS.LOADED,
    });
  }
}
