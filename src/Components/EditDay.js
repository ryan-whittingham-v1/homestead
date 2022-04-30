import React from 'react';
import styles from '../Styles/editDay.module.css';

export default function EditDay(props) {
  function getDayName(dayNum) {
    switch (dayNum) {
      case 0:
        return 'SUNDAY';
      case 1:
        return 'MONDAY';
      case 2:
        return 'TUESDAY';
      case 3:
        return 'WEDNESDAY';
      case 4:
        return 'THURSDAY';
      case 5:
        return 'FRIDAY';
      case 6:
        return 'SATURDAY';
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
  }

  function handleDinnerChange(event) {
    props.updateDayDinner(
      props?.date?.getDay(),
      getDinnerID(event.target.value)
    );
  }

  let dinner;

  if (props.scheduledData && props.date) {
    dinner = (
      <label>
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
  }

  return (
    <div className={styles.wrapper}>
      <h1>{getDayName(props?.date?.getDay())}</h1>
      {dinner}
    </div>
  );
}
