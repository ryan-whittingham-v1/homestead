import React from 'react';
import firebase from '../firebase';
import Dinners from '../Components/Dinners';

const Home = () => {
  return (
    <>
      <h1>Homestead</h1>
      <Dinners />
      <button onClick={() => firebase.auth().signOut()}>Sign out</button>
    </>
  );
};

export default Home;
