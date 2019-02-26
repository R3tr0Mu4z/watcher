import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { Permissions, Notifications } from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage, List, ListItem } from 'react-native-elements'
import { connect } from 'react-redux';
const PUSH_ENDPOINT = 'http://192.168.0.106:5000/phones';
class PhonesScreen extends Component {


    getPhones() {
       fetch(PUSH_ENDPOINT, {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           ID: this.props.accountID
       })

     }).then(response => response.json())
     .then(json => {
       this.setState({phones: json})
         console.log(this.state, 'PHONE SCREEEEEEEN')
     })

   }



  componentWillMount() {
    this.getPhones();
  }


    constructor() {
      super();
      this.state = {
        phones: [],
        map: null
      };
    }
    static navigationOptions = {
        header: null
    }

    gps(id) {
      this.props.navigation.navigate('Map', {
        mapphone: id,
      });
    }


    render() {

        return (

          <View>
          <List containerStyle={{marginBottom: 20}}>
            {
              this.state.phones.map((l) => (
                <ListItem
                  key={l.id}
                  title={l.name}
                  onPress={() => Alert.alert(
                      l.name,
                      'User can view your location',
                      [
                        {text: 'Request location', onPress: () => console.log(this.props)},
                        {text: 'View locations', onPress: () => this.gps(l.id)},
                      ],
                      { cancelable: false }
                    )}
                />
              ))
            }
          </List>
          </View>

        );
    }
}

function mapStateToProps(state) {
    return {
      map: state.map,
      accountID: state.accountID,
      phonename: state.phonename,
      phoneID: state.phoneID
    }
}

function mapDispatchToProps(dispatch) {
    return {
      mainphn: (phn) => dispatch({ type: 'MAP_PHONE', id: phn }),
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PhonesScreen)
