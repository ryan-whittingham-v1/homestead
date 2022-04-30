import React, { useEffect, useState } from 'react';
import firebase from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';
import Menu from './Menu';
import styles from '../Styles/editDinners.module.css';

export default function EditDinners() {
  //Selected Dinner Object
  const [selectedDinner, setSelectedDinner] = useState();
  //List of User Dinners
  const [userDinners, setUserDinners] = useState();
  //ID of Selected Dinner
  const [selectedDinnerID, setSelectedDinnerID] = useState();

  function getUserDinners() {
    let userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + userId + '/dinners')
      .once('value', (snapshot) => {
        setUserDinners(snapshot.val());
      });
  }

  function addDinner() {
    let id = uuidv4();
    setSelectedDinnerID(id);
  }

  function addIngredient() {
    if (selectedDinner?.ingredients) {
      setSelectedDinner({
        ...selectedDinner,
        ingredients: [...selectedDinner?.ingredients, ''],
      });
    } else {
      setSelectedDinner({
        ...selectedDinner,
        ingredients: [''],
      });
    }
  }

  function removeIngredient(index) {
    setSelectedDinner({
      ...selectedDinner,
      ingredients: [
        ...selectedDinner.ingredients.slice(0, index),
        ...selectedDinner.ingredients.slice(index + 1),
      ],
    });
  }

  function handleSubmit(e) {
    let userId = firebase.auth().currentUser.uid;
    e.preventDefault();
    firebase
      .database()
      .ref('users/' + userId + '/dinners/' + selectedDinnerID + '/')
      .update(selectedDinner);

    window.alert('Dinner Saved!');
    getUserDinners();
  }

  function deleteDinner() {
    let userId = firebase.auth().currentUser.uid;
    if (window.confirm('Are you sure you want to delete this?')) {
      firebase
        .database()
        .ref('users/' + userId + '/dinners/' + selectedDinnerID + '/')
        .remove();

      getUserDinners();
    }
  }

  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.props.value.toUpperCase();
    const nameB = b.props.value.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  function getOptions() {
    if (userDinners !== undefined) {
      let options = [];
      for (const [key, value] of Object.entries(userDinners)) {
        options.push(
          <option key={key} value={value?.name}>
            {value?.name.toUpperCase()}
          </option>
        );
      }
      options.sort(compare);
      return options;
    }
  }

  function getDinnerID(dinner) {
    for (const [key, value] of Object.entries(userDinners)) {
      if (dinner === value.name) {
        return key;
      }
    }
  }

  function handleDinnerChange(event) {
    setSelectedDinnerID(getDinnerID(event.target.value));
  }

  function updateSelectedDinner() {
    if (userDinners) {
      if (userDinners[selectedDinnerID]) {
        setSelectedDinner(userDinners[selectedDinnerID]);
      } else {
        setSelectedDinner({ name: '', ingredients: [], notes: '' });
      }
    }
  }

  let select = (
    <select value={selectedDinner?.name} onChange={handleDinnerChange}>
      {getOptions()}
    </select>
  );

  // get user dinnners on mount
  useEffect(() => {
    getUserDinners();
  }, []);

  // set initial selected dinner ID to first in dinner lists
  useEffect(() => {
    if (userDinners && selectedDinnerID === undefined) {
      let dinners = getOptions();
      setSelectedDinnerID(dinners[0].key);
    }
  }, [userDinners]);

  // update selected dinner when selected dinner ID changes
  useEffect(() => {
    updateSelectedDinner();
  }, [selectedDinnerID]);

  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div className={styles.menu}>
          <Menu />
        </div>
        <div className={styles.select}>
          <label>{select}</label>
          <button type="button" onClick={() => addDinner()}>
            +
          </button>
        </div>
        <div className={styles.formContainer}>
          <form
            className={styles.form}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <fieldset>
              <div className={styles.name}>
                <label>Name: </label>

                <input
                  name="name"
                  type="text"
                  value={selectedDinner?.name}
                  onChange={(e) =>
                    setSelectedDinner({
                      ...selectedDinner,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.ingredients}>
                <label>Ingredients: </label>

                {selectedDinner?.ingredients?.map((ingredient, index) => (
                  <div className={styles.ingredient}>
                    <input
                      name={`ingredient${index}`}
                      type="text"
                      value={selectedDinner.ingredients[index]}
                      key={index}
                      onChange={(e) =>
                        setSelectedDinner({
                          ...selectedDinner,
                          ingredients: [
                            ...selectedDinner.ingredients.slice(0, index),
                            e.target.value,
                            ...selectedDinner.ingredients.slice(index + 1),
                          ],
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addIngredient}>
                  ADD INGREDIENT
                </button>
              </div>
              <div className={styles.notes}>
                <label>Notes: </label>

                <textarea
                  id="notes"
                  value={selectedDinner?.notes}
                  onChange={(e) =>
                    setSelectedDinner({
                      ...selectedDinner,
                      notes: e.target.value,
                    })
                  }
                  rows="5"
                  cols="33"
                />
              </div>
              <div className={styles.save}>
                <input type="submit" value="Save" />
                <button type="button" onClick={deleteDinner}>
                  Delete
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
