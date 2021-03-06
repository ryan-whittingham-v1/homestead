import React, { useEffect, useState } from 'react';

import firebase from '../firebase.js';
import styles from '../Styles/dinnerForm.module.css';

export default function DinnerForm(props) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(null); // index for day of week i.e. 0 = Sunday ... 6 = Saturday
  const [selectedDinners, setSelectedDinners] = useState(props.selectedDinners); // array of selected dinner objects

  // Dinner Sorting Function
  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.props.value.toUpperCase();
    const nameB = b.props.value.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  function getDinnerOptions(dinners) {
    // if dinners is not empty
    if (dinners) {
      let dinnersArray = [];

      for (const [key, value] of Object.entries(dinners)) {
        dinnersArray.push(
          <option key={key} value={value.name}>
            {value.name.toUpperCase()}
          </option>
        );
      }
      // sort dinners
      dinnersArray.sort(compare);
      return dinnersArray;
    } else {
      return <option>loading...</option>;
    }
  }

  function getDinnerID(dinner) {
    for (const [key, value] of Object.entries(props.dinners)) {
      if (dinner === value.name) {
        return key;
      }
    }
    return '--';
  }

  function handleChange(event) {
    let scheduledDinners = [...selectedDinners];
    scheduledDinners[selectedDayIndex] = event.target.value;
    setSelectedDinners([...scheduledDinners]);
  }

  function handleSubmit(e) {
    let userId = firebase.auth().currentUser.uid;
    e.preventDefault();
    for (let i = 0; i < selectedDinners.length; i++) {
      firebase
        .database()
        .ref(
          'users/' +
            userId +
            '/weeks/' +
            JSON.stringify(props.weekDates[0]).substring(1, 11) +
            '/' +
            i +
            '/'
        )
        .update({ dinner: getDinnerID(selectedDinners[i]) });
    }

    window.alert('Dinners Saved!');
  }

  useEffect(() => {
    setSelectedDinners([...props.selectedDinners]);
  }, [props.selectedDinners]);

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
      <label onClick={() => setSelectedDayIndex(0)}>
        Sunday
        <br />
        <select value={selectedDinners[0]} onChange={handleChange}>
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
      <br />
      <label onClick={() => setSelectedDayIndex(1)}>
        Monday
        <br />
        <select value={selectedDinners[1]} onChange={handleChange}>
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
      <br />
      <label onClick={() => setSelectedDayIndex(2)}>
        Tuesday
        <br />
        <select value={selectedDinners[2]} onChange={handleChange}>
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
      <br />
      <label onClick={() => setSelectedDayIndex(3)}>
        Wednesday
        <br />
        <select value={selectedDinners[3]} onChange={handleChange}>
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
      <br />
      <label onClick={() => setSelectedDayIndex(4)}>
        Thursday
        <br />
        <select value={selectedDinners[4]} onChange={handleChange}>
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
      <br />
      <label onClick={() => setSelectedDayIndex(5)}>
        Friday
        <br />
        <select value={selectedDinners[5]} onChange={handleChange}>
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
      <br />
      <label onClick={() => setSelectedDayIndex(6)}>
        Saturday
        <br />
        <select value={selectedDinners[6]} onChange={handleChange}>
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
      <br />
      <div className={styles.buttonWrapper}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
