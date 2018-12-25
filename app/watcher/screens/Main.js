import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { createBottomTabNavigator } from 'react-navigation'

class MainScreen extends Component {

    constructor() {
      super();
      this.state = {

      };
    }
    static navigationOptions = {
        header: null
    }



    render() {

        return (
          <View><Text>Main Screen</Text></View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default MainScreen;
