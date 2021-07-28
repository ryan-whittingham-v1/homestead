import React from 'react';
import firebase from '../firebase.js';

class DinnerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '---',
      selectedDayIndex: null, // index for day of week i.e. 0 = Sunday ... 6 = Saturday
      dinners: [...props.preselectedDinners], // array of selected dinner objects
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.preselectedDinners !== prevProps.preselectedDinners) {
      this.setState({ dinners: [...this.props.preselectedDinners] });
    }
  }

  handleChange(event) {
    let scheduledDinners = [...this.state.dinners];
    scheduledDinners[this.state.selectedDayIndex] = event.target.value;
    this.setState({ dinners: [...scheduledDinners] });
  }

  handleSubmit(event) {
    event.preventDefault();
    firebase
      .database()
      .ref()
      .child('weeks')
      .update({
        [JSON.stringify(this.props.thisWeeksDates[0]).substring(1, 11)]: {
          dinners: [...this.state.dinners],
          dates: JSON.parse(JSON.stringify(this.props.thisWeeksDates)),
        },
      });
  }

  getDinnerOptions(dinners) {
    // if dinners array is not empty
    if (dinners.length > 0) {
      // sort dinners
      let sortedDinners = [...dinners];
      sortedDinners.sort(this.compare);
      // create html option for each dinner
      return sortedDinners.map((dinner) => {
        return (
          <option key={dinner.index} value={dinner.name}>
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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label onClick={() => this.setState({ selectedDayIndex: 0 }, () => {})}>
          Sunday
          <br />
          <select value={this.state.dinners[0]} onChange={this.handleChange}>
            <option>---</option>;{this.getDinnerOptions(this.props.dinners)}
          </select>
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDayIndex: 1 }, () => {})}>
          Monday
          <br />
          <select value={this.state.dinners[1]} onChange={this.handleChange}>
            <option>---</option>;{this.getDinnerOptions(this.props.dinners)}
          </select>
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDayIndex: 2 }, () => {})}>
          Tuesday
          <br />
          <select value={this.state.dinners[2]} onChange={this.handleChange}>
            <option>---</option>;{this.getDinnerOptions(this.props.dinners)}
          </select>
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDayIndex: 3 }, () => {})}>
          Wednesday
          <br />
          <select value={this.state.dinners[3]} onChange={this.handleChange}>
            <option>---</option>;{this.getDinnerOptions(this.props.dinners)}
          </select>
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDayIndex: 4 }, () => {})}>
          Thurdsay
          <br />
          <select value={this.state.dinners[4]} onChange={this.handleChange}>
            <option>---</option>;{this.getDinnerOptions(this.props.dinners)}
          </select>
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDayIndex: 5 }, () => {})}>
          Friday
          <br />
          <select value={this.state.dinners[5]} onChange={this.handleChange}>
            <option>---</option>;{this.getDinnerOptions(this.props.dinners)}
          </select>
        </label>
        <br />
        <label onClick={() => this.setState({ selectedDayIndex: 6 }, () => {})}>
          Saturday
          <br />
          <select value={this.state.dinners[6]} onChange={this.handleChange}>
            <option>---</option>;{this.getDinnerOptions(this.props.dinners)}
          </select>
        </label>
        <br />
        <input type="submit" value="Save" />
      </form>
    );
  }
}

export default DinnerForm;
