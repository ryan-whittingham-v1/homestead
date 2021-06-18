import firebase from '../firebase.js';
import React from 'react';

class DinnersForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      thisWeeksDates: [],
      selectedDate: null, // index of week array i.e. 0 = Sunday ... 6 = Saturday
      thisWeeksDinners: [null, null, null, null, null, null, null],
    };
  }

  componentDidMount() {
    this.getWeek();
  }

  getWeek = () => {
    // create empty week array
    let week = [null, null, null, null, null, null, null];
    // get today's date
    let today = new Date();
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
      () => {
        console.log(this.state.thisWeeksDates);
      }
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // update dinner object to add day to it's scheduled dates array
    //console.log(e.target.value.name);
    /*  firebase
      .database()
      .ref('/dinners')
      .set({
        username: name,
        email: email,
        profile_picture: imageUrl,
      }); */
  };

  handleChange = (e) => {
    // if dinner was selected
    if (e.target.value !== '---') {
      console.log(e.target.value);
      // create copy of thisWeeksDinners array from state
      let dinnersArray = [...this.state.thisWeeksDinners];
      // convert selected dinner to dinner object
      let dinner = JSON.parse(e.target.value);
      // store dinner object in dinnersArray at index of selected date
      dinnersArray[this.state.selectedDate] = dinner;
      // update thisWeeksDinners array in state
      this.setState(
        {
          thisWeeksDinners: dinnersArray,
        },
        () => {
          console.log(this.state.thisWeeksDinners);
        }
      );

      // create copy of selected dinners scheduled dates
      let newScheduledDates = [];
      // if dinner has a scheduledDates array
      if (dinner.scheduledDates) {
        // copy existing scheduledDates info to newScheduledDates array
        newScheduledDates = [...dinner.scheduledDates];
      }
      // add selected day's date to newScheduledDates array
      newScheduledDates.unshift(
        this.state.thisWeeksDates[this.state.selectedDate]
      );
      // update scheduledDates array in dinner object
      dinner.scheduledDates = newScheduledDates;
      console.log(dinner);
      // update dinner in firebase
      firebase
        .database()
        .ref('/dinners/' + dinner.index)
        .update({
          scheduledDates: dinner.scheduledDates,
        });
    } else {
      console.log('no dinner selected');
    }
  };

  getDinnerOptions(dinners) {
    if (Object.keys(dinners).length > 0) {
      return Object.keys(dinners).map((key) => {
        return (
          <option key={key} value={JSON.stringify(dinners[key])}>
            {dinners[key].name.toUpperCase()}
          </option>
        );
      });
    } else {
      return (
        <option key={'loading'} value="loading">
          loading...
        </option>
      );
    }
  }

  render() {
    let selection = (
      <select defaultValue="---" onChange={this.handleChange}>
        <option value="---">---</option>
        {this.getDinnerOptions(this.props.dinners)}
      </select>
    );

    return (
      <form
        onSubmit={(e) => {
          this.handleSubmit(e);
        }}
      >
        <label
          onClick={() =>
            this.setState({ selectedDate: 0 }, () => {
              console.log(this.state.selectedDate);
            })
          }
        >
          Sunday
          <br />
          {selection}
        </label>
        <br />
        <label
          onClick={() =>
            this.setState({ selectedDate: 1 }, () => {
              console.log(this.state.selectedDate);
            })
          }
        >
          Monday
          <br />
          {selection}
        </label>
        <br />
        <label
          onClick={() =>
            this.setState({ selectedDate: 2 }, () => {
              console.log(this.state.selectedDate);
            })
          }
        >
          Tuesday
          <br />
          {selection}
        </label>
        <br />
        <label
          onClick={() =>
            this.setState({ selectedDate: 3 }, () => {
              console.log(this.state.selectedDate);
            })
          }
        >
          Wednesday
          <br />
          {selection}
        </label>
        <br />
        <label
          onClick={() =>
            this.setState({ selectedDate: 4 }, () => {
              console.log(this.state.selectedDate);
            })
          }
        >
          Thursday
          <br />
          {selection}
        </label>
        <br />
        <label
          onClick={() =>
            this.setState({ selectedDate: 5 }, () => {
              console.log(this.state.selectedDate);
            })
          }
        >
          Friday
          <br />
          {selection}
        </label>
        <br />
        <label
          onClick={() =>
            this.setState({ selectedDate: 6 }, () => {
              console.log(this.state.selectedDate);
            })
          }
        >
          Saturday
          <br />
          {selection}
        </label>
        <br />
      </form>
    );
  }
}

export default DinnersForm;
