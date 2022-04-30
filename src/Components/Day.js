import React, { useEffect, useState } from 'react';

import styles from '../Styles/day.module.css';

function Day(props) {
  const [dinnerDetailsVisible, setDinnerDetailsVisible] = useState(false);
  const [dinnerScheduled, setDinnerScheduled] = useState(false);

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
        return 'LOADING';
    }
  }

  function showDinnerDetails() {
    setDinnerDetailsVisible(!dinnerDetailsVisible);
  }

  useEffect(() => {
    if (props?.day?.dinner?.name) {
      setDinnerScheduled(true);
    }
  }, [props.day]);

  if (props.day) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <div className={styles.headingMain}>
            <h1>{getDayName(props.day.date.getDay())}</h1>
          </div>
          <div className={styles.headingSub}>
            <h2>
              {props.day.date?.getMonth() + 1} / {props.day.date?.getDate()} /
              {props.day.date?.getFullYear()}
            </h2>
          </div>
        </div>
        <div className={styles.dinner}>
          <div className={styles.dinnerHead}>
            <h2>TONIGHT'S MENU</h2>
          </div>
          <div className={styles.dinnerName}>
            {dinnerScheduled ? (
              <>
                <h3>{props?.day.dinner?.name?.toUpperCase()}</h3>
                <button type="button" onClick={showDinnerDetails}>
                  {dinnerDetailsVisible ? '▲' : '▼'}
                </button>
              </>
            ) : (
              <h3>Nothing Scheduled</h3>
            )}
          </div>
          {dinnerDetailsVisible && (
            <div className={styles.dinnerDetails}>
              <h4>RECIPE</h4>
              <ul>
                {props?.day?.dinner?.ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <p>{props?.day?.dinner?.notes}</p>
            </div>
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
