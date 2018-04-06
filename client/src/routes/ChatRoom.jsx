import React, { Component } from 'react';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: this.props.location.state.room
    };

    this._handleBack = this._handleBack.bind(this);
  }

  _handleBack(event) {
    event.preventDefault();

    this.props.history.goBack();
  }

  render() {
    return (
      <div className="container">
        <br />
        <br />
        <div className="row">
          <div className="col-sm-12">
            <h2 className="text-center">
              This is the room "{this.state.room.name}"!
            </h2>
            <p className="text-center">room id: {this.state.room.id}</p>
            <h5 className="text-center">
              The chat rooms are still under construction
            </h5>
          </div>
          <div className="col-sm-12">
            <button className="btn btn-primary" onClick={this._handleBack}>
              &lt; Back
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
