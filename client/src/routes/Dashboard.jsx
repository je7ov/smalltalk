import React, { Component } from 'react';
import { connect } from 'react-redux';

import SpinnerButton from '../components/SpinnerButton';
import * as actions from '../actions';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomName: ''
    };

    this._handleLogout = this._handleLogout.bind(this);
    this._handleRoomNameChange = this._handleRoomNameChange.bind(this);
    this._handleCreateRoom = this._handleCreateRoom.bind(this);
    this._handleDeleteRoom = this._handleDeleteRoom.bind(this);
    this._renderRoomList = this._renderRoomList.bind(this);
    this._renderCreateButton = this._renderCreateButton.bind(this);
  }

  componentWillMount() {
    this.props.fetchUser();
  }

  async _handleLogout(event) {
    await this.props.logout();

    this.props.history.replace('/');
  }

  _handleCreateRoom(event) {
    event.preventDefault();

    this.props.createRoom(this.state.roomName);
    this.setState({ roomName: '' });
  }

  _handleRoomNameChange(event) {
    this.setState({ roomName: event.target.value });
  }

  _handleDeleteRoom(event) {
    event.preventDefault();

    // add better confirmation
    if (
      window.confirm(
        `Are you sure you want to delete room '${event.target.id}'?`
      )
    ) {
      // delete room here
      this.props.deleteRoom(event.target.id);
      this.forceUpdate();
    }
  }

  _renderSampleText() {
    if (this.props.auth) {
      return (
        <h4 className="text-center">
          Logged in as {this.props.auth && this.props.auth.username}
        </h4>
      );
    } else {
      return <h4 className="text-center">Loading...</h4>;
    }
  }

  _renderRoomList() {
    if (this.props.auth && this.props.auth.roomsOwned) {
      if (this.props.auth.roomsOwned.length === 0) {
        return (
          <h5 className="text-center">
            No rooms made. Make a new room or join a friend's!
          </h5>
        );
      }

      return (
        <div>
          <h5>Rooms:</h5>
          <ul className="list-group">
            {this.props.auth.roomsOwned.map(room => {
              return (
                <li className="list-group-item" key={room}>
                  {room}
                  <button
                    className="close"
                    id={room}
                    onClick={this._handleDeleteRoom}
                  >
                    &times;
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

  _renderCreateButton() {
    return (
      <SpinnerButton
        loading={this.props.room && this.props.room.isLoading}
        spinnerColor="b5c8ff"
        block
        green
        onClick={this._handleCreateRoom}
      >
        Create Room
      </SpinnerButton>
    );
  }

  render() {
    return (
      <div className="container" id="dashboard">
        <div className="row">
          <div className="col-sm-4 offset-sm-4">
            <h1 className="text-center">Dashboard</h1>
            {this._renderSampleText()}
            <SpinnerButton
              loading={this.props.auth && this.props.auth.isLoading}
              block
              blue
              spinnerColor="b5c8ff"
              onClick={this._handleLogout}
            >
              Log out
            </SpinnerButton>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <form>
              <h2 className="text-center">Chat Rooms</h2>
              <br />
              <div className="form-group">
                <label htmlFor="room-name">Room Name:</label>
                <input
                  type="text"
                  id="room-name"
                  className="form-control"
                  placeholder="Enter a name for your new room"
                  value={this.state.roomName}
                  onChange={this._handleRoomNameChange}
                />
              </div>
              {this._renderCreateButton()}
            </form>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-6 offset-sm-3">{this._renderRoomList()}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth, room, load }) {
  return { auth, room, load };
}

export default connect(mapStateToProps, actions)(Dashboard);
