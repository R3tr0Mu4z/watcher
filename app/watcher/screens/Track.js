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
import { Permissions, Notifications } from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage, List, ListItem } from 'react-native-elements'
import { connect } from 'react-redux';
const PUSH_ENDPOINT = 'http://192.168.0.110:5000/push';
const REQUEST_ENDPOINT = 'http://192.168.0.110:5000/access';
const LOCATION_ENDPOINT = 'http://192.168.0.110:5000/location';
class TrackScreen extends Component {

  async getToken(){
    if (!Expo.Constants.isDevice) {
      return;
    }
    let { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.LOCATION,
    );
    let { push_status } = await Expo.Permissions.askAsync(
      Expo.Permissions.NOTIFICATIONS,
    );

    let value = await Expo.Notifications.getExpoPushTokenAsync();
    console.log(value)
    fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountID: this.props.accountID,
      token: value
    })

  })
  }

  componentDidMount() {
    this.getToken();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }
  _handleNotification = (notification) => {
    console.log(notification.data.request, 'notification data type')
    if (notification.data.request == "REQUEST_PHONE") {
      console.log("request phone")

    } else if (notification.data.request == "REQUEST_STATUS") {
      this.getLocation()
    }
  };

    constructor() {
      super();
      this.state = {
        lat: null,
        long: null,
        speed: null,
        timestamp: null,
        status: 'Unknown',
        push: null,
        req: null
      };
    }
    static navigationOptions = {
        header: null
    }
    async getLocation() {
      navigator.geolocation.getCurrentPosition(
       (position) => {
         console.log(position);
         this.setState({
           lat: position.coords.latitude,
           long: position.coords.longitude,
           speed: position.coords.speed,
           timestamp: position.timestamp
         });
         this.locations();
       },
       (error) => this.setState({ error: error.message }),
       { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
     );
    }

    async locations() {
      fetch(LOCATION_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneID : this.props.phoneID,
        lat : this.state.lat,
        long :this.state.long,
        speed :this.state.speed,
        timestamp : this.state.timestamp,
        status : this.state.status
      })
    }).then(response => response.json())
    .then(json => {
      console.log(json)
    })
    }

    render() {

        return (

            <View>
            <Text>{this.state.lat}</Text>
            <Text>{this.state.long}</Text>
            <Text>{this.state.speed}</Text>
            <Text>{this.state.timestamp}</Text>
            <Text>{this.state.status}</Text>
            <Text>{this.props.phoneID}</Text>
            <Text>{this.state.req}</Text>
            <FormInput
            onChangeText={(status) => this.setState({status})}
            placeholder = "What are you doing?"
            />

            <Button
            onPress={() => this.getLocation() }
          title='START TRACKING' />
            </View>


        );
    }
}

function mapStateToProps(state) {
    return {
      accountID: state.accountID,
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

export default connect(mapStateToProps, mapDispatchToProps)(TrackScreen)
