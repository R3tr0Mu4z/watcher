import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler
} from "react-native";
import { Permissions, Notifications } from 'expo';
import { Container, Header, Content, Item, Input, Button, Text, Left, Body, Right, Title, Subtitle, Icon, List, ListItem, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import { showMessage, hideMessage } from "react-native-flash-message";
const EXPO_UPDATE = 'https://host/requestupdate';
const PUSH_ENDPOINT = 'https://host/phones';
class PhonesScreen extends Component {


    getPhones() {
        showMessage({
            message: 'Loading Phones',
            type: "info",
        });
       fetch(PUSH_ENDPOINT, {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           ID: this.props.accountID,
           secretkey: "****************"
       })

     }).then(response => response.json())
     .then(json => {
       this.setState({phones: json})
         showMessage({
             message: 'Loading Complete',
             type: "info",
         });
     })

   }

   requestUpdate(id) {
       fetch(EXPO_UPDATE, {
           method: 'POST',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({
                   request: "REQUEST_UPDATE",
                   phoneID: id,
                   sphoneID: this.props.phoneID,
                   secretkey: "****************"

           })

       }).then(response => console.log(response))
   }



  componentWillMount() {
    this.getPhones();
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

    handleBackButton = () => {
        BackHandler.exitApp();
    };

    constructor() {
      super();
      this.state = {
        phones: [],
        map: null
      };
    }
    static navigationOptions = {
        header: null
    }

    gps(id) {
      this.props.navigation.navigate('Map', {
        mapphone: id,
      });
    }


    render() {
        this.state.phones.shift(0);
        return (
        <Container>

            <Header style={styles.headr}>
                <Left>
                    <Title>Phones</Title>
                </Left>

                <Right>
                    <Button transparent
                    onPress={() => this.getPhones()}>
                        <Icon name='refresh' />
                    </Button>
                </Right>
            </Header>
            <Content>
                <List>
            {

              this.state.phones.map((l) => (
                <ListItem

                  onPress={() => Alert.alert(
                      l.name,
                      l.user,
                      [
                        {text: 'Request location', onPress: () => this.requestUpdate(l.id)},
                        {text: 'View locations', onPress: () => this.gps(l.id)},
                      ],
                      { cancelable: false }
                    )}
                avatar>

                    <Body>
                    <Text>
                        {l.name}
                    </Text>
                    <Text note>
                        {l.user}
                    </Text>
                    </Body>
                    <Right>

                    </Right>
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
      map: state.map,
      accountID: state.accountID,
      phonename: state.phonename,
      phoneID: state.phoneID
    }
}

function mapDispatchToProps(dispatch) {
    return {
      mainphn: (phn) => dispatch({ type: 'MAP_PHONE', id: phn }),
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headr: {
        backgroundColor: '#000',
        paddingTop: 20
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PhonesScreen)