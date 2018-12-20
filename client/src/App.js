import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
const endpoint = 'http://localhost:5000';
const socket = socketIOClient(endpoint)

class App extends Component {
  constructor() {
    super();
    this.state = {
      color: 'white'
    };
  }

  // sending sockets
  send = () => {
    var body = {};
    body.asd = "asd";
    body.def = "def";
    socket.emit('yo', body) // change 'red' to this.state.color
  }

  setColor = (color) => {
    this.setState({ color })
  }
  render() {
    socket.on('yo', (col) => {
      console.log(col);
    })
    return (
      <div style={{ textAlign: "center" }}>
              <button onClick={() => this.send() }>Change Color</button>
              <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
              <button id="red" onClick={() => this.setColor('red')}>Red</button>
      </div>
    );
  }
}

export default App;
