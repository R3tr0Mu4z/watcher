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
import { MapView } from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import socketIOClient from 'socket.io-client'
import { connect } from 'react-redux';
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class MapScreen extends Component {

    constructor() {
      super();
      this.state = {
        coords: [{ latitude: 37.8025259, longitude: -122.4351431 },
        { latitude: 37.7896386, longitude: -122.421646 },
        { latitude: 37.7665248, longitude: -122.4161628 },
        { latitude: 37.7734153, longitude: -122.4577787 },
        { latitude: 37.7948605, longitude: -122.4596065 },
        { latitude: 37.8025259, longitude: -122.4351431 }]
      };
    }
    static navigationOptions = {
        header: null
    }

    async getCoordinates() {
      var phoneid = this.props.phoneID;
      socket.emit('coordinates', phoneid)
      console.log(phoneid, 'PHONE ID');
      await sleep(30000);
      this.getCoordinates()
    }
    componentDidMount() {
      this.getCoordinates();
    }

    render() {
      socket.on('coordinates', (coordinates, markers) => {
        console.log(coordinates)
        console.log(markers)
        // this.getCoordinates();
      })
        return (

          <MapView
          style={{
          flex: 1
          }}
          initialRegion={{
          latitude: 23.7890704,
          longitude: 90.3601884,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }}>

          <MapView.Polyline
          coordinates={this.state.coords}
          strokeColor="#000"
          strokeColors={[
          '#7F0000',
          '#00000000',
          '#B24112',
          '#E5845C',
          '#238C23',
          '#7F0000'
          ]}
          strokeWidth={2}
          lineCap={'round'}

          />

          </MapView>

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

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
