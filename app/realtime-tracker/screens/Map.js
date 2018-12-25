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
const coords = {
    latitude: 23.7890668,
    longitude: 90.3601999
};
class MapScreen extends Component {

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
          <MapView
      style={{
        flex: 1
      }}
      initialRegion={{
        latitude: 37.8025259,
        longitude: -122.4351431,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
      <MapView.Polyline
      coordinates={[
{ latitude: 37.8025259, longitude: -122.4351431 },
{ latitude: 37.7896386, longitude: -122.421646 },
{ latitude: 37.7665248, longitude: -122.4161628 },
{ latitude: 37.7734153, longitude: -122.4577787 },
{ latitude: 37.7948605, longitude: -122.4596065 },
{ latitude: 37.8025259, longitude: -122.4351431 }
]}
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default MapScreen;
