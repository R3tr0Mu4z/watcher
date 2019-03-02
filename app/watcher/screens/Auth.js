import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard
} from 'react-native';
import { Container, Header, Content, Item, Input, Button, Text } from 'native-base';
import Expo from 'expo';
import { connect } from 'react-redux';
import { showMessage, hideMessage } from "react-native-flash-message";
const SIGNUP_URL = 'https://host/registration';
const LOGIN_URL = 'https://host/login';
const RESET_URL = 'https://host/reset';
const logo = require('../assets/icon.png');

class AuthScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      name: null,
      email: null,
      password: null,
      accountID: null,
      auth: '',
      mess: '',
      form: 'signup',
      secretkey: "****************"
    };
  }
  signup = () => {
    Keyboard.dismiss()
    fetch(SIGNUP_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: this.state.name,
        email : this.state.email,
        password: this.state.password,
        secretkey: "****************"
    })

  }).then(response => response.json())
  .then(json => {
    this.setState({accountID : json.id})
    this.setState({auth : json.auth})
    this.setState({mess : json.mess})
    var auth = json.id;
    this.props.signup(auth);
      showMessage({
          message: this.state.mess,
          type: "info",
      })
    if (json.id !== null) {
      this.props.navigation.navigate('Phone')
    }

  })
  }
  login = () => {
     Keyboard.dismiss()
    fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email : this.state.email,
        password: this.state.password,
        secretkey: "****************"
    })

  }).then(response => response.json())
  .then(json => {
    this.setState({accountID : json.id})
    this.setState({auth : json.auth})
    this.setState({mess : json.mess})
    var auth = json.id;
      showMessage({
          message: this.state.mess,
          type: "info",
      });
    this.props.signup(auth);
    if (json.id !== null) {
        this.props.navigation.navigate('Phone')
    }

  })
  }

  reset = () => {
      Keyboard.dismiss()
      fetch(RESET_URL, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email : this.state.email,
              secretkey: "****************"
          })

      }).then(response => response.json())
       .then(json => {
           this.setState({mess : json.mess})
           showMessage({
               message: this.state.mess,
               type: "info",
           });

       })
    }
  authorized = () => {
    this.props.navigation.navigate('Phone');
  }

  componentWillMount() {

  }

    static navigationOptions = {
    header: null,
  };

  render() {
    if (this.props.accountID == null) {

      if (this.state.form == 'signup') {
        return (
            <Container>
            <Content style={styles.formarea}>
            <View style={styles.logostyle}>
            <Image source={logo} style={styles.logo} />
            </View>
            <Item>
              <Input
                  placeholder='Name'
                  onChangeText={(name) => this.setState({name})}/>
            </Item>
            <Item>
              <Input
                  placeholder='Email'
                  onChangeText={(email) => this.setState({email})}/>
            </Item>
            <Item>
              <Input
                  placeholder='Password     '
                  onChangeText={(password) => this.setState({password})}/>
            </Item>
                <View style={styles.Buttonstyle}>
              <Button
                  onPress={() => this.signup()}
                  dark>
              <Text>Sign Up</Text>
              </Button>
                </View>
              <TouchableOpacity
                  onPress={() => this.setState({form: 'login'})}>
                <Text>Already have an account? Sign In</Text>
              </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.setState({form: 'reset'})}>
                    <Text>Reset Password</Text>
                </TouchableOpacity>
            </Content>
            </Container>
        );
      } else if (this.state.form == 'login') {
        return (
            <Container>
                <Content style={styles.formarea}>
                <View style={styles.logostyle}>
                <Image source={logo} style={styles.logo} />
                </View>
                <Item>
                    <Input
                        placeholder='Email'
                        onChangeText={(email) => this.setState({email})}/>
                </Item>
                <Item>
                    <Input
                        placeholder='Password     '
                        onChangeText={(password) => this.setState({password})}/>
                </Item>
                <View style={styles.Buttonstyle}>
                  <Button
                      onPress={() => this.login()}
                      dark>
                      <Text>Sign In</Text>
                  </Button>
                </View>
                  <TouchableOpacity
                      onPress={() => this.setState({form: 'signup'})}>
                    <Text>Don't have an account? Sign Up</Text>
                  </TouchableOpacity>
            </Content>
            </Container>
        );
      } else if (this.state.form == 'reset') {
          return (
          <Container>
              <Content style={styles.formarea}>
                  <View style={styles.logostyle}>
                  <Image source={logo} style={styles.logo} />
                  </View>
                  <Item>
                      <Input
                          placeholder='Email'
                          onChangeText={(email) => this.setState({email})}/>
                  </Item>
                  <View style={styles.Buttonstyle}>
                      <Button
                          onPress={() => this.reset()}
                          dark>
                          <Text>Reset Password</Text>
                      </Button>

                  </View>
                  <TouchableOpacity
                      onPress={() => this.setState({form: 'login'})}>
                      <Text>Back to Sign In</Text>
                  </TouchableOpacity>
              </Content>
          </Container>
          );
      }
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
Buttonstyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingBottom: 10,
    paddingTop: 20
},
formarea: {
    paddingTop: 50
},
logo: {
    width: 100,
    height: 100
},
logostyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
}
});
export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)
