import React, { Component, Fragment } from "react";
import { NavLink, Route, Switch } from "react-router-dom";

import ErrorContent from "./ErrorContent.js";
import LoginDashboard from "../login/LoginDashboard.js";
import UsersSection from "../operations/UsersSection.js";
import UsersMessages from "../operations/UsersMessages";

import "../App.css";

export default class Display extends Component {
  state = {
    firebaseObject: null,
    msgFirebaseObject: null,
    hasNew: false,
    allNotifs: [],
    allMessages: [],
    hasNewMsg: false
  };

  componentDidMount() {
    this.listenToNotifications();
    this.listenToMessages();
  }

  componentWillMount() {
    if (this.state.firebase !== null)
      this.props.firebase
        .database()
        .ref("ADMIN_NOTIFS")
        .off("value", this.state.firebaseObject);
    if (this.state.msgFirebaseObject !== null)
      this.props.firebase
        .database()
        .ref("ADMIN_MESSAGES")
        .off("value", this.state.msgFirebaseObject);
  }

  setHasNewMessage = flag => {
    this.setState({ hasNewMsg: flag });
  };

  listenToNotifications = () => {
    const firebaseObject = this.props.firebase
      .database()
      .ref("ADMIN_NOTIFS")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const allNotifsWithKey = JSON.parse(JSON.stringify(snapshot.val()));
          const initAllNotifs = [];
          Object.keys(allNotifsWithKey).forEach(notifkey => {
            initAllNotifs.push(allNotifsWithKey[notifkey]);
          });
          this.setState({ allNotifs: initAllNotifs });
          this.determineNewNotifs();
        } else console.log("Empty notifs");
      });
    this.setState({ firebaseObject });
  };

  listenToMessages = () => {
    const msgFirebaseObject = this.props.firebase
      .database()
      .ref("ADMIN_MESSAGES")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const allMsgWithKey = JSON.parse(JSON.stringify(snapshot.val()));
          const initAllMessages = [];
          Object.keys(allMsgWithKey).forEach(msgkey => {
            initAllMessages.push(allMsgWithKey[msgkey]);
          });
          this.setState({ allMessages: initAllMessages });
          this.determineNewMessages();
        } else console.log("Empty messages");
      });
  };

  determineNewNotifs = () => {
    this.state.allNotifs.map(notif => {
      if (notif.status === "new") {
        this.setState({ hasNew: true });
      }
    });
  };

  determineNewMessages = () => {
    this.state.allMessages.map(msg => {
      if (msg.status === "new") {
        this.setState({ hasNewMsg: true });
      }
    });
  };

  setNotifToOld = () => {
    const allNotifsKey = this.state.allNotifs;
    allNotifsKey.map(notif => {
      this.props.firebase
        .database()
        .ref("ADMIN_NOTIFS/" + String(notif.key))
        .update({ status: "old" });
    });
    this.setState({ hasNew: false });
  };

  displayLoggedInFeatures = () => {
    if (this.props.successfullyLoggedIn) {
      return (
        <React.Fragment>
          <NavLink
            style={{
              height: "70%",
              width: "120px",
              fontSize: "14px",
              fontWeight: "bold",
              left: "30px",
              paddingTop: "10px",
              position: "relative",
              textAlign: "center",
              display: "inline-block",
              color: "#fff",
              cursor: "pointer",
              outline: "none"
            }}
            to="/admin/users/customers"
          >
            <p style={{ display: "inline-block" }}>{"Users"}</p>
          </NavLink>
          <NavLink
            style={{
              height: "70%",
              width: "120px",
              fontSize: "14px",
              fontWeight: "bold",
              left: "30px",
              paddingTop: "10px",
              position: "relative",
              textAlign: "center",
              display: "inline-block",
              color: this.state.hasNewMsg ? "red" : "white",
              cursor: "pointer"
            }}
            to="/admin/messages"
          >
            <Fragment>
              <p style={{ display: "inline-block" }}>{"Messages"}</p>
              {this.state.hasNewMsg ? (
                <p style={{ fontSize: "10px", display: "inline-block" }}>
                  {"New"}
                </p>
              ) : null}
            </Fragment>
          </NavLink>
          <NavLink
            style={{
              height: "70%",
              width: "120px",
              fontSize: "14px",
              fontWeight: "bold",
              left: "30px",
              paddingTop: "10px",
              position: "relative",
              textAlign: "center",
              display: "inline-block",
              color: "#fff",
              cursor: "pointer",
              color: this.state.hasNew ? "red" : "white"
            }}
            to="/admin/notifications"
            onClick={() => this.setNotifToOld()}
          >
            <Fragment>
              <p style={{ display: "inline-block" }}>{"Notifications"}</p>
              {this.state.hasNew ? (
                <p style={{ fontSize: "10px", display: "inline-block" }}>
                  {"New"}
                </p>
              ) : null}
            </Fragment>
          </NavLink>
          <NavLink
            style={{
              height: "70%",
              width: "12%",
              fontSize: "14px",
              fontWeight: "bold",
              paddingTop: "10px",
              position: "absolute",
              textAlign: "center",
              display: "inline-block",
              color: "#fff",
              left: "89%"
            }}
            to="/login"
            onClick={() => this.props.logoutCredential()}
          >
            <p style={{ display: "inline-block" }}>{"Logout"}</p>
          </NavLink>
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <Fragment>
        <div id="ApplicationHeader">
          <p
            style={{
              height: "70%",
              width: "150px",
              fontSize: "14px",
              fontWeight: "bold",
              left: "15px",
              paddingTop: "10px",
              position: "relative",
              textAlign: "center",
              display: "inline-block",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {"Asa-Ta-Kaon Admin"}
          </p>
          <p
            style={{
              height: "70%",
              width: "150px",
              fontSize: "14px",
              fontWeight: "bold",
              left: "20px",
              paddingTop: "10px",
              position: "relative",
              textAlign: "center",
              display: "inline-block",
              color: "#fff"
            }}
          >
            {this.props.operationTitle}
          </p>
          {this.displayLoggedInFeatures()}
        </div>
        <div id="ApplicationContent">
          <Switch>
            <Route path="/" exact render={props => <Fragment />} />
            <Route
              exact
              path="/login"
              render={props => (
                <LoginDashboard
                  setSuccessfullyLoggedIn={this.props.setSuccessfullyLoggedIn}
                  doUseFirebaseObject={this.props.firebase}
                  {...this.props}
                />
              )}
            />
            <Route
              exact
              path="/admin/messages"
              render={props => (
                <UsersMessages
                  setDisplayLoading={this.props.setDisplayLoading}
                  doUseFirebaseObject={this.props.firebase}
                  setHasNewMessage={this.setHasNewMessage}
                />
              )}
            />
            <Route
              path="/admin/users"
              render={props => (
                <UsersSection
                  {...props}
                  setDisplayLoading={this.props.setDisplayLoading}
                  doUseFirebaseObject={this.props.firebase}
                />
              )}
            />
            <Route
              path="/admin/notifications"
              render={props => {
                if (this.state.hasNew) {
                  return (
                    <div
                      style={{
                        position: "absolute",
                        top: "200px",
                        width: "50%",
                        left: "25%",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}
                    >
                      {
                        "There are new registered restaurant owners, see more at Users/Restaurants list"
                      }
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        position: "absolute",
                        top: "200px",
                        width: "50%",
                        left: "25%",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}
                    >
                      {"No new registered restaurant owner"}
                    </div>
                  );
                }
              }}
            />
            <Route exact component={ErrorContent} />
          </Switch>
        </div>
      </Fragment>
    );
  }
}
