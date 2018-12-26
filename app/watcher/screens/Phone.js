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
    constructor() {
      super();
      this.state = {
        phonename: null,
        phoneID: null
      };
    }
    static navigationOptions = {
        header: null
    }

    phone = () => {
      var addphone = {};
      addphone.accountID = this.props.accountID;
      addphone.name = this.state.phonename;
      socket.emit('phone', addphone)
    }

    main_phone = () => {
      var main_phone = {};
      main_phone.accountID = this.props.accountID;
      main_phone.phoneID = this.props.phoneID;
      console.log(main_phone, 'main_phone')
      socket.emit('main', main_phone)
    }
    hasphone = () => {
      this.props.navigation.navigate('Main');
    }

    render() {
      socket.on('phone', (resp) => {
        var phone = {};
        phone.name = resp.title;
        phone.id = resp._id;
        console.log(phone, 'PHOEN DATEALS')
        this.props.addphone(phone);
        this.main_phone();
      })
      socket.on('main', (resp) => {
        console.log(resp);
      })
      if (this.props.phoneID == null) {
        return (
            <View>
            <FormLabel>Phone Name</FormLabel>
            <FormInput onChangeText={(phonename) => this.setState({phonename})}/>
            <FormValidationMessage>{this.props.phoneID}</FormValidationMessage>
            <Button
            onPress={() => this.phone() }
          title='SAVE' />
            </View>
        );
      } else {
        return (
          <View>
            {this.hasphone()}
          </View>
        )
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(PhoneScreen)
