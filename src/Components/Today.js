import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';

function Today(props) {
  const { weeks } = props;
  const [dinner, setDinner] = useState('loading');

  let today = new Date();

  useEffect(() => {
    // set today's time to end of day
    today.setHours(23, 59, 59, 999);
    console.log('today: ' + today);
    // determine day of the week index
    let dayOfWeek = today.getDay();
    // enumerate through scheduled weeks array to find if a dinner is scheduled
    for (const [key, value] of Object.entries(weeks)) {
      let week = value;
      // for each week in weeks
      for (const [key, value] of Object.entries(week)) {
        // enumerate through weeks dates
        if (key === 'dates') {
          let date = new Date(value[dayOfWeek]);
          console.log('date: ' + date);
          // if week date is equal to today
          if (date.getTime() === today.getTime()) {
            console.log('found match');
            // grab dinner from dinner array in the week
            console.log("today's dinner: " + week.dinners[dayOfWeek]);
            setDinner(week.dinners[dayOfWeek]);
          }
        }
      }
    }
  }, []);

  if (weeks) {
    return (
      <>
        <Header as="h1">
          {today.getMonth()} / {today.getDate()} /{today.getFullYear()}
        </Header>
        <h1>Tonight's Dinner</h1>
        <h3>{dinner.toUpperCase()}</h3>
      </>
    );
  } else {
    return <p>loading today's dinner...</p>;
  }
}

export default Today;
