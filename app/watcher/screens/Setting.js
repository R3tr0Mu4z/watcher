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
import { showMessage, hideMessage } from "react-native-flash-message";
const CHANGE_URL = 'http://192.168.0.106:5000/changepass';
import { connect } from 'react-redux';
class SettingScreen extends Component {



    async changePass() {
        fetch(CHANGE_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.accountID,
                current: this.state.current,
                password: this.state.password,
                secretkey: "gonnachangethislater"
            })

        }).then(response => response.json())
            .then(json => {
                showMessage({
                    message: json.mess,
                    type: "info",
                })
            })
    }
    componentWillMount() {
        console.log(this.props);
    }


    constructor() {
        super();
        this.state = {
            current: null,
            password: null
        };
    }
    static navigationOptions = {
        header: null
    }




    render() {

        return (

            <Container>
                <Header style={styles.headr}>
                    <Left>
                        <Title>Settings</Title>
                    </Left>
                    <Body>

                    </Body>
                    <Right />
                </Header>
                <Content style={styles.formarea}>
                    <View>
                        <Text>Change Password</Text>
                    </View>
                    <Item>
                        <Input
                            placeholder='Current Password'
                            onChangeText={(current) => this.setState({current})}/>
                    </Item>
                    <Item>
                        <Input
                            placeholder='New Password'
                            onChangeText={(password) => this.setState({password})}/>
                    </Item>

                    <View style={styles.Buttonstyle}>
                        <Button
                            onPress={() => this.changePass()}
                            dark>
                            <Text>Change</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)
