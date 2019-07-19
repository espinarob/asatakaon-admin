import React, { Component, Fragment } from "react";

/* Custom imports */
import "./CustomerUser.css";
import { throws } from "assert";

export default class CustomerUser extends Component {
  state = {
    deleteClicked: false
  };

  deleteAccount = () => {
    this.props.setDisplayLoading(true);
    this.props.doUseFirebaseObject
      .database()
      .ref("USERS/" + String(this.props.selectedCustomer.accountID))
      .remove()
      .then(param => {
        this.props.setSelectedCustomer({});
        this.props.setDisplayLoading(false);
        alert("Successfully Deleted Customer Account");
        this.props.history.push("/admin/users/customers");
      });
  };

  render() {
    return (
      <div className="edit_customer_user_wrap">
        {typeof this.props.selectedCustomer.username === "undefined" ? (
          <div className="edit_customer_empty_wrap">
            {"Sorry but no data of user to edit, please try again"}
          </div>
        ) : (
          <Fragment>
            <div className="edit_customer_delete_wrap">
              <div
                className="edit_customer_delete_button"
                onClick={() => this.setState({ deleteClicked: true })}
              >
                {"Delete Customer Account"}
              </div>
            </div>
            {this.state.deleteClicked ? (
              <div className="edit_customer_verify_wrap">
                <div
                  className="edit_customer_verify_confirm"
                  onClick={this.deleteAccount}
                >
                  {"Confirm"}
                </div>
                <div
                  className="edit_customer_verify_cancel"
                  onClick={() => this.setState({ deleteClicked: false })}
                >
                  {"Cancel"}
                </div>
              </div>
            ) : null}
          </Fragment>
        )}
      </div>
    );
  }
}
