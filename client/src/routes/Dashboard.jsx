import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    this._renderRoomList = this._renderRoomList.bind(this);
  }

  componentWillMount() {
    this.props.fetchUser();
  }

  async _handleLogout(event) {
    await this.props.logout();

    this.props.history.replace('/');
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
              return <li className="list-group-item">{room}</li>;
            })}
          </ul>
        </div>
      );
    }
  }

  _handleCreateRoom(event) {
    event.preventDefault();

    if (this.props.auth) {
      this.props.createRoom(this.state.roomName, this.props.auth.id);
    }
  }

  _handleRoomNameChange(event) {
    this.setState({ roomName: event.target.value });
  }

  render() {
    console.log(this.props.auth);
    return (
      <div className="container" id="dashboard">
        <div className="row">
          <div className="col-sm-4 offset-sm-4">
            <h1 className="text-center">Dashboard</h1>
            {this._renderSampleText()}
            <button
              className="btn btn-primary btn-block"
              onClick={this._handleLogout}
              disabled={this.props.auth ? false : true}
            >
              Log out
            </button>
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
              <button
                className="btn btn-success btn-block"
                onClick={this._handleCreateRoom}
              >
                Create Room
              </button>
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

function mapStateToProps({ auth, room }) {
  return { auth, room };
}

export default connect(mapStateToProps, actions)(Dashboard);
