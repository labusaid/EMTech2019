import React from 'react';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { Home } from './Home';
import { About } from './About';
import { Pissed } from './Pissed';
import { Stoked } from './Stoked';
import { NoMatch } from './NoMatch';
import Sidebar from './components/Sidebar';


function App() {
  return (
      <React.Fragment>
          <Router>
              <NavigationBar />

              <Sidebar />
              <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/about" component={About} />
                  <Route path="/Pissed" component={Pissed} />
                  <Route path="/Stoked" component={Stoked} />
                  <Route component={NoMatch} />
              </Switch>
          </Router>
      </React.Fragment>
  );
}

export default App;
