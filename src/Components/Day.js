import React from 'react';
import { Header } from 'semantic-ui-react';

function Day(props) {
  const today = new Date(props.day.date);

  if (props.day) {
    return (
      <>
        <Header as="h1">
          {today.getMonth() + 1} / {today.getDate()} /{today.getFullYear()}
        </Header>
        <h1>Tonight's Dinner</h1>
        <h3>{props.day.dinner.toUpperCase()}</h3>
      </>
    );
  } else {
    return <p>loading day</p>;
  }
}

export default Day;
