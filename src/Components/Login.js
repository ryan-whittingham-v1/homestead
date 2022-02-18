import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import firebase from '../firebase.js';
import { AuthContext } from './Auth.js';
import styles from '../Styles/login.module.css';

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
    <div className={styles.wrapper}>
      <h1 className={styles.header}>Homestead Meal Planner</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <label>
          <p>Email</p>
          <input name="email" type="email" placeholder="email" />
        </label>
        <label>
          <p>Password</p>
          <input name="password" type="password" placeholder="password" />
        </label>
        <div className={styles.buttonWrapper}>
          <button type="submit">Log in</button>
        </div>
      </form>
      <div className={styles.demoWrapper}>
        <h4>WANT TO DEMO THE APP?</h4>
        <p>Use the following credentials to see Homestead in action.</p>
        <p>Email: demouser@whittingham.io </p>
        <p>Password: demo123</p>
      </div>
    </div>
  );
};

export default withRouter(Login);
