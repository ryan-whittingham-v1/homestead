import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import Day from './Day';
import firebase from '../firebase.js';
import { Loader } from 'semantic-ui-react';
import styles from '../Styles/home.module.css';

const Home = () => {
  const [userData, setUserData] = useState({});
  const [currentWeeksDates, setCurrentWeeksDates] = useState([]);
  const [today, setToday] = useState({ date: new Date() });

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
      });
  }

  function getTodaysData() {
    let todayTemp =
      userData.weeks[currentWeeksDates[0].toISOString().split('T')[0]][
        today.date.getDay()
      ];
    let dinner = todayTemp.dinner;
    let dinnerId = '';
    for (const [key, value] of Object.entries(userData.dinners)) {
      if (dinner === value.name) {
        dinnerId = key;
      }
    }
    setToday((prevState) => ({
      ...prevState,
      dinner: dinnerId ? userData.dinners[dinnerId] : 'No Dinner Scheduled',
      messages: todayTemp.messages ? todayTemp.messages : '',
    }));
  }

  // update local state at initial startup
  useEffect(() => {
    getCurrentWeek();
    getUserData();

    /* // cleanup
    return () => {
      firebase.database().goOffline();
    }; */
  }, []);

  useEffect(() => {
    if (userData && currentWeeksDates.length === 7) {
      getTodaysData();
    }
  }, [userData]);

  return (
    <>
      <Menu />
      <div className={styles.wrapper}>
        {userData ? <Day day={today} /> : <Loader active inline="centered" />}
      </div>
    </>
  );
};

export default Home;
