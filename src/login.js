import React from 'react';
import {
  Box,
  Layer,
  Text,
  TextInput,
  Button,
} from 'grommet';

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      loginDone: false
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.login = this.login.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  login(event){
    this.setState({loginDone: true})
    this.props.callback({
      username: this.state.username,
      password: this.state.password}
    )
  }

  render() {
    if (!this.state.loginDone)
      return (
        <Layer margin='large'>
          <Box direction='column' margin='large'>
            <Text>Username</Text>
            <TextInput name='username' onChange={this.handleInputChange}/>
            <Text margin={{top: 'medium'}}>Password</Text>
            <TextInput name='password' onChange={this.handleInputChange} type='password'/>
            <Button margin={{top: 'medium'}} label="Login" onClick={this.login}/>
          </Box>
        </Layer>)
    else
      return null
  }
}

export default LoginForm
