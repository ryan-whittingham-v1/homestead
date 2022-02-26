import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import firebase from '../firebase';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const Menu = () => (
  <Dropdown
    text="Menu"
    icon="chevron circle down"
    floating
    labeled
    button
    className="icon"
  >
    <Dropdown.Menu>
      <Dropdown.Item icon="home" text="Home" as={Link} to="/" />
      <Dropdown.Item icon="food" text="Schedule" as={Link} to="/dinners" />
      <Dropdown.Divider />
      <Dropdown.Item
        icon="sign-out"
        text="Sign Out"
        onClick={() => firebase.auth().signOut()}
      />
    </Dropdown.Menu>
  </Dropdown>
);

export default Menu;
