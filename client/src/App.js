import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

import * as actions from './actions';
import './App.css';
import Auth from './modules/Auth';

import SignupLogin from './routes/SignupLogin';
import Dashboard from './routes/Dashboard';

class App extends Component {
  render() {
    // Auth.deauthenticateUser();
    return (
      <div className="App">
        <Route
          exact
          path="/"
          render={props => {
            if (Auth.isUserAuthenticated()) {
              return <Redirect to="/dashboard" />;
            } else {
              return <SignupLogin {...props} />;
            }
          }}
        />
        <Route path="/dashboard" component={Dashboard} />
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default withRouter(connect(mapStateToProps, actions)(App));
