import firebase from '../firebase.js';
import React from 'react';
import DinnerFormTwo from '../Components/DinnerFormTwo';

class DinnersControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dinners: [],
      weeks: [],
      weeksDates: [],
      weeksDinners: [],
      isLoaded: false,
    };

    this.getCurrentWeek = this.getCurrentWeek.bind(this);
    this.handleNextWeek = this.handleNextWeek.bind(this);
    this.handlePrevWeek = this.handlePrevWeek.bind(this);
    this.getFirebaseData = this.getFirebaseData.bind(this);
    this.updateDinnerState = this.updateDinnerState.bind(this);
  }

  componentDidMount() {
    this.getCurrentWeek();
  }

  componentDidUpdate(prevProps, prevState) {
    // if week changed
    if (this.state.weeksDates !== prevState.weeksDates) {
      console.log('week changed');

      let weeks = Object.keys(JSON.parse(JSON.stringify(this.state.weeks)));
      console.log(weeks);
      let sunday = JSON.stringify(this.state.weeksDates[0]).substring(1, 11);
      console.log(sunday);

      for (let i = 0; i < weeks.length; i++) {
        if (sunday === weeks[i]) {
          console.log('Found week');
          this.setState({
            weeksDinners: [...this.state.weeks[weeks[i]].dinners],
          });
          return;
        }
      }
      console.log('No week');
      this.setState(
        {
          weeksDinners: ['---', '---', '---', '---', '---', '---', '---'],
        },

        () => {}
      );
    }
  }

  updateDinnerState = () => {
    let weeks = Object.keys(JSON.parse(JSON.stringify(this.state.weeks)));
    console.log(weeks);
    let sunday = JSON.stringify(this.state.weeksDates[0]).substring(1, 11);
    console.log(sunday);

    for (let i = 0; i < weeks.length; i++) {
      if (sunday === weeks[i]) {
        console.log('Found week');
        this.setState({
          weeksDinners: [...this.state.weeks[weeks[i]].dinners],
        });
        return;
      }
    }
    console.log('No week');
    this.setState(
      {
        weeksDinners: ['---', '---', '---', '---', '---', '---', '---'],
      },

      () => {}
    );
  };

  getFirebaseData = async () => {
    let ref = firebase.database().ref();
    ref.on('value', (snapshot) => {
      const database = snapshot.val();
      this.setState(database);
      this.updateDinnerState();
    });
    return 1;
  };

  getCurrentWeek = async () => {
    console.log('getCurrentWeek');
    await this.getFirebaseData();
    // get today's date
    let today = new Date();
    // set today's time to end of day
    today.setHours(23, 59, 59, 999);
    // create new dates array
    let dates = [];
    // determine day of the week from today
    let dayOfWeek = today.getDay();
    // place today at appropriate index using dayOfWeek
    dates[dayOfWeek] = today;
    // update date array with days before today
    for (let index = dayOfWeek - 1; index >= 0; index--) {
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      dates[index] = yesterday;
      today = yesterday;
    }
    // reset today variable
    today = new Date();
    today.setHours(23, 59, 59, 999);
    // update date array with days after today
    for (let index = dayOfWeek + 1; index <= 6; index++) {
      let tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dates[index] = tomorrow;
      today = tomorrow;
    }
    // save dates array to state
    this.setState(
      {
        weeksDates: dates,
      },
      () => {}
    );
  };

  weekTitle() {
    // if week info present
    if (this.state.weeksDates) {
      let firstDayOfWeek = new Date(this.state.weeksDates[0]);
      let lastDayOfWeek = new Date(this.state.weeksDates[6]);
      let startOfWeekMonth = firstDayOfWeek.getMonth() + 1;
      let endOfWeekMonth = lastDayOfWeek.getMonth() + 1;
      return (
        <h3>
          {'Week: ' +
            startOfWeekMonth +
            '/' +
            firstDayOfWeek.getDate() +
            ' to ' +
            endOfWeekMonth +
            '/' +
            lastDayOfWeek.getDate()}
        </h3>
      );
    } else {
      return <h3>loading...</h3>;
    }
  }

  handleNextWeek = () => {
    // create empty array for next week dates
    let nextWeek = [];
    let dates = [...this.state.weeksDates];
    // create new week of dates based off of last day of current week
    if (dates) {
      let prevSunday = new Date(dates[6]);
      for (let i = 1; i <= 7; i++) {
        let nextDay = new Date(prevSunday);
        nextDay.setDate(nextDay.getDate() + i);
        nextDay.setHours(23, 59, 59, 999);
        nextWeek.push(nextDay);
      }
      // save dates array to state
      this.setState(
        {
          weeksDates: nextWeek,
        },
        () => {}
      );
    }
  };

  handlePrevWeek = () => {
    let dates = [...this.state.weeksDates];
    // create empty array for next week dates
    let prevWeek = [];
    // create new week of dates based off of last day of current week
    if (dates) {
      let currentSunday = new Date(dates[0]);
      for (let i = 1; i <= 7; i++) {
        let nextPrevDay = new Date(currentSunday);
        nextPrevDay.setDate(nextPrevDay.getDate() - i);
        nextPrevDay.setHours(23, 59, 59, 999);
        prevWeek.unshift(nextPrevDay);
      }
      // save array of previous week's dates to state
      this.setState(
        {
          weeksDates: prevWeek,
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
        <DinnerFormTwo
          thisWeeksDates={this.state.weeksDates}
          dinners={this.state.dinners}
          preselectedDinners={this.state.weeksDinners}
          updateDinners={this.updateDinnerState}
          getFirebase={this.getFirebaseData}
        />
      </>
    );
  }
}

export default DinnersControl;
