import React from 'react';
import firebase from '../firebase.js';
import DinnersForm from '../Components/DinnersForm';

class Dinners extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      database: {},
      dinners: [],
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
    if (Object.keys(dinners).length > 0) {
      return Object.keys(dinners).map((key) => {
        return <li key={key}>{dinners[key].name.toUpperCase()}</li>;
      });
    } else {
      return <p>loading...</p>;
    }
  }

  getIngredients(dinner) {
    if (dinner) {
      return Object.keys(dinner.ingredients).map((key) => {
        return <li key={key}>{dinner.ingredients[key]}</li>;
      });
    }
  }

  getFutureDinners() {
    // get dinners data from state
    const { dinners } = this.state;
    // create dinners array to store future dinners
    let dinnersArray = [];
    // if dinners available
    if (dinners.length > 0) {
      // get today's date
      let today = new Date();
      // traverse dinner data
      dinners.forEach((dinner) => {
        // if dinner has scheduled dates
        if (dinner.scheduledDates) {
          // convert scheduled date from string to date object
          let scheduledDate = new Date(dinner.scheduledDates[0] + 'T23:59:59');
          // if scheduled date is future date
          if (scheduledDate > today) {
            // add to dinners array
            dinnersArray.push(dinner);
          }
        }
      });
      // if dinner array has dinners
      if (dinnersArray.length > 0) {
        // sort dinners array by date in ascending order
        dinnersArray.sort(function (dinnerA, dinnerB) {
          return (
            new Date(dinnerA.scheduledDates[0]) -
            new Date(dinnerB.scheduledDates[0])
          );
        });
        // return html for each dinner
        return dinnersArray.map((dinner) => {
          //  convert scheduled date from string to date object
          let scheduledDate = new Date(dinner.scheduledDates[0] + 'T23:59:59');
          // convert scheduled date to day of week
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
          // return date, dinner name, and list of it's ingredients
          return (
            <div key={dinner.name}>
              <h4>
                {dayOfWeek}, {month} {scheduledDate.getDate()}
              </h4>
              <h3>{dinner.name.toUpperCase()}</h3>
              <p>Ingredients:</p>
              <ul>{this.getIngredients(dinner)}</ul>
            </div>
          );
        });
      } else {
        console.log('No dinners scheduled');
      }
    } else {
      return <p>loading...</p>;
    }
  }

  render() {
    return (
      <>
        <h2>Dinner Selection</h2>
        <DinnersForm dinners={this.state.dinners} />
        <h2>Upcoming Dinners</h2>
        {this.getFutureDinners()}
      </>
    );
  }
}

export default Dinners;
