import React, { useEffect, useState } from 'react';

import styles from '../Styles/dinnerList.module.css';

export default function DinnerList(props) {
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

  function addDinner() {
    props.addDinner();
  }

  function createButtons() {
    let dinners = [];
    for (const [key, value] of Object.entries(props?.dinners)) {
      dinners.push(
        <button key={key} type="button" onClick={() => props.callback(key)}>
          {value.name.toUpperCase()}
        </button>
      );
    }
    return dinners;
  }

  return (
    <div className={styles.wrapper}>
      {createButtons()}
      <button type="button" onClick={addDinner}>
        +
      </button>
    </div>
  );
}
