import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthScreen from './screens/Auth';
import PhoneScreen from './screens/Phone';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import socketIOClient from 'socket.io-client'
import { createStackNavigator } from 'react-navigation'
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint)

const initialState = {
  email: '',
  password: '',
  accountID: '',
  auth: '',
  mess: '',
  phonename: '',
  phoneID: ''
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH_SIGNUP':
            console.log(action)
            return { auth: action.mess, accountID: action.id }
    }
    return state
}

const store = createStore(reducer);


class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
          <AppStackNavigator />
      </Provider>
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Home: AuthScreen,
  Phone: PhoneScreen

})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
