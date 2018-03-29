import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this._handleUsernameChange = this._handleUsernameChange.bind(this);
    this._handlePasswordChange = this._handlePasswordChange.bind(this);
    this._handleSignupSubmit = this._handleSignupSubmit.bind(this);
    this._handleErrorClose = this._handleErrorClose.bind(this);
  }

  _handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  _handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  _handleSignupSubmit(event) {
    event.preventDefault();

    if (
      this.state.username.trim() === '' ||
      this.state.password.trim() === ''
    ) {
      this.props.authError({
        status: 418,
        data: {
          success: false,
          message: 'All fields required.'
        }
      });
      return;
    }

    const username = encodeURIComponent(this.state.username);
    const password = encodeURIComponent(this.state.password);

    this.props.signup(username, password);
  }

  _handleErrorClose(event) {
    event.preventDefault();

    this.props.clearAuth();
  }

  _renderError() {
    if (this.props.auth && this.props.auth.status !== 200) {
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error:</strong> {this.props.auth.data.message}
          <button className="close" onClick={this._handleErrorClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="row" id="signup-form">
        <div className="col-sm-12">
          <form id="signup" onSubmit={this._handleSignupSubmit}>
            <h2 className="text-center">Sign up</h2>
            <br />
            <div className="form-group row">
              <label
                htmlFor="signup-username"
                className="col-sm-3 col-form-label"
              >
                Username:
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  id="signup-username"
                  className="form-control"
                  placeholder="Enter a username"
                  value={this.state.username}
                  onChange={this._handleUsernameChange}
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="signup-password"
                className="col-sm-3 col-form-label"
              >
                Password:
              </label>
              <div className="col-sm-9">
                <input
                  type="password"
                  id="signup-password"
                  className="form-control"
                  placeholder="Enter a password"
                  value={this.state.pass}
                  onChange={this._handlePasswordChange}
                />
              </div>
            </div>
            <input
              type="submit"
              className="btn btn-block btn-outline-primary"
            />

            {this._renderError()}
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Signup);
