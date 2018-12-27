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
import socketIOClient from 'socket.io-client'
import { connect } from 'react-redux';
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint);
const PUSH_ENDPOINT = 'http://192.168.0.110:5000/push';
const REQUEST_ENDPOINT = 'http://192.168.0.110:5000/access';

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
      var sent = {};
      sent.phoneID = this.state.req;
      sent.accountID = this.props.accountID;
      socket.emit('gettoken', sent)
    }

    render() {


        socket.on('gettoken', (token) => {
          console.log(token, 'TOKEN')
        })
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
