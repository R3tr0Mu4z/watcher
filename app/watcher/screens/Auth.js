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
import socketIOClient from 'socket.io-client'
import { connect } from 'react-redux';
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint)

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
    var auth = {};
    auth.name = this.state.name;
    auth.email = this.state.email;
    auth.password = this.state.password;
    socket.emit('signup', auth)
  }
  login = () => {
    var auth = {};
    auth.email = this.state.email;
    auth.password = this.state.password;
    socket.emit('login', auth)
  }
  authorized = () => {
    socket.disconnect();
    this.props.navigation.navigate('Phone');
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    socket.on('signup', (resp) => {
      this.setState({accountID : resp.id})
      this.setState({auth : resp.auth})
      this.setState({mess : resp.mess})
      var auth = resp.id;
      this.props.signup(auth);
      if (resp.id !== null) {
        this.props.navigation.navigate('Phone')
      }
    })
    socket.on('login', (resp) => {
      this.setState({accountID : resp.id})
      this.setState({auth : resp.auth})
      this.setState({mess : resp.mess})
      console.log(resp, 'RESP')
      console.log(this.state, 'login state')
    })

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
