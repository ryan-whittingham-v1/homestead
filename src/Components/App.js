import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import Header from './Header';

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
