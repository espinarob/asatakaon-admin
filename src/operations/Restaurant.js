import React, { Component, Fragment } from "react";
import { FaSearch } from "react-icons/fa";
/* Custom imports */
import "./Restaurant.css";
/* Custom Component imports */
import Constants from "../commons/Constants.js";

const filters = {
  name: "Restaurant Name",
  username: "Username",
  address: "Address"
};

const restaurantStatus = {
  all: "All",
  blocked: "Blocked",
  unblocked: "Unblocked"
};

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allRestaurants: [],
      loadingAllRestaurant: true,
      firebaseObject: null,
      searchInput: "",
      paginationDiv: {},
      currentPageData: [],
      currentPage: 1,
      filter: "name",
      status: "all",
      goSearch: false
    };
  }

  async componentWillMount() {
    this.getAllRegisteredRestaurants();
  }

  componentWillUnmount() {
    this.props.doUseFirebaseObject
      .database()
      .ref("RESTAURANT")
      .off("value", this.state.firebaseObject);
  }

  getAllRegisteredRestaurants = async () => {
    console.log("Restaurant - 1. Gettling registered restaurant");
    const firebaseObject = await this.props.doUseFirebaseObject
      .database()
      .ref("RESTAURANT")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const currentRestaurantWithKey = JSON.parse(
            JSON.stringify(snapshot.val())
          );
          let initAllRestaurants = [];
          Object.keys(currentRestaurantWithKey).forEach(resKey => {
            initAllRestaurants.push(currentRestaurantWithKey[resKey]);
          });

          initAllRestaurants = this.reverseHelper(initAllRestaurants);

          this.setState({ allRestaurants: initAllRestaurants });
          this.getPaginationDivision();
          setTimeout(() => {
            this.setState({ loadingAllRestaurant: false });
          }, Constants.LOG_DISPLAY_TIME);
        } else {
          setTimeout(() => {
            this.setState({ loadingAllRestaurant: false });
          }, Constants.LOG_DISPLAY_TIME);
        }
      });
    this.setState({ firebaseObject });
  };

  reverseHelper = res => {
    const revResults = [];
    for (let index = res.length - 1; index >= 0; index--) {
      revResults.push(res[index]);
    }
    return JSON.parse(JSON.stringify(revResults));
  };

  divisionHelper = value => {
    const currentRestaurants = value;
    const pages = Math.ceil(currentRestaurants.length / 5);
    const division = {};
    const pageRange = 5;
    if (pages === 0 || typeof page === "number") return {};

    let start = 0;
    let end = pageRange - 1;
    for (let index = 1; index <= pages; index++) {
      division[String(index)] = currentRestaurants.slice(start, end + 1);
      start += pageRange;
      end += pageRange;
      if (end > currentRestaurants.length - 1)
        end = currentRestaurants.length - 1;
    }
    return division;
  };

  getPaginationDivision = async () => {
    console.log("Restaurant - 2. Gettling pagination for restaurants view");
    const division = this.divisionHelper(await this.state.allRestaurants);
    await this.setState({ paginationDiv: division });
  };

  paginationDisplay = () => {
    console.log("Restaurant Pagination Display");
    if (
      this.state.allRestaurants.length === 0 &&
      this.state.loadingAllRestaurant === false
    ) {
      return (
        <div className="restaurant_view_empty">
          {"It seems that there are no registered restaurants as of present.."}
        </div>
      );
    }
    if (
      this.state.allRestaurants.length === 0 &&
      this.state.loadingAllRestaurant === true
    ) {
      return (
        <div className="restaurant_view_empty">
          {"Getting restaurants, please wait.."}
        </div>
      );
    }

    let searchResults = {};
    if (this.state.searchInput.length > 0) {
      searchResults = this.divisionHelper(this.searchHelper());
    }
    const paginationData =
      this.state.searchInput.length > 0
        ? searchResults
        : this.state.paginationDiv;

    if (
      this.state.searchInput.length > 0 &&
      Object.keys(searchResults).length === 0
    ) {
      return (
        <div className="restaurant_view_empty">
          {"We didn't find any data related to your search"}
        </div>
      );
    }

    const pageLength = Object.keys(paginationData).length;
    const page =
      this.state.currentPage > pageLength ? pageLength : this.state.currentPage;

    const restaurantForDisplay = paginationData[String(page)];

    const finalDisplay = [];
    if (!restaurantForDisplay) return null;

    restaurantForDisplay.forEach(res => {
      const currentDOM = (
        <div
          className="restaurant_view_eachuser"
          onClick={() => this.handleRestaurantPress(res)}
          key={res.key}
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "5px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Restaurant Name:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${res.restaurantName}`}</p>
            </div>
            <div style={{ marginLeft: "15px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Username:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${res.username}`}</p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "5px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Operating Hours:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${res.startingHour}-${
                res.closingHour
              }`}</p>
            </div>
            <div style={{ marginLeft: "15px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Location:`}</p>
              <p
                style={{
                  marginLeft: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >{`${
                res.location
                  ? res.location.addressName
                  : "No location submitted"
              }`}</p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "5px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Status:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${
                res.placeStatus === "ACCEPTED" ? "Unblocked" : "Blocked"
              }`}</p>
            </div>
          </div>
        </div>
      );
      finalDisplay.push(currentDOM);
    });
    return (
      <Fragment>
        <div className="restaurant_view_userwrapper">{finalDisplay}</div>
        <div className="restaurant_view_page_button_wrapper">
          <div className="restaurant_view_prev" onClick={this.handlePrev}>
            <p>{"<< Prev"}</p>
          </div>
          <div className="restaurant_view_select_page_wrapper">
            <select
              className="restaurant_view_select_dom"
              onChange={event =>
                this.setState({ currentPage: event.target.value })
              }
              value={this.state.currentPage}
            >
              {Object.keys(paginationData).map(page => {
                return (
                  <option key={page} value={`${page}`}>
                    {page}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className="restaurant_view_next"
            onClick={() => {
              if (pageLength !== 1) this.handleNext(pageLength);
            }}
          >
            <p>{"Next >>"}</p>
          </div>
        </div>
      </Fragment>
    );
  };

  handleRestaurantPress = user => {
    this.props.setSelectedRestaurant(user);
    this.props.history.push("/admin/users/customers/restaurant/edit");
  };

  handleNext = paginationLength => {
    if (this.state.currentPage < paginationLength) {
      this.setState({ currentPage: this.state.currentPage + 1 });
    }
  };

  handlePrev = () => {
    if (this.state.currentPage > 1) {
      this.setState({ currentPage: this.state.currentPage - 1 });
    }
  };

  searchHelper = () => {
    const stringToSearch = String(this.state.searchInput).toLowerCase();
    const filteredValues = [];
    this.state.allRestaurants.map(restaurant => {
      const availableString = `${
        this.state.filter === "username" ? String(restaurant.username) : ""
      } ${
        this.state.filter === "name" ? String(restaurant.restaurantName) : ""
      }${
        this.state.filter === "address"
          ? restaurant.location
            ? String(restaurant.location.addressName)
            : ""
          : ""
      }`;

      if (
        String(availableString)
          .toLowerCase()
          .indexOf(stringToSearch) >= 0
      ) {
        if (
          this.state.status === "all" ||
          (this.state.status === "blocked" &&
            restaurant.placeStatus === "BLOCKED") ||
          (this.state.status === "unblocked" &&
            restaurant.placeStatus === "ACCEPTED")
        )
          filteredValues.push(restaurant);
      }
    });
    return filteredValues;
  };

  render() {
    return (
      <div className="restaurant_view_wrapper">
        <div className="restaurant_view_header">
          <input
            type="text"
            id="restaurant_view_search"
            placeholder="search something"
            onChange={event => {
              if (typeof event.target.value === "string")
                this.setState({ searchInput: event.target.value });
            }}
          />
          <div className="restaurant_view_search_icon">
            <FaSearch />
          </div>
          <div className="restaurant_view_filter_label">{"Filter by: "}</div>
          <div className="restaurant_view_filter_wrap">
            <select
              value={this.state.filter}
              id="restaurant_view_filter_select"
              onChange={event => this.setState({ filter: event.target.value })}
            >
              {Object.keys(filters).map(filter => (
                <option key={filter} value={filter}>
                  {filters[filter]}
                </option>
              ))}
            </select>
          </div>
          <div className="restaurant_view_status_label">{"Status: "}</div>
          <div className="restaurant_view_status_wrap">
            <select
              value={this.state.status}
              id="restaurant_view_status_select"
              onChange={event => this.setState({ status: event.target.value })}
            >
              {Object.keys(restaurantStatus).map(status => (
                <option key={status} value={status}>
                  {restaurantStatus[status]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="restaurant_view_data">{this.paginationDisplay()}</div>
      </div>
    );
  }
}
