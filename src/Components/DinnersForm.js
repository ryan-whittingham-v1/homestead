import React from 'react';

function DinnersForm(props) {
  const handleSubmit = (e) => {
    console.log('submit');
    e.preventDefault();
  };

  function getAllDinners(dinners) {
    if (Object.keys(dinners).length > 0) {
      return Object.keys(dinners).map((key) => {
        return (
          <option key={key} value={dinners[key].name}>
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

  let selection = (
    <select defaultValue="---" onChange={(e) => console.log(e.target.value)}>
      <option value="---">---</option>
      {getAllDinners(props.dinners)}
    </select>
  );

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <label>
        Sunday
        <br />
        {selection}
      </label>
      <br />
      <label>
        Monday
        <br />
        {selection}
      </label>
      <br />
      <label>
        Tuesday
        <br />
        {selection}
      </label>
      <br />
      <label>
        Wednesday
        <br />
        {selection}
      </label>
      <br />
      <label>
        Thursday
        <br />
        {selection}
      </label>
      <br />
      <label>
        Friday
        <br />
        {selection}
      </label>
      <br />
      <label>
        Saturday
        <br />
        {selection}
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default DinnersForm;
