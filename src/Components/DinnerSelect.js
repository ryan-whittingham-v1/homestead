import React from 'react';

class DinnerSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '---',
      selectedDayIndex: null, // index for day of week i.e. 0 = Sunday ... 6 = Saturday
      dinners: [], // array of selected dinner objects
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: JSON.parse(event.target.value) });
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

  render() {
    return (
      <label>
        Pick your dinner:
        <select
          value={JSON.stringify(this.state.value)}
          onChange={this.handleChange}
        >
          {this.getDinnerOptions(this.props.dinners)}
        </select>
      </label>
    );
  }
}

export default DinnerSelect;
