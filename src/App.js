import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Message from './Message';
import uuidv1 from 'uuid/v1';

import openSocket from 'socket.io-client';
const socket = openSocket(`${window.location.protocol}//${window.location.host}`);

class App extends Component {
  state = {
    messages: [],
    message: ''
  };

  componentDidMount() {
    socket.on('connected', message => {
      console.log(message);
    });

    socket.on('ai reply', message => {
      console.log(message);
      const data = {
        id: uuidv1(),
        name: 'Bot',
        text: message
      };
      this.setState(prevState => ({
        messages: [...prevState.messages, data]
      }));
    });
  }

  sendMessage = e => {
    e.preventDefault();
    const data = {
      id: uuidv1(),
      name: 'Macke',
      text: this.state.message
    };

    socket.emit('chat message', data);

    this.setState(prevState => ({
      messages: [...prevState.messages, data],
      message: ''
    }));
  };

  render() {
    return (
      <div className="App">
        <div className="chat">
          {this.state.messages.map(m => (
            <Message key={m.id} {...m} />
          ))}
          <form className="chat-form" onSubmit={this.sendMessage}>
            <input
              onChange={e => {
                this.setState({ message: e.target.value });
              }}
              className="chat-input"
              value={this.state.message}
            />
            <button>Send</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
