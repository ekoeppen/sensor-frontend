import React from 'react';
import {
  Box,
  Button,
  Text,
  Grommet
} from 'grommet';
import {
  connect,
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

const temperatureSubscriber = (name) => connect(
  state => {
    if (state[name]) {
      return {
        temperature: state[name].Temperature,
        voltage: state[name].Voltage,
        timestamp: state[name].ts
      }
    } else {
      return state
    }
  }
)(TemperatureView)

const temperatureHumiditySubscriber = (name) => connect(
  state => {
    if (state[name]) {
      return {
        temperature: state[name].Temperature,
        humidity: state[name].Humidity,
        voltage: state[name].Voltage,
        timestamp: state[name].ts
      }
    } else {
      return state
    }
  }
)(TemperatureHumidityView)

const typeToSubscriber = {
  'Temperature': temperatureSubscriber,
  'TemperatureHumidity': temperatureHumiditySubscriber,
}

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

const App = connect(
  state => ({sensors: state.sensors})
)((props) => {
  let elements = props.sensors.map(sensor => {
    let s = typeToSubscriber[sensor.type](sensor.name)
    return React.createElement(s, {
      key: sensor.name, location: sensor.name, low: sensor.low, high: sensor.high},
      null)
  })

  if (props.sensors.length > 0) {
    return <Grommet theme={theme} full>
      <Box direction='column'>
        <Box direction='row' pad='none' alignSelf='center'>
          {elements}
        </Box>
        <Box direction='row' pad='xsmall' alignSelf='end'>
          <HeartBeat/>
        </Box>
        <Box direction='row' pad='xsmall' gap='xsmall' alignSelf='center'>
          <Auth0Button isAuthenticated='false'/>
          <RefreshButton/>
        </Box>
      </Box></Grommet>
    } else {
      return <Grommet theme={theme} full>
        <Box direction='column'>
          <Box direction='row' pad='xsmall' gap='xsmall' alignSelf='center'>
            <Auth0Button isAuthenticated='false'/>
          </Box>
        </Box></Grommet>
    }
})

export default App;
