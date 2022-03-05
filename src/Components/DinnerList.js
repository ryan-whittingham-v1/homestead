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

  function updateButtons() {
    /* let dinnerNames = [];
    for (const [key, value] of Object.entries(props?.dinners)) {
      dinnerNames.push(value.name);
    }
    // sort dinners
    let sortedDinners = [...dinnerNames];
    sortedDinners.sort(compare);

    // create html option for each dinner
    return sortedDinners.map((dinner, index) => {
      return (
        <button type="button" onClick={() => props.callback(dinner)}>
          {dinner.toUpperCase()}
        </button>
      );
    }); */
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

  return <div className={styles.wrapper}>{updateButtons()}</div>;
}
