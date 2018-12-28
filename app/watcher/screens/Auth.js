import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Expo from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { connect } from 'react-redux';
const SIGNUP_URL = 'http://192.168.0.110:5000/registration';
const LOGIN_URL = 'http://192.168.0.110:5000/login'
class AuthScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      name: null,
      email: null,
      password: null,
      accountID: null,
      auth: '',
      mess: ''
    };
  }
  signup = () => {
    console.log('signup')
    fetch(SIGNUP_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: this.state.name,
        email : this.state.email,
        password: this.state.password
    })

  }).then(response => response.json())
  .then(json => {
    this.setState({accountID : json.id})
    this.setState({auth : json.auth})
    this.setState({mess : json.mess})
    var auth = json.id;
    this.props.signup(auth);
    if (json.id !== null) {
      this.props.navigation.navigate('Phone')
    }
    console.log(this.state)
  })
  }
  login = () => {
    fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email : this.state.email,
        password: this.state.password
    })

  }).then(response => response.json())
  .then(json => {
    this.setState({accountID : json.id})
    this.setState({auth : json.auth})
    this.setState({mess : json.mess})
    console.log(this.state, 'login state')
  })
  }
  authorized = () => {
    this.props.navigation.navigate('Phone');
  }

  static navigationOptions = {
    header: null,
  };

  render() {

    if (this.props.accountID == null) {
    return (
      <View style={styles.container}>
      <FormLabel>Name</FormLabel>
      <FormInput onChangeText={(name) => this.setState({name})}/>
      <FormLabel>Email</FormLabel>
      <FormInput onChangeText={(email) => this.setState({email})}/>
      <FormLabel>Password</FormLabel>
      <FormInput onChangeText={(password) => this.setState({password})}/>
      <FormValidationMessage>{this.state.mess}</FormValidationMessage>
      <Button
      onPress={() => this.signup() }
  title='SIGNUP' />
  <Button
  onPress={() => this.login() }
title='LOGIN' />
      </View>
    );
  } else {

      return (
        <View>
        {this.authorized()}
        </View>
      );
  }
  }

}

function mapStateToProps(state) {
    return {
      email: state.email,
      password: state.password,
      accountID: state.accountID,
      auth: state.auth,
      mess: state.mess
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signup: (auth) => dispatch({ type: 'AUTH_SIGNUP', id: auth }),
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)
