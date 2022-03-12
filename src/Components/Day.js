import React from 'react';
import { Header } from 'semantic-ui-react';

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
      <>
        <h1>{getDayName(props.day.date.getDay())}</h1>
        <Header as="h1">
          {props.day.date?.getMonth() + 1} / {props.day.date?.getDate()} /
          {props.day.date?.getFullYear()}
        </Header>
        <h1>Tonight's Dinner</h1>
        <h3>{props?.day.dinner?.name?.toUpperCase()}</h3>
        <ul>
          {props?.day?.dinner?.ingredients?.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <p>{props?.day?.dinner?.notes}</p>
        {props?.day?.messages && <h3>Today's Notes</h3> && (
          <ul>
            {props?.day?.messages?.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        )}
      </>
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
