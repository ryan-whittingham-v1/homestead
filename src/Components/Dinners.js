import React from 'react';
import firebase from '../firebase.js';

class Dinners extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      database: {},
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = () => {
    let ref = firebase.database().ref();
    ref.on('value', (snapshot) => {
      const database = snapshot.val();
      this.setState(database);
    });
  };

  getAllDinners() {
    const { dinners } = this.state;
    if (dinners) {
      return Object.keys(dinners).map((key) => {
        return <li>{dinners[key].name.toUpperCase()}</li>;
      });
    } else {
      return <></>;
    }
  }

  getIngredients(dinner) {
    if (dinner) {
      return Object.keys(dinner.ingredients).map((key) => {
        return <li>{dinner.ingredients[key]}</li>;
      });
    }
  }

  getFutureDinners() {
    // get today's date
    let today = new Date();
    // get list of dinners
    const { dinners } = this.state;
    // if dinners available
    if (dinners) {
      // traverse the list of dinners
      return Object.keys(dinners).map((key) => {
        // for each dinner, check if it has any scheduled dates
        if (dinners[key].scheduledDates) {
          //  convert scheduled date from string to date obj
          let scheduledDate = new Date(
            Date.parse(dinners[key].scheduledDates[0] + 'T00:00:00')
          );
          console.log(scheduledDate);
          // if the scheduled date is after today
          if (scheduledDate > today) {
            // convert schedled date to day of week
            let dayOfWeek;
            switch (scheduledDate.getDay()) {
              case 0:
                dayOfWeek = 'Sunday';
                break;
              case 1:
                dayOfWeek = 'Monday';
                break;
              case 2:
                dayOfWeek = 'Tuesday';
                break;
              case 3:
                dayOfWeek = 'Wednesday';
                break;
              case 4:
                dayOfWeek = 'Thursday';
                break;
              case 5:
                dayOfWeek = 'Friday';
                break;
              case 6:
                dayOfWeek = 'Saturday';
                break;
              default:
                console.log('date error');
            }
            // get month from scheduled date
            let month;
            switch (scheduledDate.getMonth()) {
              case 0:
                month = 'January';
                break;
              case 1:
                month = 'February';
                break;
              case 2:
                month = 'March';
                break;
              case 3:
                month = 'April';
                break;
              case 4:
                month = 'May';
                break;
              case 5:
                month = 'June';
                break;
              case 6:
                month = 'July';
                break;
              case 7:
                month = 'August';
                break;
              case 8:
                month = 'September';
                break;
              case 9:
                month = 'October';
                break;
              case 10:
                month = 'November';
                break;
              case 11:
                month = 'December';
                break;
              default:
                console.log('date error');
            }
            // get ingredients list
            let ingredients = this.getIngredients(dinners[key]);
            // return date, dinner name, and list of it's ingredients
            return (
              <>
                <h4>
                  {dayOfWeek}, {month} {scheduledDate.getDay()}
                </h4>
                <h3>{dinners[key].name.toUpperCase()}</h3>
                <p>Ingredients:</p>
                <ul>{ingredients}</ul>
              </>
            );
          } else {
            return <></>;
          }
        } else {
          return <></>;
        }
      });
    } else {
      return <></>;
    }
  }

  render() {
    return (
      <>
        <h3>Available Dinners</h3>
        <ul>{this.getAllDinners()}</ul>
        <h2>Upcoming Dinners</h2>
        {this.getFutureDinners()}
      </>
    );
  }
}

export default Dinners;
