import React, { Component } from "react";

import LoginForm from "../components/forms/loginForm.component";

import "../styles/pages/login.page.scss";

export default class Login extends Component {
  render() {
    return (
      <>
        <LoginForm onSuccess={this.props.onSuccess} />
      </>
    );
  }
}
