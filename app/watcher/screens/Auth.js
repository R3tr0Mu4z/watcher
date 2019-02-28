import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Header, Content, Item, Input, Button, Text } from 'native-base';
import Expo from 'expo';
import { connect } from 'react-redux';
const SIGNUP_URL = 'http://192.168.0.106:5000/registration';
const LOGIN_URL = 'http://192.168.0.106:5000/login';
var key = "gonnachangethislater";

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
      secretkey: "gonnachangethislater"
    };
  }
  signup = () => {
    console.log(this.props, 'this.props')
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
        secretkey: "gonnachangethislater"
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
        password: this.state.password,
        secretkey: "gonnachangethislater"
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

      if (this.state.form == 'signup') {
        return (
            <Container>
            <Content style={styles.formarea}>
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
              <Text>{this.state.mess}</Text>
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
            </Content>
            </Container>
        );
      } else {
        return (
            <Container>
                <Content style={styles.formarea}>
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
                  <Text>{this.state.mess}</Text>
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
    paddingBottom: 10
},
formarea: {
    paddingTop: 50
}
});
export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)
