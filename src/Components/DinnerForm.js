import React, { useEffect, useState } from 'react';

import firebase from '../firebase.js';
import styles from '../Styles/dinnerForm.module.css';

export default function DinnerForm(props) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(null); // index for day of week i.e. 0 = Sunday ... 6 = Saturday
  const [selectedDinners, setSelectedDinners] = useState(props.selectedDinners); // array of selected dinner objects

  // Dinner Sorting Function
  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.toUpperCase();
    const nameB = b.toUpperCase();

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
      let dinnerNames = [];
      for (const [key, value] of Object.entries(dinners)) {
        dinnerNames.push(value.name);
      }
      // sort dinners
      let sortedDinners = [...dinnerNames];
      sortedDinners.sort(compare);

      // create html option for each dinner
      return sortedDinners.map((dinner, index) => {
        return (
          <option key={index} value={dinner}>
            {dinner.toUpperCase()}
          </option>
        );
      });
    } else {
      return (
        <option key={'loading'} value="loading">
          loading...
        </option>
      );
    }
  }

  function handleChange(event) {
    let scheduledDinners = [...selectedDinners];
    scheduledDinners[selectedDayIndex] = event.target.value;
    setSelectedDinners([...scheduledDinners]);
  }

  function handleSubmit(e) {
    //convert preselectedDinners to dinner ids

    //
    let userId = firebase.auth().currentUser.uid;
    e.preventDefault();
    firebase
      .database()
      .ref('users/' + userId + '/')
      .child('weeks')
      .update({
        [JSON.stringify(props.weekDates[0]).substring(1, 11)]: [
          { dinner: selectedDinners[0] },
          { dinner: selectedDinners[1] },
          { dinner: selectedDinners[2] },
          { dinner: selectedDinners[3] },
          { dinner: selectedDinners[4] },
          { dinner: selectedDinners[5] },
          { dinner: selectedDinners[6] },
        ],
      });
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
