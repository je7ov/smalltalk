import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as actions from '../actions';
import Message from '../components/Message';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    const { room } = this.props.location.state;

    this.props.getMessages(room.id);
    this.state = {
      auth: null,
      room,
      input: '',
      socket: null,
      messages: [],
      stickyScroll: false
    };

    this.messageListRef = React.createRef();

    this._handleBack = this._handleBack.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSendMessage = this._handleSendMessage.bind(this);
    this._renderMessages = this._renderMessages.bind(this);
  }

  componentWillMount() {
    this.props.fetchUser();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.socket && nextProps.auth && nextProps.auth.id) {
      // const socket = io(window.location.origin);
      const socket = io('http://localhost:5000');

      /////////////////////
      // SOCKET.IO SETUP //
      /////////////////////
      socket.on('connect', () => {
        console.log('connected to server');

        socket.emit(
          'join',
          nextProps.auth.username,
          this.state.room.name,
          err => {
            if (err) {
              alert(err);
              //redirect if needed
            }
          }
        );
      });

      socket.on('disconnect', () => {
        console.log('disconnected from server');
      });

      socket.on('newMessage', message => {
        const messages = this.state.messages.slice();
        messages.push(message);
        this.setState({ messages: messages });
      });

      this.setState({ socket });
    }

    if (nextProps.room && nextProps.room.messages) {
      this.setState({ messages: nextProps.room.messages });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.stickyScroll && !nextState.stickyScroll) {
      return false;
    }

    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.messages.length !== this.state.messages.length) {
      const node = this.messageListRef.current;

      if (node.clientHeight + node.scrollTop === node.scrollHeight) {
        this.setState({ stickyScroll: true });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stickyScroll) {
      const node = this.messageListRef.current;

      node.scrollTop = node.scrollHeight - node.clientHeight;
      this.setState({ stickyScroll: false });
    }
  }

  _handleBack(event) {
    this.props.history.goBack();
  }

  _handleInputChange(event) {
    this.setState({ input: event.target.value });
  }

  _handleSendMessage(event) {
    event.preventDefault();

    this.state.socket.emit(
      'createMessage',
      this.state.input,
      this.state.room.id,
      () => {
        this.setState({ input: '' });
      }
    );
  }

  _renderMessages() {
    if (this.props.room && this.props.room.messages) {
      if (this.props.room.messages.length !== 0) {
        return (
          <ul className="list-group">
            {this.state.messages.map((message, i) => {
              message.timestamp = new Date(message.timestamp);
              return (
                <div className="message" key={i}>
                  {i > 0 ? <hr /> : null}
                  <Message message={message} />
                </div>
              );
            })}
          </ul>
        );
      } else {
        return (
          <div className="centered">
            <h3 className="text-muted">
              The chat is empty! Start the small talk!
            </h3>
          </div>
        );
      }
    } else {
      return (
        <div className="centered">
          <h2>Loading messages...</h2>
        </div>
      );
    }
  }

  _renderOld() {
    return (
      <div className="container-fluid">
        <br />
        <br />
        <div className="row">
          <div className="col-sm-12">
            <h2 className="text-center">
              This is the room "{this.state.room.name}"!
            </h2>
            <p className="text-center">room id: {this.state.room.id}</p>
            <h5 className="text-center warning">
              The chat rooms are still under construction
            </h5>
            <br />
            <br />
          </div>
          <div className="col-sm-12">
            <button className="btn btn-primary" onClick={this._handleBack}>
              &lt; Back
            </button>
          </div>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-sm-12">{this._renderMessages()}</div>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-12">
            <form>
              <div className="form-group row" id="message-input">
                <div className="col-lg-10 col-md-9 col-8">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.input}
                    onChange={this._handleInputChange}
                  />
                </div>
                <div className="col-lg-2 col-md-3 col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={this._handleSendMessage}
                  >
                    SEND
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  _renderNew() {
    if (this.props.room) console.log(this.props.room.messages);
    return (
      <div className="chat-page">
        <div className="chat-messages" ref={this.messageListRef}>
          {this._renderMessages()}
        </div>
        <div className="chat-input-form">
          <form>
            <div className="form-group row" id="message-input">
              <div className="col-lg-10 col-md-9 col-8">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.input}
                  onChange={this._handleInputChange}
                />
              </div>
              <div className="col-lg-2 col-md-3 col-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={this._handleSendMessage}
                >
                  SEND
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return this._renderNew();
  }
}

function mapStateToProps({ auth, room }) {
  return { auth, room };
}

export default connect(mapStateToProps, actions)(ChatRoom);
