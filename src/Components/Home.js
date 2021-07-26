import React from 'react';
import DinnersControl from '../Components/DinnersControl';
import Menu from './Menu';
import { Container } from 'semantic-ui-react';

const Home = () => {
  return (
    <>
      <Menu />
      <Container>
        <h1>Home</h1>
      </Container>
    </>
  );
};

export default Home;
