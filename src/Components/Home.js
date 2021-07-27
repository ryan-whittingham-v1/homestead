import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import Today from './Today';
import firebase from '../firebase.js';

const Home = () => {
  const [dinners, setDinners] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    firebase
      .database()
      .ref()
      .on('value', (snapshot) => {
        const database = snapshot.val();
        setDinners(database.dinners);
        setWeeks(database.weeks);
        setIsLoaded(true);
      });
  }, []);

  if (isLoaded) {
    return (
      <>
        <Menu />
        <Today weeks={weeks} />
      </>
    );
  } else {
    return <h1>loading...</h1>;
  }
};

export default Home;
