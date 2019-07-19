import React, { Component } from "react";
import * as firebase from "firebase";
import { withRouter } from "react-router-dom";

import Constants from "./commons/Constants.js";
import Display from "./commons/Display";
import "./App.css";

class App extends Component {
  state = {
    displayOperation: Constants.APPLICATION.BLANK,
    operationTitle: Constants.APPLICATION_TITLE.BLANK,
    successfullyLoggedIn: false,
    displayLoading: false
  };

  async componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(Constants.FIRE_BASE_CONFIG);
    }
    this.initializeDisplay();
  }

  setDisplayLoading = flag => {
    this.setState({ displayLoading: flag });
  };

  setSuccessfullyLoggedIn = (flag, data) => {
    if (flag) {
      this.setState({
        successfullyLoggedIn: flag,
        displayOperation: Constants.APPLICATION.HOME_USERS,
        operationTitle: Constants.APPLICATION_TITLE.HOME
      });
      this.saveCredentialLocally(data);
      this.props.history.push("/admin/users/customers");
    }
  };

  initializeDisplay = () => {
    this.setState({ displayLoading: true });
    const username = localStorage.getItem(Constants.ADMIN_ACCOUNT_USERNAME);
    const password = localStorage.getItem(Constants.ADMIN_ACCOUNT_PASSWORD);
    if (password == undefined || username == undefined) {
      this.setState({
        displayLoading: false,
        displayOperation: Constants.APPLICATION.LOGIN_DASHBOARD,
        operationTitle: Constants.APPLICATION_TITLE.LOGIN_DASHBOARD
      });
      this.props.history.push("/login");
    } else {
      firebase
        .database()
        .ref("ADMIN_CRED")
        .once("value", snapshot => {
          if (snapshot.exists()) {
            const adminCredential = JSON.parse(JSON.stringify(snapshot.val()));
            if (
              adminCredential.username == username &&
              adminCredential.password == password &&
              typeof firebase.database() !== "undefined"
            ) {
              this.setState({
                successfullyLoggedIn: true,
                operationTitle: Constants.APPLICATION_TITLE.HOME,
                displayLoading: false
              });
              this.props.history.push("/admin/users/customers");
            } else {
              this.setState({
                displayLoading: false,
                displayOperation: Constants.APPLICATION.LOGIN_DASHBOARD,
                operationTitle: Constants.APPLICATION_TITLE.LOGIN_DASHBOARD
              });
              this.props.history.push("/login");
            }
          } else {
            this.setState({
              displayLoading: false,
              displayOperation: Constants.APPLICATION.LOGIN_DASHBOARD
            });
            this.props.history.push("/login");
          }
        });
    }
  };

  saveCredentialLocally = data => {
    localStorage.setItem(Constants.ADMIN_ACCOUNT_USERNAME, data.username);
    localStorage.setItem(Constants.ADMIN_ACCOUNT_PASSWORD, data.password);
  };

  logoutCredential = () => {
    this.setState({
      displayLoading: true,
      displayOperation: Constants.APPLICATION.LOGIN_DASHBOARD,
      successfullyLoggedIn: false
    });
    localStorage.removeItem(Constants.ADMIN_ACCOUNT_USERNAME);
    localStorage.removeItem(Constants.ADMIN_ACCOUNT_PASSWORD);
    setTimeout(() => {
      this.setState({
        displayLoading: false
      });
    }, 1500);
    this.props.history.push("/login");
  };

  render() {
    return (
      <div className="App">
        <Display {...this.state} {...this} firebase={firebase} />
        {this.state.displayLoading ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: "0%",
              left: "0%"
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                opacity: "0.5",
                position: "absolute",
                backgroundColor: "#000"
              }}
            />
            <img
              style={{
                height: "15%",
                width: "20%",
                position: "absolute",
                objectFit: "contain",
                opacity: "1.1",
                left: "40%",
                top: "67%"
              }}
              src={require("./img/loading.gif")}
            />
            <p
              style={{
                height: "5%",
                top: "80%",
                position: "absolute",
                textAlign: "center",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                width: "15%",
                left: "42.5%"
              }}
            >
              Loading...
            </p>
          </div>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

export default withRouter(App);
