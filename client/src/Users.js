import fetch from "isomorphic-fetch";
import React, { Component } from "react";
import { withAuth } from "@okta/okta-react";

export default withAuth(
  class MessageList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        users: null
      };
    }

    async componentDidMount() {
      try {
        const response = await fetch("http://localhost:3001/api/users", {
          headers: {
            Authorization: "Bearer " + (await this.props.auth.getAccessToken())
          }
        });
        const users = await response.json();
        this.setState({ users });
      } catch (err) {
        // handle error as needed
        this.props.history.push("/");
      }
    }

    render() {
      if (!this.state.users) return <div>Loading..</div>;
      const items = this.state.users.map(user => (
        <li key={user.id}>{user.email}</li>
      ));
      return <ul>{items}</ul>;
    }
  }
);
