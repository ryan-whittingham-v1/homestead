import React, { useState } from 'react';

import styles from '../Styles/day.module.css';

function Day(props) {
  const [dinnerDetailsVisible, setDinnerDetailsVisible] = useState(false);

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

  function showDinnerDetails() {
    setDinnerDetailsVisible(!dinnerDetailsVisible);
  }

  if (props.day) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <h1>{getDayName(props.day.date.getDay())}</h1>
          <h2>
            {props.day.date?.getMonth() + 1} / {props.day.date?.getDate()} /
            {props.day.date?.getFullYear()}
          </h2>
        </div>
        <div className={styles.notes}>
          <h1>Messages</h1>
          <p>{props?.day?.notes}</p>
        </div>
        <div className={styles.dinner}>
          <h1>Dinner</h1>
          <div className={styles.dinnerName}>
            <h2>{props?.day.dinner?.name?.toUpperCase()}</h2>
            <button type="button" onClick={showDinnerDetails}>
              {dinnerDetailsVisible ? '▲' : '▼'}
            </button>
          </div>
          {dinnerDetailsVisible && (
            <>
              <h2>Ingredients:</h2>
              <ul>
                {props?.day?.dinner?.ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h2>Instructions</h2>
              <p>{props?.day?.dinner?.notes}</p>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return <p>loading day</p>;
  }
}

Day.defaultProps = {
  day: {
    dinner: '---',
    date: new Date(),
  },
};

export default Day;
