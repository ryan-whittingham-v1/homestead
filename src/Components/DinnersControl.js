import firebase from '../firebase.js';
import React from 'react';
import DinnerForm from './DinnerForm';

class DinnersControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dinners: [], // list of all dinners
      weeks: [], // list of weeks with scheduled dinners
      weeksDates: [], // dates of the selected week
      weeksDinners: [], // list of the scheduled dinners for selected week
      isLoaded: false, // flag for firebase data loading and state update
    };

    this.ref = firebase.database().ref();
  }

  componentDidMount() {
    this.getCurrentWeek();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.weeks !== this.state.weeks) {
      this.updateDinnerState();
    }
  }

  componentWillUnmount() {
    // disconnect from firebase
    this.ref.off();
  }

  updateDinnerState = () => {
    let weeks = Object.keys(JSON.parse(JSON.stringify(this.state.weeks)));
    let sunday = JSON.stringify(this.state.weeksDates[0]).substring(1, 11);
    let flag = false;
    for (let i = 0; i < weeks.length; i++) {
      if (sunday === weeks[i]) {
        this.setState({
          weeksDinners: [...this.state.weeks[weeks[i]].dinners],
        });
        flag = true;
        return;
      }
    }
    if (!flag) {
      this.setState(
        {
          weeksDinners: ['---', '---', '---', '---', '---', '---', '---'],
        },

        () => {}
      );
    }
  };

  getFirebaseData = async () => {
    this.ref.on('value', (snapshot) => {
      const database = snapshot.val();
      this.setState(
        {
          dinners: database.dinners,
          weeks: database.weeks,
          isLoaded: true,
        },
        () => {
          return 1;
        }
      );
    });
  };

  getCurrentWeek = async () => {
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
        weeksDates: [...dates],
      },
      () => {
        this.updateDinnerState();
      }
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
          weeksDates: [...nextWeek],
        },
        () => {
          this.updateDinnerState();
        }
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
          weeksDates: [...prevWeek],
        },
        () => {
          this.updateDinnerState();
        }
      );
    }
  };

  render() {
    let dinnerForm;
    if (this.state.isLoaded) {
      //console.log('this.state.weeksDinners: ' + this.state.weeksDinners);
      dinnerForm = (
        <DinnerForm
          thisWeeksDates={this.state.weeksDates}
          dinners={this.state.dinners}
          preselectedDinners={[...this.state.weeksDinners]}
        />
      );
    } else {
      dinnerForm = <p>loading dinners list...</p>;
    }

    return (
      <>
        <h2>Dinner Schedule</h2>
        {this.weekTitle()}
        <button onClick={this.handlePrevWeek}>Previous Week</button>
        <button onClick={this.handleNextWeek}>Next Week</button>
        {dinnerForm}
      </>
    );
  }
}

export default DinnersControl;
