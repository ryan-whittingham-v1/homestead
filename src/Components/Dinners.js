import React from 'react';
import firebase from '../firebase.js';

class Dinners extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      database: {},
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

  getDinners() {
    const { dinners } = this.state;
    if (dinners) {
      return Object.keys(dinners).map((key) => {
        return <p>{dinners[key].name}</p>;
      });
    } else {
      return <p>one moment</p>;
    }
  }

  render() {
    return this.getDinners();
  }
}

export default Dinners;
