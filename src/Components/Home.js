import React, { useEffect, useState, useCallback } from 'react';
import Menu from './Menu';
import Day from './Day';
import DinnerFormTwo from './DinnerFormTwo';
import firebase from '../firebase.js';
import { Loader, Dimmer, Segment } from 'semantic-ui-react';

const Home = () => {
  const [dinners, setDinners] = useState([]);
  const [days, setDays] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [day, setDay] = useState({});

  useEffect(() => {
    let userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + userId + '/')
      .on('value', (snapshot) => {
        const firebaseData = snapshot.val();
        setDays(firebaseData.days);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    let today = new Date();
    today.setHours(23, 59, 59, 999);
    // enumerate through days array
    days.forEach((day) => {
      console.log('day: ' + JSON.stringify(day));
      let date = new Date(day.date);
      if (date.getTime() === today.getTime()) {
        console.log('found match');
        setDay(day);
      }
    });
  }, [days]);

  let visibleState = [<Menu />, <Loader active inline="centered" />];

  if (isLoaded) {
    visibleState = [<Menu />, <Day day={day} />];
  }

  return visibleState;
};

export default Home;
