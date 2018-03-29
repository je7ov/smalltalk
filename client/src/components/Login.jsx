import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import * as actions from '../actions';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this._handleUsernameChange = this._handleUsernameChange.bind(this);
    this._handlePasswordChange = this._handlePasswordChange.bind(this);
    this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
    this._handleErrorClose = this._handleErrorClose.bind(this);
  }

  _handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  _handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  _handleLoginSubmit(event) {
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

    this.props.login(username, password);
  }

  _handleErrorClose(event) {
    event.preventDefault();

    this.props.clearAuth();
  }

  _renderError() {
    if (this.props.auth && this.props.auth.status !== 200) {
      console.log(this.props.auth);
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

  _renderSubmit() {
    if (this.props.auth && this.props.auth.isLoading) {
      return (
        <button type="submit" className="btn btn-block btn-outline-primary">
          <PulseLoader size={8} color={'#b5c8ff'} />
        </button>
      );
    } else {
      return (
        <button type="submit" className="btn btn-block btn-outline-primary">
          Submit
        </button>
      );
    }
  }

  render() {
    return (
      <div className="row" id="login-form">
        <div className="col-sm-12">
          <form id="login" onSubmit={this._handleLoginSubmit}>
            <h2 className="text-center">Login</h2>
            <br />
            <div className="form-group row">
              <label
                htmlFor="login-username"
                className="col-sm-3 col-form-label"
              >
                Username:
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  id="login-username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={this._handleUsernameChange}
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="login-password"
                className="col-sm-3 col-form-label"
              >
                Password:
              </label>
              <div className="col-sm-9">
                <input
                  type="password"
                  id="login-password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={this.state.pass}
                  onChange={this._handlePasswordChange}
                />
              </div>
            </div>

            {this._renderSubmit()}

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

export default connect(mapStateToProps, actions)(Login);
