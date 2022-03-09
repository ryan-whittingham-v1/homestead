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

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div
          className={styles.logo}
          style={{
            backgroundImage: "url('/logo512.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
          }}
        ></div>
        <div className={styles.headerText}>
          <h1>HOMESTEAD</h1>
        </div>
      </div>

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
          <button type="submit">Log In</button>
        </div>
      </form>
      <div className={styles.demoWrapper}>
        <h1>DEMO ACCOUNT</h1>
        <p>Email: demoapp@whittingham.io </p>
        <p>Password: demo.password</p>
      </div>
    </div>
  );
};

export default withRouter(Login);
