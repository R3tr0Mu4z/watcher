import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthScreen from './screens/Auth';
import PhoneScreen from './screens/Phone';
import MainScreen from './screens/Main';
import TrackScreen from './screens/Track';
import MapScreen from './screens/Map';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import { Provider } from 'react-redux';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import storage from 'redux-persist/lib/storage'

const initialState = {
  email: '',
  password: '',
  accountID: null,
  auth: '',
  mess: '',
  phonename: null
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH_SIGNUP':
            return { auth: action.mess, accountID: action.id }
        case 'ADD_PHONE':
            console.log(state, 'MAIN APP JS STATE')
            return { accountID: state.accountID, phonename: action.phone.name, phoneID: action.phone.id }
    }
    return state
}
const persistConfig = {
  key: 'root',
  blacklist: 'socket',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

let store = createStore(persistedReducer);
let persistor = persistStore(store)


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
  Phone: PhoneScreen,
  Main: {
    screen: createBottomTabNavigator({
      Track: TrackScreen,
      Map: MapScreen
    })
  }

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