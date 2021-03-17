import React from 'react';
import './app.less';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { UserContext } from './appContext';
import { ClassComponentPage } from './pages/template/classComponentPage';
import { FunctionComponentPage } from './pages/template/functionComponentPage';
import { DemoPage } from './pages/demoPages/demoPages';

export class App extends React.PureComponent {
  state = {
    userInfo: { name: 'xiaoming' }
  };
  render() {
    return (
      <UserContext.Provider value={this.state.userInfo}>
        <BrowserRouter>
          <Switch>
            <Route path="/classComponentPage" exact component={ClassComponentPage} />
            <Route path="/functionComponentPage" exact component={FunctionComponentPage} />
            <Route path="*" exact component={DemoPage} />
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    );
  }
}
export default App;
