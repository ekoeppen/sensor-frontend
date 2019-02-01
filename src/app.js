import React, { Component } from 'react';
import {
  Box,
  Button,
  Text,
  Grommet
} from 'grommet';
import {
  connect,
  Provider
} from 'react-redux'
import {
  TemperatureView,
  TemperatureHumidityView
} from '@ekoeppen/grommet-sensor-components'
import moment from 'moment'

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
      radius: '8px'
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

const L1 = connect(
  state => {
    return {
      temperature: state.Indoors.Temperature,
      humidity: state.Indoors.Humidity,
      voltage: state.Indoors.Voltage,
      timestamp: state.Indoors.ts
    }
  }
)(TemperatureHumidityView);

const L2 = connect(
  state => {
    return {
      temperature: state.Bedroom.Temperature,
      humidity: state.Bedroom.Humidity,
      voltage: state.Bedroom.Voltage,
      timestamp: state.Bedroom.ts
    }
  }
)(TemperatureHumidityView);

const login = () => ({type: 'LOGIN'})
const logout = () => ({type: 'LOGOUT'})
const refresh = () => ({type: 'REFRESH'})

const Auth0Button = connect(
  state => {return {isAuthenticated: state.loginDone}},
  {login, logout}
)(({isAuthenticated, login, logout}) => {
  if (isAuthenticated) {
    return <Button label='Logout' onClick={logout}/>
  } else {
    return <Button label='Login' onClick={login}/>
  }
});

const RefreshButton = connect(
  state => {return {canRefresh: state.awsLoginDone}},
  {refresh}
)(({canRefresh, refresh}) =>
  <Button disabled={!canRefresh} label='Refresh' onClick={refresh}/>
);

const HeartBeat = connect(
  state => {return {heartbeat: state.heartbeat.count, ts: state.heartbeat.ts}}
)((props) => {
  if (props.heartbeat) {
    return <Text size='small'>{props.heartbeat} {moment.unix(props.ts).format("YYYY-MM-DD HH:mm:ss")}</Text>
  } else {
    return null
  }
});

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Grommet theme={theme} full>
          <Box direction='column'>
            <Box direction='row' pad='none' alignSelf='center'>
              <L1 location='Indoors' low='10' high='35'/>
              <L2 location='Bedroom' low='10' high='35'/>
              <L3 location='Garage' low='0' high='25'/>
              <L4 location='Heating' low='0' high='60'/>
            </Box>
            <Box direction='row' pad='xsmall' alignSelf='end'>
              <HeartBeat/>
            </Box>
            <Box direction='row' pad='xsmall' gap='xsmall' alignSelf='center'>
              <Auth0Button isAuthenticated='false'/>
              <RefreshButton/>
            </Box>
          </Box>
        </Grommet>
      </Provider>
      );
  }
}

export default App;
