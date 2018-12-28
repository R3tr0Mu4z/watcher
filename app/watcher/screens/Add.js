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
const PUSH_ENDPOINT = 'http://192.168.0.110:5000/push';
const REQUEST_ENDPOINT = 'http://192.168.0.110:5000/access';;
const REQUEST_ACCESS_URL = 'http://192.168.0.110:5000/requestaccess';
const REQUESTED_PHONES_URL = 'http://192.168.0.110:5000/requested-phones';
const ENABLE_ENDPOINT = 'http://192.168.0.110:5000/enable';
const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

class AddScreen extends Component {
    constructor() {
      super();
      this.state = {
        push: null,
        req: null,
        list: [],
        loading: null
      };
    }
    static navigationOptions = {
        header: null
    }

     requestPhone() {
      fetch(REQUEST_ACCESS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          phoneID: this.state.req,
          accountID : this.props.accountID
      })

    }).then(response => response.json())
    .then(json => {
      console.log(json);
    })
    }

    async requestedPhones() {
      this.setState({loading: 'Loading...'})
      fetch(REQUESTED_PHONES_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          accountID : this.props.accountID
      })

    }).then(response => response.json())
    .then(json => {
      this.setState({list : json})
      this.setState({loading: null})
    })
    }

    enable(id) {
      fetch(ENABLE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recaccountID: id,
        senaccountID: this.props.accountID,
        phoneID: this.props.phoneID
      })

    }).then(response => response.json())
    .then(json => {
      this.requestedPhones()
    })
    }

    componentWillMount() {
      this.requestedPhones();
    }
    render() {

        return (
            <View>
              <FormInput
              onChangeText={(req) => this.setState({req})}
              placeholder = "Enter Phone ID"
              />

              <Button
              onPress={() => this.requestPhone() }
            title='REQUEST ACCESS' />
            <Button
            onPress={() => this.requestedPhones() }
          title='CHECK' />
          <Text>{this.state.loading}</Text>
          <List containerStyle={{marginBottom: 20}}>
            {
              this.state.list.map((l) => (
                <ListItem
                  key={l._id}
                  title={l.name}
                  onPress={() => Alert.alert(
                      'Allow access?',
                      'User can view your location',
                      [
                        {text: 'Ask me later', onPress: () => console.log(l._id)},
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => this.enable(l._id)},
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
      accountID: state.accountID,
      phonename: state.phonename,
      phoneID: state.phoneID
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddScreen)
