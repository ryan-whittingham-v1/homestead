import React, { useEffect, useState } from 'react';
import firebase from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

import Menu from './Menu';
import DinnerList from './DinnerList';

import styles from '../Styles/editDinners.module.css';

export default function EditDinners() {
  const [selectedDinner, setSelectedDinner] = useState();
  const [userDinners, setUserDinners] = useState({});
  const [selectedDinnerID, setSelectedDinnerID] = useState('');

  function getUserDinners() {
    let userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + userId + '/dinners')
      .once('value', (snapshot) => {
        const firebaseData = snapshot.val();
        setUserDinners(firebaseData);
      });
  }

  function listCallback(dinner) {
    setSelectedDinnerID(dinner);
  }

  function addDinner() {
    let id = uuidv4();
    setUserDinners({
      ...userDinners,
      [id]: { name: 'new dinner', ingredients: [], notes: '' },
    });
    setSelectedDinnerID(id);
  }

  function addIngredient() {
    if (selectedDinner.ingredients) {
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
      setSelectedDinner({ name: '', ingredients: [], notes: '' });
      setSelectedDinnerID('');
    }
  }

  useEffect(() => {
    getUserDinners();
  }, []);

  useEffect(() => {
    if (selectedDinnerID) {
      setSelectedDinner(userDinners[selectedDinnerID]);
    }
  }, [selectedDinnerID]);

  return (
    <>
      <Menu />
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <DinnerList
            dinners={userDinners}
            callback={listCallback}
            addDinner={addDinner}
          />
        </div>
        <div className={styles.right}>
          <form
            className={styles.form}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <fieldset disabled={selectedDinnerID === ''}>
              <label>Name: </label>
              <br />
              <input
                name="name"
                type="text"
                value={selectedDinner?.name}
                onChange={(e) =>
                  setSelectedDinner({ ...selectedDinner, name: e.target.value })
                }
              />
              <br />
              <label>Ingredients: </label>
              <br />
              {selectedDinner?.ingredients?.map((ingredient, index) => (
                <>
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
                  <button type="button" onClick={() => removeIngredient(index)}>
                    -
                  </button>
                  <br />
                </>
              ))}
              <button type="button" onClick={addIngredient}>
                +
              </button>
              <br />
              <label>Notes: </label>
              <br />
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
              <br />
              <input type="submit" value="Save" />
              <button type="button" onClick={deleteDinner}>
                Delete
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
