import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Security, ImplicitCallback } from "@okta/okta-react";
import Home from "./Home";
import Users from "./Users";

const config = {
  issuer: "https://dev-464496.okta.com/oauth2/default",
  redirect_uri: window.location.origin + "/implicit/callback",
  client_id: process.env.REACT_APP_NOT_SECRET_CODE
};

class App extends Component {
  render() {
    return (
      <Router>
        <Security
          issuer={config.issuer}
          client_id={config.client_id}
          redirect_uri={config.redirect_uri}
        >
          <Route component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/implicit/callback" component={ImplicitCallback} />
        </Security>
      </Router>
    );
  }
}

export default App;
