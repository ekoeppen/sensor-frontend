import React, { Component } from 'react';
import {
  Box,
  Button,
  Grommet
} from 'grommet';
import {
  connect,
  Provider
} from 'react-redux'
import Auth from './auth'
import {
  TemperatureView,
  TemperatureHumidityView
} from '@ekoeppen/grommet-sensor-components'

const theme = {
  global: {
    colors: {
      brand: '#00739D',
    },
    font: {
      family: 'Helvetica',
      size: '14px',
      height: '20px',
    },
  },
  button: {
    border: {
      radius: '4px'
    }
  }
};

const subscriber = (subs) => connect(
  state => {
    var d = {}
    for (let s of subs) {
      d[s.prop] = state[s.key]
    }
    return d
  },
  dispatch => {return {}})

const L1 = subscriber([
  {prop: 'temperature', key: 'SWAP/Indoors/Temperature'},
  {prop: 'timestamp', key: 'SWAP/Indoors/Timestamp'},
  {prop: 'voltage', key: 'SWAP/Indoors/Voltage'}
  ])(TemperatureView)
const L2 = subscriber([
  {prop: 'temperature', key: 'SWAP/Bedroom/Temperature'},
  {prop: 'humidity', key: 'SWAP/Bedroom/Humidity'},
  {prop: 'timestamp', key: 'SWAP/Bedroom/Timestamp'},
  {prop: 'voltage', key: 'SWAP/Bedroom/Voltage'}
  ])(TemperatureHumidityView)
const L3 = subscriber([
  {prop: 'temperature', key: 'SWAP/Garage/Temperature'},
  {prop: 'timestamp', key: 'SWAP/Garage/Timestamp'},
  {prop: 'voltage', key: 'SWAP/Garage/Voltage'}
  ])(TemperatureView)
const L4 = subscriber([
  {prop: 'temperature', key: 'SWAP/Heating/Temperature'},
  {prop: 'timestamp', key: 'SWAP/Heating/Timestamp'},
  {prop: 'voltage', key: 'SWAP/Heating/Voltage'}
  ])(TemperatureView)

const auth = new Auth()

class AuthButton extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return <Button label='Logout' onClick={auth.logout}/>
    } else {
      return <Button label='Login' onClick={auth.login}/>
    }
  }
}

const Auth0Button = connect(
  state => {
    return {isAuthenticated: state.loginDone}
  },
  dispatch => {}
)(AuthButton);

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Grommet theme={theme} full>
          <Box direction='column'>
            <Box direction='row' pad='none' justify='center' basis='full'>
              <L1 location='Indoors' low='10' high='35'/>
              <L2 location='Bedroom' low='10' high='35'/>
              <L3 location='Garage' low='0' high='25'/>
              <L4 location='Heating' low='0' high='60'/>
            </Box>
            <Box direction='column' pad='xsmall' basis='full' fill='true' align='center'>
              <Auth0Button auth={auth} isAuthenticated='false'/>
            </Box>
          </Box>
        </Grommet>
      </Provider>
      );
  }
}

export default App;
