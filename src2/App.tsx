import * as React from 'react';
interface IProps {
   compiler: string,
   framework: string,
   bundler: string
}
export class App extends React.Component<IProps, {}> {
   render() {
   return (
    <div>
      <h1>This is a <i>{this.props.framework}</i> application using <i>{this.props.compiler}</i> with <i>{this.props.bundler}</i></h1>
      <h4>Ohh YEAH!</h4>
      <h4>Ohh YEAH!</h4>
      <h4>Ohh YEAH!</h4>
      <h4>Ohh YEAH!</h4>
      <h4>Ohh YEAH!</h4>
      <h4>Ohh YEAH!</h4>
    </div>
  )
   }
}