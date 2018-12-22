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
import { MonoText } from '../components/StyledText';
import socketIOClient from 'socket.io-client'
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint)


export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      accountID: '',
      auth: '',
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
    socket.on('signup', (savedAccount) => {
      this.setState({accountID : savedAccount._id})
      console.log(this.state, 'signup state')
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
      <FormValidationMessage>Error message</FormValidationMessage>
      <Button
      onPress={() => this.signup() }
  title='SIGNUP' />

    <FormLabel>Phone Name</FormLabel>
    <FormInput onChangeText={(phonename) => this.setState({phonename})}/>
    <FormValidationMessage>Error message</FormValidationMessage>
    <Button
    onPress={() => this.phone() }
  title='ADD PHONE' />
  <Button
  onPress={() => this.locations() }
  title='ADD LOCATION' />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
