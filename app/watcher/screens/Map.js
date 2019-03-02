import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
   BackHandler
} from "react-native";
import { MapView } from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { connect } from 'react-redux';
const COORDINATES_URL = 'https://host/coordinates';
const pin = require('../assets/pin.png');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const mapstyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
]

class MapScreen extends Component {

    constructor() {
      super();
      this.state = {
        mapID: null,
        coordinates: [],
        markers: [],
        initlat: 23.7894554,
        initlng: 90.3602357
      };
    }
    static navigationOptions = {
        header: null
    }

    async getCoordinates(mapphone) {
      console.log(mapphone, 'getting coordinates')
      fetch(COORDINATES_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          phoneid: mapphone,
          secretkey: "****************"
      })
    }).then(response => response.json())
    .then(json => {
      this.setState({coordinates: json.coordinates});
      this.setState({markers: json.markers});
      this.setState({initlat: this.state.coordinates[0].latitude});
      this.setState({initlng: this.state.coordinates[0].longitude});
    })
        console.log(pin,' PIN')
      await sleep(60000);
      this.getCoordinates()
    }
    componentWillMount() {
        const { navigation } = this.props;
        const mapphone = navigation.getParam('mapphone', 'NO-ID');
        console.log(mapphone, 'MAP PHN')
        this.setState({mapID: mapphone});
        this.getCoordinates(mapphone);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        BackHandler.exitApp();
    };

    render() {

        return (

          <MapView
          style={{
          flex: 1
          }}
          initialRegion={{
          latitude: this.state.initlat,
          longitude: this.state.initlng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }}
          customMapStyle={mapstyle}>

          {this.state.markers.map((marker, index) => {
             const coords = {
                 latitude: marker.latitude,
                 longitude: marker.longitude,
             };
              let event = new Date(marker.time);

              let time = event.toString();
                console.log(time);
             return (
                 <MapView.Marker
                    key={index}
                    coordinate={coords}
                    title={marker.status}
                    description={time}
                    image={pin}
                 />
             );
          })}


          <MapView.Polyline
        		coordinates={this.state.coordinates}
        		strokeColor="#fff"
        		strokeColors={[
        			'#7F0000',
        			'#00000000',
        			'#B24112',
        			'#E5845C',
        			'#238C23',
        			'#7F0000'
        		]}
        		strokeWidth={4}
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
