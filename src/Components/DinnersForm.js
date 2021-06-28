import firebase from '../firebase.js';
import React from 'react';

class DinnersForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null, // index of week array i.e. 0 = Sunday ... 6 = Saturday
    };
  }

  componentDidMount() {}

  handleChange = (e) => {
    // if a dinner was selected
    if (e.target.value !== '---') {
      // convert selected dinner to dinner object
      let dinner = JSON.parse(e.target.value);
      // create copy of selected dinners scheduled dates
      let newScheduledDates = [];
      // if dinner has a scheduledDates array
      if (dinner.scheduledDates) {
        // copy existing scheduledDates info to newScheduledDates array
        newScheduledDates = [...dinner.scheduledDates];
      }
      // add selected day's date to newScheduledDates array
      newScheduledDates.unshift(
        this.props.thisWeeksDates[this.state.selectedDate]
      );
      // update scheduledDates array in dinner object
      dinner.scheduledDates = newScheduledDates;
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
    // if dinners array is not empty
    if (dinners.length > 0) {
      // sort dinners
      let sortedDinners = [...dinners];
      sortedDinners.sort(this.compare);
      // create html option for each dinner
      return sortedDinners.map((dinner) => {
        return (
          <option key={dinner.index} value={JSON.stringify(dinner)}>
            {dinner.name.toUpperCase()}
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

  // Dinner Sorting Function
  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  dinnerSelection(dinners, week, day) {
    //initialize a defaultValue variable
    let defaultValue = '---';
    //initialize dinnerOptions array
    let dinnerOptions = [];
    // if dinners array is not empty create option for each dinner
    if (dinners.length > 0) {
      // sort dinners
      let sortedDinners = [...dinners];
      sortedDinners.sort(this.compare);
      // create html option for each dinner
      dinnerOptions = sortedDinners.map((dinner) => {
        // check if dinner is already scheduled for the day
        if (dinner.scheduledDates) {
          dinner.scheduledDates.forEach((date) => {
            // if date is within the selected week
            if (
              new Date(date) >= new Date(week[0]) &&
              new Date(date) <= new Date(week[6])
            ) {
              // check if day of week of the date matches the selection day

              if (new Date(date).getDay() === day) {
                defaultValue = JSON.stringify(dinner);
              }
            }
          });
        }
        return (
          <option key={dinner.index} value={JSON.stringify(dinner)}>
            {dinner.name.toUpperCase()}
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
    //create the selection element
    let selection = (
      <select value={defaultValue} onChange={this.handleChange}>
        <option>---</option>
        {dinnerOptions}
      </select>
    );
    return selection;
  }

  render() {
    return (
      <form>
        <label onClick={() => this.setState({ selectedDate: 0 }, () => {})}>
          Sunday
          <br />
          {this.dinnerSelection(
            this.props.dinners,
            this.props.thisWeeksDates,
            0
          )}
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDate: 1 }, () => {})}>
          Monday
          <br />
          {this.dinnerSelection(
            this.props.dinners,
            this.props.thisWeeksDates,
            1
          )}
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDate: 2 }, () => {})}>
          Tuesday
          <br />
          {this.dinnerSelection(
            this.props.dinners,
            this.props.thisWeeksDates,
            2
          )}
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDate: 3 }, () => {})}>
          Wednesday
          <br />
          {this.dinnerSelection(
            this.props.dinners,
            this.props.thisWeeksDates,
            3
          )}
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDate: 4 }, () => {})}>
          Thursday
          <br />
          {this.dinnerSelection(
            this.props.dinners,
            this.props.thisWeeksDates,
            4
          )}
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDate: 5 }, () => {})}>
          Friday
          <br />
          {this.dinnerSelection(
            this.props.dinners,
            this.props.thisWeeksDates,
            5
          )}
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDate: 6 }, () => {})}>
          Saturday
          <br />
          {this.dinnerSelection(
            this.props.dinners,
            this.props.thisWeeksDates,
            6
          )}
        </label>
        <br />
      </form>
    );
  }
}

export default DinnersForm;
