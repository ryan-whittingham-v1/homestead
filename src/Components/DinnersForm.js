import firebase from '../firebase.js';
import React from 'react';

class DinnersForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDayIndex: null, // index for day of week i.e. 0 = Sunday ... 6 = Saturday
      dinners: [], // array of selected dinner objects
    };
  }

  componentDidMount() {}

  handleChange = (e) => {
    // if a dinner was selected
    if (e.target.value !== '---') {
      // convert selected dinner to dinner object
      let dinner = JSON.parse(e.target.value);
      // update dinners array in state
      let scheduledDinners = [...this.state.dinners];
      scheduledDinners[this.state.selectedDayIndex] = dinner;
      this.setState(
        {
          dinners: scheduledDinners,
        },
        () => {}
      );
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

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.preselectedDinners !== prevProps.preselectedDinners) {
      this.forceUpdate();
    }
  }

  dinnerSelection(dinners, index) {
    //initialize dinnerOptions array
    let dinnerOptions = [];
    // if dinners array is not empty create option for each dinner
    if (dinners.length > 0) {
      // sort dinners
      let sortedDinners = [...dinners];
      sortedDinners.sort(this.compare);
      // create html option for each dinner
      dinnerOptions = sortedDinners.map((dinner) => {
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
    //create the select element
    let defaultValue = 'dog';
    console.log('preDiner ' + JSON.stringify(this.props.preselectedDinners));
    if (this.props.preselectedDinners !== undefined) {
      defaultValue = this.props.preselectedDinners[index].name;
    }
    let select = (
      <select value={defaultValue} onChange={this.handleChange}>
        <option>---</option>
        {dinnerOptions}
      </select>
    );
    return select;
  }

  updateFirebase = () => {
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
  };

  render() {
    return (
      <>
        <form>
          <label
            onClick={() => this.setState({ selectedDayIndex: 0 }, () => {})}
          >
            Sunday
            <br />
            {this.dinnerSelection(this.props.dinners, 0)}
          </label>
          <br />
          <label
            onClick={() => this.setState({ selectedDayIndex: 1 }, () => {})}
          >
            Monday
            <br />
            {this.dinnerSelection(this.props.dinners, 1)}
          </label>
          <br />
          <label
            onClick={() => this.setState({ selectedDayIndex: 2 }, () => {})}
          >
            Tuesday
            <br />
            {this.dinnerSelection(this.props.dinners, 2)}
          </label>
          <br />
          <label
            onClick={() => this.setState({ selectedDayIndex: 3 }, () => {})}
          >
            Wednesday
            <br />
            {this.dinnerSelection(this.props.dinners, 3)}
          </label>
          <br />
          <label
            onClick={() => this.setState({ selectedDayIndex: 4 }, () => {})}
          >
            Thursday
            <br />
            {this.dinnerSelection(this.props.dinners, 4)}
          </label>
          <br />
          <label
            onClick={() => this.setState({ selectedDayIndex: 5 }, () => {})}
          >
            Friday
            <br />
            {this.dinnerSelection(this.props.dinners, 5)}
          </label>
          <br />
          <label
            onClick={() => this.setState({ selectedDayIndex: 6 }, () => {})}
          >
            Saturday
            <br />
            {this.dinnerSelection(this.props.dinners, 6)}
          </label>
          <br />
        </form>
        <button onClick={this.updateFirebase}>Save</button>
      </>
    );
  }
}

export default DinnersForm;
