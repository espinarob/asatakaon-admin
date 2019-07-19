import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Constants from "../commons/Constants.js";
import "./UsersSection.css";
import Customer from "./Customer";
import CustomerUser from "./CustomerUser";
import Restaurant from "./Restaurant";
import RestaurantUser from "./RestaurantUser";

class UsersSection extends Component {
  state = {
    userSectionData: Constants.USERS_OPERATION.CUSTOMERS,
    selectedCustomer: {},
    selectedRestaurant: {}
  };

  async componentWillMount() {
    this.props.history.push("/admin/users/customers");
  }

  handleCustomersClicked = () => {
    this.setState({ userSectionData: Constants.USERS_OPERATION.CUSTOMERS });
    this.props.history.push("/admin/users/customers");
  };

  handleRestaurantsClicked = () => {
    this.setState({ userSectionData: Constants.USERS_OPERATION.RESTAURANTS });
    this.props.history.push("/admin/users/restaurants");
  };

  setSelectedCustomer = customer => {
    this.setState({ selectedCustomer: customer });
  };

  setSelectedRestaurant = res => {
    this.setState({ selectedRestaurant: res });
  };

  render() {
    return (
      <div id="UsersSectionWrapper">
        <div
          style={{
            height: "35px",
            width: "100%",
            position: "relative",
            top: "15px"
          }}
        >
          <p
            onClick={this.handleCustomersClicked}
            style={{
              height: "80%",
              width: "120px",
              position: "relative",
              display: "inline-block",
              fontSize: "15px",
              left: "20px",
              paddingTop: "5px",
              textAlign: "center",
              fontWeight: "bold",
              cursor: "pointer",
              borderBottom:
                this.state.userSectionData ==
                Constants.USERS_OPERATION.CUSTOMERS
                  ? "solid"
                  : ""
            }}
          >
            CUSTOMERS
          </p>
          <p
            onClick={this.handleRestaurantsClicked}
            style={{
              height: "80%",
              width: "120px",
              position: "relative",
              display: "inline-block",
              fontSize: "15px",
              left: "25px",
              paddingTop: "5px",
              textAlign: "center",
              fontWeight: "bold",
              cursor: "pointer",
              borderBottom:
                this.state.userSectionData ==
                Constants.USERS_OPERATION.RESTAURANTS
                  ? "solid"
                  : ""
            }}
          >
            RESTAURANTS
          </p>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            top: "15px",
            paddingTop: "20px"
          }}
        >
          <Switch>
            <Route
              exact
              path="/admin/users/customers"
              render={props => (
                <Customer
                  {...props}
                  {...this.props}
                  setSelectedCustomer={this.setSelectedCustomer}
                />
              )}
            />
            <Route
              exact
              path="/admin/users/customers/customer/edit"
              render={props => (
                <CustomerUser
                  {...props}
                  {...this.state}
                  {...this.props}
                  setSelectedCustomer={this.setSelectedCustomer}
                />
              )}
            />
            <Route
              exact
              path="/admin/users/restaurants"
              render={props => (
                <Restaurant
                  {...props}
                  {...this.props}
                  setSelectedRestaurant={this.setSelectedRestaurant}
                />
              )}
            />
            <Route
              exact
              path="/admin/users/customers/restaurant/edit"
              render={props => (
                <RestaurantUser
                  {...props}
                  {...this.state}
                  {...this.props}
                  setSelectedRestaurant={this.setSelectedRestaurant}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default UsersSection;
