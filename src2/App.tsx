import * as React from 'react';
interface IProps {
   compiler: string,
   framework: string,
   bundler: string
}
export class App extends React.Component<IProps, {}> {
   render() {
   return (
    <div className="window">
    <div className="window-content">
      <div className="pane-group">
        <div className="pane-sm sidebar">...</div>
        <div className="pane">...</div>
      </div>
    </div>
  </div>
  )
   }
}