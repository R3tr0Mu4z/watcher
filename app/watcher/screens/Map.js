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
import { connect } from 'react-redux';
const COORDINATES_URL = 'http://192.168.0.110:5000/coordinates';
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class MapScreen extends Component {

    constructor() {
      super();
      this.state = {
        coordinates: [],
        markers: []
      };
    }
    static navigationOptions = {
        header: null
    }

    async getCoordinates() {
      console.log(this.props.accountID, 'getting coordinates')
      fetch(COORDINATES_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          phoneid: this.props.phoneID
      })
    }).then(response => response.json())
    .then(json => {
      this.setState({coordinates: json.coordinates});
      this.setState({markers: json.markers});
    })
      await sleep(60000);
      this.getCoordinates()
    }
    componentWillMount() {
      this.getCoordinates();
    }

    render() {
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

          {this.state.markers.map((marker, index) => {
             const coords = {
                 latitude: marker.latitude,
                 longitude: marker.longitude,
             };

             return (
                 <MapView.Marker
                    key={index}
                    coordinate={coords}
                 />
             );
          })}


          <MapView.Polyline
        		coordinates={this.state.coordinates}
        		strokeColor="#000"
        		strokeColors={[
        			'#7F0000',
        			'#00000000',
        			'#B24112',
        			'#E5845C',
        			'#238C23',
        			'#7F0000'
        		]}
        		strokeWidth={6}
        	/>
          </MapView>

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

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
