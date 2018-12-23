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
import { WebBrowser } from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import socketIOClient from 'socket.io-client'
import { connect } from 'react-redux';
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint)


class AuthScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      accountID: '',
      auth: '',
      mess: '',
      phonename: '',
      phoneID: ''
    };
  }
  signup = () => {
    var auth = {};
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
  phone = () => {
    var addphone = {};
    addphone.accountID = this.state.accountID;
    addphone.email = this.state.email;
    addphone.name = this.state.phonename;
    socket.emit('phone', addphone)
  }
  locations = () => {
    var addlocation = {};
    addlocation.phoneID = this.state.phoneID;
    addlocation.lat = 123;
    addlocation.long = 789;
    socket.emit('location', addlocation)
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    socket.on('signup', (resp) => {
      this.setState({accountID : resp.id})
      this.setState({auth : resp.auth})
      this.setState({mess : resp.mess})
      console.log(resp, 'RESP')
      console.log(this.state, 'signup state')
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
    socket.on('phone', (savedPhone) => {
      this.setState({phoneID : savedPhone._id})
      console.log(this.state, 'phone  state')
    })
    socket.on('location', (location) => {
      this.setState({phoneID : savedPhone._id})
      console.log(this.state, 'phone  state')
    })
    return (
      <View style={styles.container}>
      <FormLabel>Email</FormLabel>
      <FormInput onChangeText={(email) => this.setState({email})}/>
      <FormLabel>Password</FormLabel>
      <FormInput onChangeText={(password) => this.setState({password})}/>
      <FormValidationMessage>{this.props.accountID}</FormValidationMessage>
      <Button
      onPress={() => this.signup() }
  title='SIGNUP' />
  <Button
  onPress={() => this.login() }
title='LOGIN' />
      </View>
    );
  }

}

function mapStateToProps(state) {
    return {
      email: state.email,
      password: state.password,
      accountID: state.accountID,
      auth: state.auth,
      mess: state.mess,
      phonename: state.phonename,
      phoneID: state.phoneID
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
