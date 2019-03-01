import React, { Component } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Container, Header, Content, Item, Input, Button, Text, Left, Body, Right, Title, Subtitle } from 'native-base';
import { Permissions, Notifications } from 'expo';
import { showMessage, hideMessage } from "react-native-flash-message";
import { connect } from 'react-redux';
const PUSH_ENDPOINT = 'http://192.168.0.106:5000/push';
const REQUEST_ENDPOINT = 'http://192.168.0.106:5000/access';
const LOCATION_ENDPOINT = 'http://192.168.0.106:5000/location';
class TrackScreen extends Component {

  async getToken(){
    if (!Expo.Constants.isDevice) {
      return;
    }
    let { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.LOCATION,
    );
    let { push_status } = await Expo.Permissions.askAsync(
      Expo.Permissions.NOTIFICATIONS,
    );

    let value = await Expo.Notifications.getExpoPushTokenAsync();
    console.log(value)
    fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountID: this.props.accountID,
      token: value,
      secretkey: "gonnachangethislater"
    })

  })
  }

  componentDidMount() {
    this.getToken();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }
  _handleNotification = (notification) => {
    console.log(notification.data.request, 'notification data type')
    if (notification.data.request == "REQUEST_PHONE") {
      console.log("request phone")

    } else if (notification.data.request == "REQUEST_STATUS") {
      this.getLocation()
    }
  };

    constructor() {
      super();
      this.state = {
        lat: null,
        long: null,
        speed: null,
        timestamp: null,
        status: 'Unknown',
        push: null,
        req: null,
        form: null
      };
    }
    static navigationOptions = {
        header: null
    }
    async getLocation() {
        showMessage({
            message: 'Updating',
            type: "info",
        });
      navigator.geolocation.getCurrentPosition(
       (position) => {
         console.log(position);
         this.setState({
           lat: position.coords.latitude,
           long: position.coords.longitude,
           speed: position.coords.speed,
           timestamp: position.timestamp
         });
         this.locations();
       },
       (error) => this.setState({ error: error.message }),
       { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
     );
    }

    async locations() {
      fetch(LOCATION_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneID : this.props.phoneID,
        lat : this.state.lat,
        long :this.state.long,
        speed :this.state.speed,
        timestamp : this.state.timestamp,
        status : this.state.status,
        secretkey: "gonnachangethislater"
      })
    }).then(response => response.json())
    .then(json => {
      console.log(json)
        showMessage({
            message: 'Updated',
            type: "info",
        })
    })
    }

    render() {

        return (

            <Container>
                <Header style={styles.headr}>
                    <Left>
                        <Title>Status</Title>
                    </Left>
                    <Body>

                    </Body>
                    <Right />
                </Header>
                <Content style={styles.formarea}>

            <Item>
                <Input
                    placeholder='Type Your Status'
                    onChangeText={(status) => this.setState({status})}/>
            </Item>


                <View style={styles.Buttonstyle}>
                    <Button
                        onPress={() => this.getLocation()}
                        dark>
                        <Text>Set Status</Text>
                    </Button>

                </View>
                </Content>
            </Container>


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
    Buttonstyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        paddingTop: 10
    },
    formarea: {
        paddingTop: 10
    },
    headr: {
        backgroundColor: '#000'
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackScreen)
