import React from 'react';
import firebase from '../firebase';
import DinnersControl from '../Components/DinnersControl';

const Home = () => {
  return (
    <>
      <button onClick={() => firebase.auth().signOut()}>Sign out</button>
      <DinnersControl />
    </>
  );
};

export default Home;
