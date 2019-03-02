import React, { Component } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    BackHandler, Keyboard
} from "react-native";
import { Permissions, Notifications } from 'expo';
import {
    Container,
    Header,
    Content,
    Item,
    Input,
    Button,
    Text,
    Left,
    Body,
    Right,
    Title,
    Subtitle,
    List,
    ListItem,
    Thumbnail,
    Icon
} from 'native-base';
import { connect } from 'react-redux';
import {showMessage} from "react-native-flash-message";
const PUSH_ENDPOINT = 'https://host/push';
const REQUEST_ENDPOINT = 'https://host/access';
const REQUEST_ACCESS_URL = 'https://host/requestaccess';
const REQUESTED_PHONES_URL = 'https://host/requested-phones';
const ENABLE_ENDPOINT = 'https://host/enable';
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
      Keyboard.dismiss()
      fetch(REQUEST_ACCESS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          phoneID: this.state.req,
          accountID : this.props.accountID,
          secretkey: "****************"
      })

    }).then(response => response.json())
    .then(json => {
        this.setState({req: json.stat})
        showMessage({
            message: json.stat,
            type: "info",
        })
    })
    }

    async requestedPhones() {
      this.setState({loading: 'Loading requests'})
        showMessage({
            message: this.state.loading,
            type: "info",
        })
      fetch(REQUESTED_PHONES_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          accountID : this.props.accountID,
          secretkey: "****************"
      })

    }).then(response => response.json())
    .then(json => {
      this.setState({list : json})
      this.setState({loading: 'Loading complete'})
        showMessage({
            message: this.state.loading,
            type: "info",
        })
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
        secretkey: "****************"
      })

    }).then(response => response.json())
    .then(json => {
      this.state.list = null;
      this.requestedPhones()
    })
    }

    componentWillMount() {
      this.requestedPhones();
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        BackHandler.exitApp();
    };
    render() {

        return (
            <Container>
                <Header style={styles.headr}>
                    <Left>
                        <Title>Request</Title>
                    </Left>

                    <Right>
                        <Button transparent
                                onPress={() => this.requestedPhones()}>
                            <Icon name='refresh' />
                        </Button>
                    </Right>
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
            </View>
            <View>
                <Text>Your Phone ID : {this.props.phoneID}</Text>
            </View>

        <Item>
        <Text style={{paddingTop: 20}}>Pending Requests</Text>
        </Item>
            <View>
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
        paddingTop: 10,
        paddingBottom: 20
    },
    formarea: {
        paddingTop: 10
    },
    headr: {
        backgroundColor: '#000',
        paddingTop: 20
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddScreen)
