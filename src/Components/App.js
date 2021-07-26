import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Menu from './Menu';
import DinnersControl from './DinnersControl';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/dinners" component={DinnersControl} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
