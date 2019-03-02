import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthScreen from './screens/Auth';
import PhoneScreen from './screens/Phone';
import MainScreen from './screens/Main';
import TrackScreen from './screens/Track';
import MapScreen from './screens/Map';
import AddScreen from './screens/Add';
import SettingScreen from './screens/Setting';
import PhonesScreen from './screens/Phones.js';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import { Provider } from 'react-redux';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import storage from 'redux-persist/lib/storage'
import FlashMessage from "react-native-flash-message";
import Ionicons from 'react-native-vector-icons/Ionicons';
const initialState = {
  email: '',
  password: '',
  accountID: null,
  auth: '',
  mess: '',
  phonename: null,
  map: null
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH_SIGNUP':
            return { auth: action.mess, accountID: action.id }
        case 'ADD_PHONE':
            console.log(state, 'MAIN APP JS STATE')
            return { accountID: state.accountID, phonename: action.phone.name, phoneID: action.phone.id }
        case 'MAP_PHONE':
            return { accountID: state.accountID, phonename: state.phonename, phoneID: state.phoneID, map: action.id }
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
          <FlashMessage position="bottom" />
      </Provider>
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Home: AuthScreen,
  Phone: PhoneScreen,
  Map: MapScreen,
  Main: {
    screen: createBottomTabNavigator({
      Status: {
          screen: TrackScreen,
          navigationOptions: {
              tabBarIcon: ({ focused, tintColor }) => {
                  const iconName = `ios-compass`;
                  return <Ionicons name={iconName} size={25} color={tintColor} />;
              },
          },
      },
      Phones: {
          screen: PhonesScreen,
          navigationOptions: {
              tabBarIcon: ({ focused, tintColor }) => {
                  const iconName = `ios-phone-portrait`;
                  return <Ionicons name={iconName} size={25} color={tintColor} />;
              },
          },
      },
      Request: {
          screen: AddScreen,
          navigationOptions: {
              tabBarIcon: ({ focused, tintColor }) => {
                  const iconName = `ios-add-circle-outline`;
                  return <Ionicons name={iconName} size={25} color={tintColor} />;
              },
          },
      },
      Settings: {
          screen: SettingScreen,
          navigationOptions: {
              tabBarIcon: ({ focused, tintColor }) => {
                  const iconName = `ios-settings`;
                  return <Ionicons name={iconName} size={25} color={tintColor} />;
              },
          },
      },
    },
        {
            tabBarOptions: {
                activeTintColor: 'black',
                inactiveTintColor: 'gray',
            },
        }
    )
  }
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
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
