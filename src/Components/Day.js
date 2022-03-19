import React from 'react';
import styles from '../Styles/day.module.css';

function Day(props) {
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
          <h1>Today's Notes</h1>

          {props?.day?.notes}
        </div>
        <div className={styles.dinner}>
          <h1>Tonight's Dinner</h1>
          <h3>{props?.day.dinner?.name?.toUpperCase()}</h3>
          <ul>
            {props?.day?.dinner?.ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <p>{props?.day?.dinner?.notes}</p>
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
