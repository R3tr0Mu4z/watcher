import React, { Component } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Container, Header, Content, Item, Input, Button, Text } from 'native-base';
import { WebBrowser } from 'expo';
import { connect } from 'react-redux';
const PHONE_URL = 'http://192.168.0.106:5000/phone'
const MAIN_PHONE_URL = 'http://192.168.0.106:5000/main-phone'
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
            <Container>
                <Content style={styles.phonearea}>
                    <Item>
                        <Input
                            placeholder='Phone Name'
                            onChangeText={(phonename) => this.setState({phonename})}/>
                    </Item>
                    <View style={styles.Buttonstyle}>
                        <Button
                            onPress={() => this.phone()}
                            dark>
                            <Text>Save</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
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
    phonearea: {
        paddingTop: 50
    },
    Buttonstyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        paddingBottom: 10,
        paddingTop: 10
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneScreen)
