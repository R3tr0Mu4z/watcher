import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { Permissions, Notifications } from 'expo';
import { Container, Header, Content, Item, Input, Button, Text, Left, Body, Right, Title, Subtitle, List, ListItem, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
const PUSH_ENDPOINT = 'http://192.168.0.106:5000/push';
const REQUEST_ENDPOINT = 'http://192.168.0.106:5000/access';
const REQUEST_ACCESS_URL = 'http://192.168.0.106:5000/requestaccess';
const REQUESTED_PHONES_URL = 'http://192.168.0.106:5000/requested-phones';
const ENABLE_ENDPOINT = 'http://192.168.0.106:5000/enable';
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
          accountID : this.props.accountID,
          secretkey: "gonnachangethislater"
      })

    }).then(response => response.json())
    .then(json => {
        this.setState({req: json.stat})
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
          accountID : this.props.accountID,
          secretkey: "gonnachangethislater"
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
        phoneID: this.props.phoneID,
        secretkey: "gonnachangethislater"
      })

    }).then(response => response.json())
    .then(json => {
      this.state.list = null;
      this.requestedPhones()
    })
    }

    componentWillMount() {
      this.requestedPhones();
    }
    render() {

        return (
            <Container>
                <Header style={styles.headr}>
                    <Left>
                        <Title>Request</Title>
                    </Left>
                    <Body>

                    </Body>
                    <Right />
                </Header>
                <Content style={styles.formarea}>
                <Item>
                  <Input
                  onChangeText={(req) => this.setState({req})}
                  placeholder = "Enter Phone ID"
                  />
                </Item>
            <View style={styles.Buttonstyle}>
                <Button
                    onPress={() => this.requestPhone()}
                    dark>
                    <Text>Request Access</Text>
                </Button>

            </View>
            <View>
                <Text>{this.state.req}</Text>
            </View>
            <View>
                <Text>Your Phone ID : {this.props.phoneID}</Text>
            </View>

        <Item>
        <Text>Pending Requests</Text>
        </Item>
            <View>
            <Text>{this.state.loading}</Text>
            </View>
          <List>
            {
              this.state.list.map((l) => (
                <ListItem
                  key={l._id}
                  onPress={() => Alert.alert(
                      'Allow access?',
                      'User can view your location',
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'Yes', onPress: () => this.enable(l._id)},
                      ],
                      { cancelable: false }
                    )}
                >
                    <Text>{l.name}</Text>
                </ListItem>
              ))
            }
          </List>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddScreen)
