import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import Day from './Day';
import firebase from '../firebase.js';
import { Loader } from 'semantic-ui-react';

const Home = () => {
  const [userData, setUserData] = useState({});
  const [currentWeeksDates, setCurrentWeeksDates] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [today, setToday] = useState({
    date: new Date(),
    dinner: '',
  });

  function getCurrentWeek() {
    // get today's date
    let today = new Date();
    // set today's time to end of day
    today.setHours(23, 59, 59, 999);
    // create new dates array
    let dates = [];
    // determine day of the week from today
    let dayOfWeek = today.getDay();
    // place today at appropriate index using dayOfWeek
    dates[dayOfWeek] = today;
    // update date array with days before today
    for (let index = dayOfWeek - 1; index >= 0; index--) {
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      dates[index] = yesterday;
      today = yesterday;
    }
    // reset today variable
    today = new Date();
    today.setHours(23, 59, 59, 999);
    // update date array with days after today
    for (let index = dayOfWeek + 1; index <= 6; index++) {
      let tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dates[index] = tomorrow;
      today = tomorrow;
    }
    // save dates array to state
    setCurrentWeeksDates(dates);
  }

  function getUserData() {
    let userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + userId + '/')
      .on('value', (snapshot) => {
        const firebaseData = snapshot.val();
        setUserData(firebaseData);
        setIsLoaded(true);
      });
  }

  function getTodaysDinner() {
    let todaysDinner =
      userData?.weeks[currentWeeksDates[0].toISOString().split('T')[0]]
        ?.dinners[today.date.getDay()];
    setToday((prevState) => ({
      ...prevState,
      dinner: todaysDinner ? todaysDinner : 'No Dinner Scheduled',
    }));
  }

  // update local state at initial startup
  useEffect(() => {
    getCurrentWeek();
    getUserData();
  }, []);

  useEffect(() => {
    if (currentWeeksDates.length > 0) {
      getTodaysDinner();
    }
  }, [isLoaded]);

  let visibleState = [<Menu />, <Loader active inline="centered" />];

  if (isLoaded) {
    visibleState = [<Menu />, <Day day={today} />];
  }

  return visibleState;
};

export default Home;
