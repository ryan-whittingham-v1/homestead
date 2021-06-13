import React from 'react';
import firebase from '../firebase';
import Dinners from '../Components/Dinners';

const Home = () => {
  return (
    <>
      <button onClick={() => firebase.auth().signOut()}>Sign out</button>
      <Dinners />
    </>
  );
};

export default Home;
