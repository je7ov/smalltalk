import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import Signup from '../components/Signup';
import Login from '../components/Login';

class SignupLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: true
    };

    this._handleFormToggle = this._handleFormToggle.bind(this);
  }

  _handleFormToggle() {
    this.setState({ login: !this.state.login });
    this.props.clearAuth();
  }

  _renderForm() {
    if (this.state.login) {
      return (
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <Login />
            <button
              className="btn btn-block btn-light text-wrap"
              onClick={this._handleFormToggle}
            >
              Don't have an account? Sign up!
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <Signup />
            <button
              className="btn btn-block btn-light text-wrap"
              onClick={this._handleFormToggle}
            >
              Have an account? Log in!
            </button>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="container">{this._renderForm()}</div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(SignupLogin);
