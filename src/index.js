import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import Auth from './auth';
import { createStore } from 'redux'

const defaultState = {
  'SWAP/Heating/Temperature': 0,
  'SWAP/Heating/Timestamp': 0,
  'SWAP/Heating/Voltage': 0,
  'SWAP/Garage/Temperature': 0,
  'SWAP/Garage/Timestamp': 0,
  'SWAP/Garage/Voltage': 0,
  'SWAP/Indoors/Temperature': 0,
  'SWAP/Indoors/Timestamp': 0,
  'SWAP/Indoors/Voltage': 0,
  'SWAP/Bedroom/Temperature': 0,
  'SWAP/Bedroom/Humidity': 0,
  'SWAP/Bedroom/Timestamp': 0,
  'SWAP/Bedroom/Voltage': 0,
  credentials: {},
  loginDone: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPD':
      var d = {};
      d[action.topic] = Number(action.message);
      return Object.assign({}, state, d)
    case 'CREDS':
      return {...state, credentials: action.credentials, loginDone: true}
    default: return state
  }
}

const store = createStore(reducer, defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
const auth = new Auth(store);

auth.handleAuthentication();

ReactDOM.render(<App auth={auth} store={store}/>, document.getElementById('root'));
