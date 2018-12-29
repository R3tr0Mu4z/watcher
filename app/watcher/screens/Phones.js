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
const PUSH_ENDPOINT = 'http://192.168.0.110:5000/phones';
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
      console.log(id, 'gps')
      this.props.mainphn(id);
      console.log(this.props)
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
                      'Allow access?',
                      'User can view your location',
                      [
                        {text: 'Cancel', onPress: () => console.log(this.props)},
                        {text: 'Yes', onPress: () => this.gps(l.id)},
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
