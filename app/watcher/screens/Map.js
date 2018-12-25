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

class MapScreen extends Component {

    constructor() {
      super();
      this.state = {

      };
    }
    static navigationOptions = {
        header: null
    }

    getCoordinates = () => {
      var phoneid = this.props.phoneID;
      socket.emit('coordinates', phoneid)
    }

    render() {
      socket.on('coordinates', (coordinates) => {
        console.log(coordinates, 'coordinates')
      })
        return (

          <View>
          <Button
          onPress={() => this.getCoordinates() }
        title='Get Coordinates' />
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

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
