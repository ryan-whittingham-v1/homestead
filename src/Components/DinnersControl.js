import firebase from '../firebase.js';
import React, { useEffect, useState } from 'react';
import DinnerForm from './DinnerForm';
import Menu from './Menu';
import styles from '../Styles/dinnersControl.module.css';

export default function DinnersControl() {
  const [currentWeeksDates, setCurrentWeeksDates] = useState([]);
  const [currentWeeksDinners, setCurrentWeeksDinners] = useState([]);
  const [userData, setUserData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

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

  function handleNextWeek() {
    // create empty array for next week dates
    let nextWeek = [];
    let dates = [...currentWeeksDates];
    // create new week of dates based off of last day of current week
    if (dates) {
      let prevSunday = new Date(dates[6]);
      for (let i = 1; i <= 7; i++) {
        let nextDay = new Date(prevSunday);
        nextDay.setDate(nextDay.getDate() + i);
        nextDay.setHours(23, 59, 59, 999);
        nextWeek.push(nextDay);
      }
      // save dates array to state
      setCurrentWeeksDates([...nextWeek]);
    }
  }

  function handlePrevWeek() {
    let dates = [...currentWeeksDates];
    // create empty array for next week dates
    let prevWeek = [];
    // create new week of dates based off of last day of current week
    if (dates) {
      let currentSunday = new Date(dates[0]);
      for (let i = 1; i <= 7; i++) {
        let nextPrevDay = new Date(currentSunday);
        nextPrevDay.setDate(nextPrevDay.getDate() - i);
        nextPrevDay.setHours(23, 59, 59, 999);
        prevWeek.unshift(nextPrevDay);
      }
      // save array of previous week's dates to state
      setCurrentWeeksDates([...prevWeek]);
    }
  }

  function getUserData() {
    let userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + userId + '/')
      .once('value', (snapshot) => {
        const firebaseData = snapshot.val();
        setUserData(firebaseData);
        setIsLoaded(true);
      });
  }

  function weekTitle() {
    // if week info present
    if (currentWeeksDates) {
      let firstDayOfWeek = new Date(currentWeeksDates[0]);
      let lastDayOfWeek = new Date(currentWeeksDates[6]);
      let startOfWeekMonth = firstDayOfWeek.getMonth() + 1;
      let endOfWeekMonth = lastDayOfWeek.getMonth() + 1;
      return (
        <h3>
          {'Week: ' +
            startOfWeekMonth +
            '/' +
            firstDayOfWeek.getDate() +
            ' to ' +
            endOfWeekMonth +
            '/' +
            lastDayOfWeek.getDate()}
        </h3>
      );
    } else {
      return <h3>loading...</h3>;
    }
  }

  function getWeeksDinners() {
    let weeksData =
      userData?.weeks[currentWeeksDates[0]?.toISOString().split('T')[0]];
    if (weeksData?.length > 0) {
      let weeksDinners = weeksData.map((day) => day.dinner);
      /* let weeksDinners = weeksDinnersIDs.map(
        (id) => userData.dinners[id]?.name
      ); */
      setCurrentWeeksDinners([...weeksDinners]);
    } else {
      setCurrentWeeksDinners(['---', '---', '---', '---', '---', '---', '---']);
    }
  }

  // update local state at initial startup
  useEffect(() => {
    getCurrentWeek();
    getUserData();

    /*  // cleanup
    return () => {
      firebase.database().goOffline();
    }; */
  }, []);

  useEffect(() => {
    if (isLoaded) {
      getWeeksDinners();
    }
  }, [isLoaded, currentWeeksDates]);

  return (
    <>
      <Menu />
      <div className={styles.wrapper}>
        <h2>DINNER SCHEDULE</h2>
        {weekTitle()}
        <div className={styles.weekNavWrapper}>
          <button type="button" onClick={handlePrevWeek}>
            Previous Week
          </button>
          <button type="button" onClick={handleNextWeek}>
            Next Week
          </button>
        </div>
        <DinnerForm
          dinners={userData.dinners}
          weekDates={currentWeeksDates}
          selectedDinners={currentWeeksDinners}
        />
      </div>
    </>
  );
}

/* 

  componentWillUnmount() {
    // disconnect from firebase
    this.ref.off();
  }
*/
