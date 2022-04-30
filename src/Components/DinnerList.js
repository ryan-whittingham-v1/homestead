import React, { useEffect, useState } from 'react';

import styles from '../Styles/dinnerList.module.css';

export default function DinnerList(props) {
  // Dinner Sorting Function
  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.key.toUpperCase();
    const nameB = b.key.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  function addDinner() {
    props.addDinner();
  }

  function getDinnerID(dinner) {
    for (const [key, value] of Object.entries(props.dinners)) {
      if (dinner === value.name) {
        return key;
      }
    }
    return '--';
  }

  function createOptions() {
    let dinners = [];
    for (const [key, value] of Object.entries(props?.dinners)) {
      dinners.push(
        <option
          key={value.name}
          type="button"
          onClick={() => props.callback(key)}
        >
          {value.name.toUpperCase()}
        </option>
      );
    }

    dinners.sort(compare);
    return dinners;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        <select value={props.selectedDinner.name} onChange={handleDinnerChange}>
          {createOptions()}
        </select>
      </div>
    </div>
  );
}
dfs;
