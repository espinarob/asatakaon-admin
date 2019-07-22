import React, { Component } from "react";

import Constants from "../commons/Constants.js";
import "./UsersMessages.css";

export default class UsersSection extends Component {
  state = {
    allMessages: [],
    loadingMessages: true,
    firebaseMessagesID: null
  };

  async componentWillMount() {
    await this.getAllReceivedMessages();
  }

  reverseMessages = msg => {
    const results = [];
    if (msg.length === 0) return [];
    for (let index = msg.length - 1; index >= 0; index--) {
      results.push(msg[index]);
    }
    return results;
  };

  getAllReceivedMessages = async () => {
    const { doUseFirebaseObject } = this.props;
    const firebaseMessagesID = await doUseFirebaseObject
      .database()
      .ref("ADMIN_MESSAGES")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const cloudReceievedMessage = JSON.parse(
            JSON.stringify(snapshot.val())
          );
          let initAllMessages = [];
          Object.keys(cloudReceievedMessage).forEach(msg => {
            initAllMessages.push(cloudReceievedMessage[msg]);
          });
          initAllMessages = this.reverseMessages(initAllMessages);
          this.setState({
            allMessages: initAllMessages,
            loadingMessages: false
          });
        }
      });
    this.setState({ firebaseMessagesID });
  };

  componentWillUnmount() {
    const { doUseFirebaseObject } = this.props;
    doUseFirebaseObject
      .database()
      .ref("ADMIN_MESSAGES")
      .off("value", this.state.firebaseMessagesID);
  }

  markRead = msg => {
    this.props.doUseFirebaseObject
      .database()
      .ref("ADMIN_MESSAGES/" + String(msg.key))
      .update({ status: "old" });
  };

  markUnread = msg => {
    this.props.doUseFirebaseObject
      .database()
      .ref("ADMIN_MESSAGES/" + String(msg.key))
      .update({ status: "new" });
  };

  displayAllMessages = () => {
    if (
      this.state.loadingMessages === false &&
      this.state.allMessages.length === 0
    ) {
      return (
        <p
          style={{
            height: "45px",
            width: "50%",
            left: "25%",
            top: "250px",
            position: "relative",
            fontSize: "15px",
            paddingTop: "10px",
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          {"Sorry, no received messages so far"}
        </p>
      );
    } else {
      return this.state.allMessages.map(msg => {
        return (
          <div
            style={{
              width: "90%",
              position: "relative",
              marginTop: "10px",
              marginBottom: "10px",
              border: "solid",
              left: "5%",
              borderWidth: "0.1px",
              paddingTop: "10px",
              paddingBottom: "10px",
              borderColor: msg.status === "new" ? "red" : "black"
            }}
            key={msg.key}
          >
            <p
              style={{
                height: "25x",
                position: "relative",
                width: "90%",
                margin: "0 auto",
                fontSize: "13px",
                textAlign: "center"
              }}
            >
              {"Sender: " + msg.sender}
            </p>
            <p
              style={{
                height: "25x",
                position: "relative",
                width: "90%",
                margin: "0 auto",
                fontSize: "13px",
                textAlign: "center"
              }}
            >
              {"Email: " + msg.email}
            </p>
            <p
              style={{
                height: "25x",
                position: "relative",
                width: "90%",
                margin: "0 auto",
                fontSize: "13px",
                textAlign: "center"
              }}
            >
              {"key: " + msg.key}
            </p>
            <p
              style={{
                height: "25x",
                position: "relative",
                width: "90%",
                margin: "0 auto",
                fontSize: "13px",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {"Subject: " + msg.subject}
            </p>
            <p
              style={{
                height: "40px",
                position: "relative",
                margin: "0 auto",
                fontSize: "13px",
                textAlign: "center"
              }}
            >
              {"Message: " + msg.message}
            </p>
            {msg.status === "new" ? (
              <p
                style={{
                  height: "25x",
                  position: "relative",
                  width: "90%",
                  margin: "0 auto",
                  fontSize: "13px",
                  textAlign: "center",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginBottom: "10px",
                  color: "red"
                }}
                onClick={() => this.markRead(msg)}
              >
                {"Mark Read"}
              </p>
            ) : (
              <p
                style={{
                  height: "25x",
                  position: "relative",
                  width: "90%",
                  margin: "0 auto",
                  fontSize: "13px",
                  textAlign: "center",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginBottom: "10px",
                  color: "black"
                }}
                onClick={() => this.markUnread(msg)}
              >
                {"Mark Unread"}
              </p>
            )}
          </div>
        );
      });
    }
  };
  render() {
    return <div id="UsersMessagesWrapper">{this.displayAllMessages()}</div>;
  }
}
