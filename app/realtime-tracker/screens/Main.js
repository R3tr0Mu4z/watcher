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
import Expo from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import socketIOClient from 'socket.io-client'
import { connect } from 'react-redux';
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint)

async function getToken(){
  if (!Expo.Constants.isDevice) {
    return;
  }
  let { status } = await Expo.Permissions.askAsync(
    Expo.Permissions.LOCATION,
  );
  if (status !== 'granted') {
    return;
  }
  let value = await Expo.Notifications.getExpoPushTokenAsync();
}
class MainScreen extends Component {
  componentDidMount() {
    getToken();
  }
    constructor() {
      super();
      this.state = {
        lat: null,
        long: null,
        speed: null,
        timestamp: null,
        status: null
      };
    }
    static navigationOptions = {
        header: null
    }
    getLocation = () => {
      navigator.geolocation.getCurrentPosition(
       (position) => {
         console.log(position);
         this.setState({
           lat: position.coords.latitude,
           long: position.coords.longitude,
           speed: position.coords.speed,
           timestamp: position.timestamp
         });
       },
       (error) => this.setState({ error: error.message }),
       { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
     );
    }

    locations = () => {
      var addlocation = {};
      addlocation.phoneID = this.props.phoneID;
      addlocation.lat = this.state.lat;
      addlocation.long = this.state.long;
      addlocation.speed = this.state.speed;
      addlocation.timestamp = this.state.timestamp;
      addlocation.status = this.state.status;
      socket.emit('location', addlocation)
    }

    render() {
        socket.on('location', (location) => {
          console.log(location, 'LOCATIOOOOOOOOOOOOON')
        })
        return (
            <View>
            <Text>{this.state.lat}</Text>
            <Text>{this.state.long}</Text>
            <Text>{this.state.speed}</Text>
            <Text>{this.state.timestamp}</Text>
            <Text>{this.state.status}</Text>
            <Text>{this.props.phoneID}</Text>
            <Button
            onPress={() => this.getLocation() }
          title='SAVE' />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
      phonename: state.phonename,
      phoneID: state.phoneID
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addphone: (phone) => dispatch({ type: 'ADD_PHONE', phone: phone }),
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)
