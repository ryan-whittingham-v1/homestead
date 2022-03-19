import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import EditWeeks from './EditWeeks';
import EditDinners from './EditDinners';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/schedule" component={EditWeeks} />
          <PrivateRoute exact path="/dinners" component={EditDinners} />

          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
