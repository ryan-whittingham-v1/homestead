import firebase from '../firebase.js';
import React from 'react';
import DinnersForm from '../Components/DinnersForm';

class DinnersControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      thisWeeksDates: [null, null, null, null, null, null, null],
      thisWeeksDinners: [null, null, null, null, null, null, null],
      database: {},
      dinners: [],
    };
  }

  componentDidMount() {
    this.getData();
    this.getWeek();
  }

  getData = () => {
    let ref = firebase.database().ref();
    ref.on('value', (snapshot) => {
      const database = snapshot.val();
      this.setState(database);
    });
  };

  getWeek = () => {
    // create empty week array
    let week = [null, null, null, null, null, null, null];
    // get today's date
    let today = new Date();
    today.setHours(23, 59, 59, 999);
    // determine day of the week
    let dayOfWeek = today.getDay();
    // place today in week array at dayOfWeek index
    week[dayOfWeek] = today;
    // update week array with days before today
    for (let index = dayOfWeek - 1; index >= 0; index--) {
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      week[index] = yesterday;
      today = yesterday;
    }
    // reset today variable
    today = new Date();
    today.setHours(23, 59, 59, 999);
    // update week array with days after today
    for (let index = dayOfWeek + 1; index <= 6; index++) {
      let tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      week[index] = tomorrow;
      today = tomorrow;
    }
    // save array of this week's dates to state
    this.setState(
      {
        thisWeeksDates: week,
      },
      () => {}
    );
  };

  weekTitle() {
    if (
      this.state.thisWeeksDates[0] != null &&
      this.state.thisWeeksDates[6] != null
    ) {
      let startOfWeekMonth = this.state.thisWeeksDates[0].getMonth() + 1;
      let endOfWeekMonth = this.state.thisWeeksDates[6].getMonth() + 1;
      return (
        <h3>
          {'Week: ' +
            startOfWeekMonth +
            '/' +
            this.state.thisWeeksDates[0].getDate() +
            ' to ' +
            endOfWeekMonth +
            '/' +
            this.state.thisWeeksDates[6].getDate()}
        </h3>
      );
    } else {
      return <p>error</p>;
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
          let scheduledDate = new Date(dinner.scheduledDates[0]);
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
          let scheduledDate = new Date(dinner.scheduledDates[0]);
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
              <h5>Ingredients:</h5>
              <ul>{this.getIngredients(dinner)}</ul>
            </div>
          );
        });
      } else {
        return <p>No dinners scheduled</p>;
      }
    } else {
      return <p>loading...</p>;
    }
  }

  getWeeksDinners() {
    // get dinners data from state
    const { dinners } = this.state;
    // create dinners array to store future dinners
    let dinnersArray = [];
    // if dinners available
    if (dinners.length > 0) {
      // traverse dinner data
      dinners.forEach((dinner) => {
        // if dinner has scheduled dates
        if (dinner.scheduledDates) {
          let scheduledDate = new Date(dinner.scheduledDates[0]);
          // if scheduled date is within choosen week
          if (
            scheduledDate >= this.state.thisWeeksDates[0] &&
            scheduledDate <= this.state.thisWeeksDates[6]
          ) {
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
          let scheduledDate = new Date(dinner.scheduledDates[0]);
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
              <h5>Ingredients:</h5>
              <ul>{this.getIngredients(dinner)}</ul>
            </div>
          );
        });
      } else {
        return <p>No dinners scheduled</p>;
      }
    } else {
      return <p>loading...</p>;
    }
  }

  handleNextWeek = () => {
    // create empty array for next week dates
    let nextWeek = [];
    let dates = this.state.thisWeeksDates;
    // create new week of dates based off of last day of current week

    if (dates) {
      let prevSunday = new Date(this.state.thisWeeksDates[6]);

      for (let i = 1; i <= 7; i++) {
        let nextDay = new Date(prevSunday);
        nextDay.setDate(nextDay.getDate() + i);
        nextDay.setHours(23, 59, 59, 999);
        nextWeek.push(nextDay);
      }
      // save array of next week's dates to state
      this.setState(
        {
          thisWeeksDates: nextWeek,
        },
        () => {}
      );
    }
  };

  handlePrevWeek = () => {
    let dates = this.state.thisWeeksDates;
    // create empty array for next week dates
    let prevWeek = [];
    // create new week of dates based off of last day of current week
    if (dates) {
      let currentSunday = new Date(this.state.thisWeeksDates[0]);
      for (let i = 1; i <= 7; i++) {
        let nextPrevDay = new Date(currentSunday);
        nextPrevDay.setDate(nextPrevDay.getDate() - i);
        nextPrevDay.setHours(23, 59, 59, 999);
        prevWeek.unshift(nextPrevDay);
      }

      // save array of next week's dates to state
      this.setState(
        {
          thisWeeksDates: prevWeek,
        },
        () => {}
      );
    }
  };

  render() {
    return (
      <>
        <h2>Dinner Schedule</h2>
        {this.weekTitle()}
        <button onClick={this.handlePrevWeek}>Previous Week</button>
        <button onClick={this.handleNextWeek}>Next Week</button>
        <DinnersForm
          thisWeeksDates={this.state.thisWeeksDates}
          dinners={this.state.dinners}
        />
      </>
    );
  }
}

export default DinnersControl;
