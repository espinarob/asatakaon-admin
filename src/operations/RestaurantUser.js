import React, { Component, Fragment } from "react";

/* Custom imports */
import "./RestaurantUser.css";

export default class RestaurantUser extends Component {
  state = {
    deleteClicked: false
  };

  deleteAccount = () => {
    this.props.setDisplayLoading(true);
    this.props.doUseFirebaseObject
      .database()
      .ref("RESTAURANT/" + String(this.props.selectedRestaurant.key))
      .remove()
      .then(param => {
        this.props.setSelectedRestaurant({});
        this.props.setDisplayLoading(false);
        alert("Successfully Deleted Restaurant Account");
        this.props.history.push("/admin/users/restaurants");
      });
  };

  togglePlaceStatus = () => {
    const fstatus =
      this.props.selectedRestaurant.placeStatus === "ACCEPTED"
        ? "BLOCKED"
        : "ACCEPTED";
    this.props.doUseFirebaseObject
      .database()
      .ref("RESTAURANT/" + String(this.props.selectedRestaurant.key))
      .update({ placeStatus: String(fstatus) })
      .then(() => {
        alert("Success");
        this.props.history.push("/admin/users/restaurants");
      });
  };

  displayMenu = () => {
    const display = [];

    Object.keys(this.props.selectedRestaurant.Menu).forEach(menKey => {
      display.push(
        <div
          style={{
            marginBottom: "10px",
            borderBottom: "solid",
            borderWidth: "1px",
            paddingBottom: "5px"
          }}
          key={menKey.key}
        >
          <div className="restaurant_menu_name">
            {"Name: " + this.props.selectedRestaurant.Menu[menKey].name}
          </div>
          <div className="restaurant_menu_type">
            {"Type: " + this.props.selectedRestaurant.Menu[menKey].foodType}
          </div>
          <div className="restaurant_menu_price">
            {"Pricee: Php " + this.props.selectedRestaurant.Menu[menKey].price}
          </div>
          <div className="restaurant_menu_desc">
            {"Description: " +
              (this.props.selectedRestaurant.Menu[menKey].description.length <=
              0
                ? "No added description"
                : this.props.selectedRestaurant.Menu[menKey].description)}
          </div>
        </div>
      );
    });

    if (display.length === 0) return <Fragment />;
    return display;
  };

  render() {
    return (
      <div className="edit_restaurant_user_wrap">
        {typeof this.props.selectedRestaurant.username === "undefined" ? (
          <div className="edit_restaurant_empty_wrap">
            {"Sorry but no data of user to edit, please try again"}
          </div>
        ) : (
          <Fragment>
            <div className="edit_restaurant_menu_wrap">
              <div className="edit_restaurant_menu_label">
                {"Restaurant Menu"}
              </div>
              {this.props.selectedRestaurant.Menu ? (
                <div className="edit_restaurant_menu_all_wrap">
                  {this.displayMenu()}
                </div>
              ) : (
                <div className="edit_restaurant_menu_no">
                  {"The restaurant owner hasn't created any menu"}
                </div>
              )}
            </div>
            <div className="edit_restaurant_status_wrap">
              <div
                className="edit_restaurant_button"
                onClick={() => this.togglePlaceStatus()}
              >
                {this.props.selectedRestaurant.placeStatus === "ACCEPTED"
                  ? "Block (Currently unblocked)"
                  : "Unblocked (Currently blocked)"}
              </div>
            </div>
            <div className="edit_restaurant_delete_wrap">
              <div
                className="edit_restaurant_delete_button"
                onClick={() => this.setState({ deleteClicked: true })}
              >
                {"Delete Restaurant Account"}
              </div>
            </div>
            {this.state.deleteClicked ? (
              <div className="edit_restaurant_verify_wrap">
                <div
                  className="edit_restaurant_verify_confirm"
                  onClick={this.deleteAccount}
                >
                  {"Confirm"}
                </div>
                <div
                  className="edit_restaurant_verify_cancel"
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
