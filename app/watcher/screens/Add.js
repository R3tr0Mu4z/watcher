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
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { connect } from 'react-redux';
const PUSH_ENDPOINT = 'http://192.168.0.110:5000/push';
const REQUEST_ENDPOINT = 'http://192.168.0.110:5000/access';
const REQUEST_ACCESS_URL = 'http://192.168.0.110:5000/requestaccess'

class AddScreen extends Component {


    constructor() {
      super();
      this.state = {
        push: null,
        req: null
      };
    }
    static navigationOptions = {
        header: null
    }

    async requestPhone() {
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
      console.log(json)
    })
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
