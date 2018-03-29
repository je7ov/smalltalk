import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this._handleLogout = this._handleLogout.bind(this);
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

  render() {
    return (
      <div className="container" id="dashboard">
        <div className="row">
          <div className="col-sm-4 offset-sm-4">
            <h1 className="text-center">Dashboard</h1>
            {this._renderSampleText()}
            <button
              className="btn btn-primary btn-block"
              onClick={this._handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Dashboard);
