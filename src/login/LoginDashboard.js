import React, { Component } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";

import Constants from "../commons/Constants.js";

import "./LoginDashboard.css";

class LoginDashboard extends Component {
  state = {
    loginMessageError: "",
    usernameInput: "",
    passwordInput: ""
  };

  usernameInputChange = event => {
    this.setState({ usernameInput: event.target.value });
  };

  passwordInputChange = event => {
    this.setState({ passwordInput: event.target.value });
  };

  submitLoginInput = () => {
    if (this.state.usernameInput.length == 0) {
      this.setState({ loginMessageError: "Please input a valid username" });
    } else if (this.state.passwordInput.length == 0) {
      this.setState({ loginMessageError: "Please input a valid password" });
    } else {
      this.props.setDisplayLoading(true);
      const data = {
        username: this.state.usernameInput,
        password: this.state.passwordInput
      };
      this.setState({ loginMessageError: "Submitting, please wait.." });
      this.props.doUseFirebaseObject
        .database()
        .ref("ADMIN_CRED/")
        .once("value", snapshot => {
          if (snapshot.exists()) {
            const currentAdminValid = JSON.parse(
              JSON.stringify(snapshot.val())
            );
            if (
              String(this.state.usernameInput) !=
                String(currentAdminValid.username) ||
              String(this.state.passwordInput) !=
                String(currentAdminValid.password)
            ) {
              setTimeout(() => {
                this.props.setDisplayLoading(false);
              }, Constants.LOG_DISPLAY_TIME);
              this.setState({
                loginMessageError: "Username or password input is incorrect"
              });
            } else {
              setTimeout(() => {
                this.props.setDisplayLoading(false);
              }, Constants.LOG_DISPLAY_TIME);
              this.setState({ loginMessageError: "Successfully logged in" });
              this.props.setSuccessfullyLoggedIn(true, data);
            }
          }
        })
        .catch(error => {
          this.setState({
            loginMessageError: "Error in connecting to the server"
          });
        });
    }
  };

  render() {
    return (
      <div id="LoginDashboardWrapper">
        <div id="LoginDisplayContent">
          <p
            style={{
              width: "100%",
              height: "5%",
              paddingTop: "5px",
              fontWeight: "bold",
              position: "relative",
              textAlign: "center",
              fontSize: "15px",
              color: "#000",
              top: "2%"
            }}
          >
            Admin Login Page
          </p>
          <img
            style={{
              height: "45%",
              width: "30%",
              position: "absolute",
              top: "-3%",
              left: "35%",
              objectFit: "contain"
            }}
            src={require("../img/logo.png")}
          />
          <div
            style={{
              height: "10%",
              position: "relative",
              top: "32%",
              width: "100%"
            }}
          >
            <p
              style={{
                height: "67%",
                position: "relative",
                display: "inline-block",
                width: "18%",
                fontSize: "15px",
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: "11px",
                left: "13%"
              }}
            >
              {"Username "}
            </p>
            <p
              style={{
                height: "60%",
                position: "relative",
                display: "inline-block",
                width: "4.5%",
                fontSize: "15px",
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: "15px",
                left: "13%"
              }}
            >
              <FaUserAlt />
            </p>
            <input
              onChange={this.usernameInputChange}
              type="text"
              placeholder="input username"
              style={{
                display: "inline-block",
                paddingLeft: "2%",
                position: "relative",
                left: "15%",
                height: "70%",
                top: "5%",
                outline: "none",
                backgroundColor: "rgba(0, 0, 0, 0)",
                border: "solid",
                borderRadius: "15px"
              }}
            />
          </div>
          <div
            style={{
              height: "10%",
              position: "relative",
              top: "35%",
              width: "100%"
            }}
          >
            <p
              style={{
                height: "67%",
                position: "relative",
                display: "inline-block",
                width: "18%",
                fontSize: "15px",
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: "11px",
                left: "13%"
              }}
            >
              {"Password "}
            </p>
            <p
              style={{
                height: "60%",
                position: "relative",
                display: "inline-block",
                width: "4.5%",
                fontSize: "15px",
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: "15px",
                left: "13%"
              }}
            >
              <FaLock />
            </p>
            <input
              onChange={this.passwordInputChange}
              type="password"
              placeholder="**********"
              style={{
                display: "inline-block",
                paddingLeft: "2%",
                position: "relative",
                left: "15%",
                height: "70%",
                top: "5%",
                outline: "none",
                backgroundColor: "rgba(0, 0, 0, 0)",
                border: "solid",
                borderRadius: "15px"
              }}
            />
          </div>
          <p
            style={{
              height: "8.5%",
              width: "50%",
              position: "relative",
              top: "35%",
              left: "30%",
              textAlign: "center",
              fontSize: "14px"
            }}
          >
            {this.state.loginMessageError}
          </p>

          <p
            id="LoginSubmitButton"
            onClick={this.submitLoginInput}
            style={{
              height: "6%",
              width: "30%",
              position: "relative",
              top: "35%",
              textAlign: "center",
              fontSize: "14px",
              paddingTop: "7px",
              fontWeight: "bold",
              left: "35%",
              cursor: "pointer"
            }}
          >
            Login
          </p>
        </div>
      </div>
    );
  }
}

export default LoginDashboard;
