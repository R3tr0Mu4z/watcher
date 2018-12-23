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
import { WebBrowser } from 'expo';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import socketIOClient from 'socket.io-client'
import { connect } from 'react-redux';
const endpoint = 'http://192.168.0.110:5000';
const socket = socketIOClient(endpoint)

class PhoneScreen extends Component {

    static navigationOptions = {
        header: null
    }

    render() {
        return (
            <View>
              <Text>{this.props.accountID}</Text>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
      email: state.email,
      password: state.password,
      accountID: state.accountID,
      auth: state.auth,
      mess: state.mess,
      phonename: state.phonename,
      phoneID: state.phoneID
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signup: (auth) => dispatch({ type: 'AUTH_SIGNUP', id: auth }),
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneScreen)
