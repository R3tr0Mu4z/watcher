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
import { connect } from 'react-redux';
const PHONE_URL = 'http://192.168.0.110:5000/phone'
const MAIN_PHONE_URL = 'http://192.168.0.110:5000/main-phone'
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
      fetch(PHONE_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountID : this.props.accountID,
        name : this.state.phonename
      })

    }).then(response => response.json())
    .then(json => {
        var phone = {};
        phone.name = json.title;
        phone.id = json._id;
        console.log(phone, 'PHOEN DATEALS')
        this.props.addphone(phone);
        console.log(this.props)
        console.log(this.props)
        fetch(MAIN_PHONE_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountID : this.props.accountID,
          phoneID : this.props.phoneID
        })

      }).then(response => response.json())
      .then(json => {
        console.log(json)
      })
    })

    }

    hasphone = () => {
      this.props.navigation.navigate('Main');
    }

    render() {

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
