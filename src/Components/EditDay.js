import React from 'react';
import styles from '../Styles/editDay.module.css';

export default function EditDay(props) {
  function getDayName(dayNum) {
    switch (dayNum) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      default:
        return 'loading';
    }
  }

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

  function handleDinnerChange(event) {
    props.updateDayDinner(
      props?.date?.getDay(),
      getDinnerID(event.target.value)
    );
  }

  function handleNotesChange(event) {
    props.updateDayNotes(props?.date?.getDay(), event.target.value);
  }

  let dinner;
  let notes;

  if (props.scheduledData && props.date) {
    dinner = (
      <label>
        Dinner
        <br />
        <select
          value={
            props.dinners[props.scheduledData.dinner]
              ? props.dinners[props.scheduledData.dinner].name
              : '--'
          }
          onChange={handleDinnerChange}
        >
          <option>---</option>
          {getDinnerOptions(props.dinners)}
        </select>
      </label>
    );

    notes = (
      <label>
        Notes
        <br />
        <textarea
          value={props.scheduledData.notes ? props.scheduledData.notes : ''}
          onChange={handleNotesChange}
          id="notes"
          rows="5"
          cols="36"
        />
      </label>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1>{getDayName(props?.date?.getDay())}</h1>
      {dinner}
      {notes}
    </div>
  );
}
