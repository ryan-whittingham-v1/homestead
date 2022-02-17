import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import firebase from '../firebase.js';
import { AuthContext } from './Auth.js';

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push('/');
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);
  console.log('user: ' + JSON.stringify(currentUser));

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Homestead FRP</h1>
      <h4>Demo Login Credentials</h4>
      <p>email: demouser@whittingham.io </p>
      <p>password: demo123</p>

      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="password" />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(Login);
