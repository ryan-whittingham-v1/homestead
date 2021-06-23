import firebase from '../firebase.js';
import React from 'react';

class DinnersForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null, // index of week array i.e. 0 = Sunday ... 6 = Saturday
      //thisWeeksDinners: [null, null, null, null, null, null, null],
    };
  }

  componentDidMount() {}

  handleChange = (e) => {
    // if dinner was selected
    if (e.target.value !== '---') {
      console.log(e.target.value);
      // create copy of thisWeeksDinners array from state
      // let dinnersArray = [...this.state.thisWeeksDinners];
      // convert selected dinner to dinner object
      let dinner = JSON.parse(e.target.value);
      // store dinner object in dinnersArray at index of selected date
      // dinnersArray[this.state.selectedDate] = dinner;
      // update thisWeeksDinners array in state
      //this.setState(
      //{
      //thisWeeksDinners: dinnersArray,
      //},
      //() => {
      //console.log(this.state.thisWeeksDinners);
      //}
      //);

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
      //sort dinners
      dinners.sort();
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

  render() {
    let sortedDinners = [...this.props.dinners];
    sortedDinners.sort(this.compare);
    let selection = (
      <select defaultValue="---" onChange={this.handleChange}>
        <option value="---">---</option>
        {this.getDinnerOptions(sortedDinners)}
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
