import firebase from '../firebase.js';
import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import styles from '../Styles/editWeeks.module.css';
import EditDay from './EditDay';

export default function EditWeeks() {
  const [currentWeeksDates, setCurrentWeeksDates] = useState([]);
  const [weeksData, setWeeksData] = useState({});
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

  function getWeeksData() {
    let weeksDataTemp =
      userData?.weeks[currentWeeksDates[0]?.toISOString().split('T')[0]];
    if (weeksDataTemp?.length > 0) {
      setWeeksData([...weeksDataTemp]);
    } else {
      setWeeksData([
        { dinner: '---', notes: '' },
        { dinner: '---', notes: '' },
        { dinner: '---', notes: '' },
        { dinner: '---', notes: '' },
        { dinner: '---', notes: '' },
        { dinner: '---', notes: '' },
        { dinner: '---', notes: '' },
      ]);
    }
  }

  function updateDayDinner(day, dinner) {
    let weeksDataTemp = [...weeksData];
    weeksDataTemp[day].dinner = dinner;
    setWeeksData([...weeksDataTemp]);
  }

  function updateDayNotes(day, notes) {
    let weeksDataTemp = [...weeksData];
    Object.assign(weeksDataTemp[day], { notes: notes });
    setWeeksData(weeksDataTemp);
  }

  function createEditWeek() {
    let editWeek = [];

    for (let step = 0; step < 7; step++) {
      editWeek.push(
        <EditDay
          key={step}
          date={currentWeeksDates[step]}
          dinners={userData.dinners}
          scheduledData={weeksData[step]}
          updateDayDinner={updateDayDinner}
          updateDayNotes={updateDayNotes}
        />
      );
    }
    return editWeek;
  }

  function handleSave() {
    let userId = firebase.auth().currentUser.uid;
    for (let i = 0; i < weeksData.length; i++) {
      firebase
        .database()
        .ref(
          'users/' +
            userId +
            '/weeks/' +
            JSON.stringify(currentWeeksDates[0]).substring(1, 11) +
            '/' +
            i +
            '/'
        )
        .update({
          dinner: weeksData[i].dinner,
          notes: weeksData[i].notes ? weeksData[i].notes : '',
        });
    }

    window.alert('Week Saved!');
  }

  // update local state at initial startup
  useEffect(() => {
    getCurrentWeek();
    getUserData();
  }, []);

  useEffect(() => {
    getUserData();
  }, [currentWeeksDates]);

  useEffect(() => {
    if (isLoaded) {
      getWeeksData();
    }
  }, [userData, isLoaded]);

  return (
    <>
      <Menu />
      <div className={styles.wrapper}>
        <h2>WEEKLY SCHEDULE</h2>
        {weekTitle()}
        <div className={styles.weekNavWrapper}>
          <button type="button" onClick={handlePrevWeek}>
            Previous Week
          </button>
          <button type="button" onClick={handleNextWeek}>
            Next Week
          </button>
        </div>
        <div className={styles.editWeek}>
          {createEditWeek()}
          <button type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
