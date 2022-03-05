import React from 'react';
import { Header } from 'semantic-ui-react';

function Day(props) {
  if (props.day) {
    return (
      <>
        <Header as="h1">
          {props.day.date?.getMonth() + 1} / {props.day.date?.getDate()} /
          {props.day.date?.getFullYear()}
        </Header>
        <h1>Tonight's Dinner</h1>
        <h3>{props?.day.dinner?.name?.toUpperCase()}</h3>
        <ul>
          {props?.day?.dinner?.ingredients.map((ingredient, index) => (
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
