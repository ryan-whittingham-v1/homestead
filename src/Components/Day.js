import React from 'react';
import { Header } from 'semantic-ui-react';

function Day(props) {
  if (props.day) {
    return (
      <>
        <Header as="h1">
          {props.day.date.getMonth() + 1} / {props.day.date.getDate()} /
          {props.day.date.getFullYear()}
        </Header>
        <h1>Tonight's Dinner</h1>
        <h3>{props.day.dinner.toUpperCase()}</h3>
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