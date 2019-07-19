import React, { Component, Fragment } from "react";
import { FaSearch } from "react-icons/fa";
/* Custom imports */
import "./Customer.css";
/* Custom Component imports */
import Constants from "../commons/Constants.js";

const filters = {
  name: "Name",
  username: "Username"
};

export default class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCustomers: [],
      loadingAllCustomers: true,
      firebaseObject: null,
      searchInput: "",
      paginationDiv: {},
      currentPageData: [],
      currentPage: 1,
      filter: "name",
      goSearch: false
    };
  }

  async componentWillMount() {
    this.getAllRegisteredUsers();
  }

  componentWillUnmount() {
    this.props.doUseFirebaseObject
      .database()
      .ref("USERS")
      .off("value", this.state.firebaseObject);
  }

  getAllRegisteredUsers = async () => {
    console.log("Customer - 1. Gettling registered users");
    const firebaseObject = await this.props.doUseFirebaseObject
      .database()
      .ref("USERS")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const currentCustomersWithKey = JSON.parse(
            JSON.stringify(snapshot.val())
          );
          let initAllCustomers = [];
          Object.keys(currentCustomersWithKey).forEach(customerKey => {
            initAllCustomers.push(currentCustomersWithKey[customerKey]);
          });

          initAllCustomers = this.reverseHelper(initAllCustomers);
          this.setState({ allCustomers: initAllCustomers });
          this.getPaginationDivision();
          setTimeout(() => {
            this.setState({ loadingAllCustomers: false });
          }, Constants.LOG_DISPLAY_TIME);
        } else {
          setTimeout(() => {
            this.setState({ loadingAllCustomers: false });
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
    const currentCustomers = value;
    const pages = Math.ceil(currentCustomers.length / 5);
    const division = {};
    const pageRange = 5;
    if (pages === 0 || typeof page === "number") return {};

    let start = 0;
    let end = pageRange - 1;
    for (let index = 1; index <= pages; index++) {
      division[String(index)] = currentCustomers.slice(start, end + 1);
      start += pageRange;
      end += pageRange;
      if (end > currentCustomers.length - 1) end = currentCustomers.length - 1;
    }
    return division;
  };

  getPaginationDivision = async () => {
    console.log("Customer - 1. Gettling pagination for users view");
    const division = this.divisionHelper(await this.state.allCustomers);
    await this.setState({ paginationDiv: division });
  };

  paginationDisplay = () => {
    console.log("Customer Pagination Display");
    if (
      this.state.allCustomers.length === 0 &&
      this.state.loadingAllCustomers === false
    ) {
      return (
        <div className="customer_view_empty">
          {"It seems that there are no registered users as of present.."}
        </div>
      );
    }
    if (
      this.state.allCustomers.length === 0 &&
      this.state.loadingAllCustomers === true
    ) {
      return (
        <div className="customer_view_empty">
          {"Getting users, please wait.."}
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
        <div className="customer_view_empty">
          {"We didn't find any data related to your search"}
        </div>
      );
    }

    const pageLength = Object.keys(paginationData).length;
    const page =
      this.state.currentPage > pageLength ? pageLength : this.state.currentPage;

    const usersForDisplay = paginationData[String(page)];

    const finalDisplay = [];
    if (!usersForDisplay) return null;

    usersForDisplay.forEach(user => {
      const currentDOM = (
        <div
          className="customer_view_eachuser"
          onClick={() => this.handleCustomerPress(user)}
          key={user.accountID}
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "5px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`First Name:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${user.firstName}`}</p>
            </div>
            <div style={{ marginLeft: "15px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Last Name:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${user.lastName}`}</p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "5px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Username:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${user.username}`}</p>
            </div>
            <div style={{ marginLeft: "15px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`E-mail:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${user.email}`}</p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "5px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`Address:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${user.address}`}</p>
            </div>
            <div style={{ marginLeft: "15px", display: "flex" }}>
              <p style={{ fontWeight: "bold" }}>{`ID:`}</p>
              <p style={{ marginLeft: "5px" }}>{`${user.accountID}`}</p>
            </div>
          </div>
        </div>
      );
      finalDisplay.push(currentDOM);
    });
    return (
      <Fragment>
        <div className="customer_view_userwrapper">{finalDisplay}</div>
        <div className="customer_view_page_button_wrapper">
          <div className="customer_view_prev" onClick={this.handlePrev}>
            <p>{"<< Prev"}</p>
          </div>
          <div className="customer_view_select_page_wrapper">
            <select
              className="customer_view_select_dom"
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
            className="customer_view_next"
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

  handleCustomerPress = user => {
    this.props.setSelectedCustomer(user);
    this.props.history.push("/admin/users/customers/customer/edit");
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
    this.state.allCustomers.map(customer => {
      const availableString = `${
        this.state.filter === "username" ? String(customer.username) : ""
      } ${
        this.state.filter === "name"
          ? String(customer.firstName) + String(customer.lastName)
          : ""
      }`;

      if (
        String(availableString)
          .toLowerCase()
          .indexOf(stringToSearch) >= 0
      ) {
        filteredValues.push(customer);
      }
    });
    return filteredValues;
  };

  render() {
    return (
      <div className="customers_view_wrapper">
        <div className="customer_view_header">
          <input
            type="text"
            id="customer_view_search"
            placeholder="search something"
            onChange={event => {
              if (typeof event.target.value === "string")
                this.setState({ searchInput: event.target.value });
            }}
          />
          <div className="customer_view_search_icon">
            <FaSearch />
          </div>
          <div className="customer_view_filter_label">{"Filter by: "}</div>
          <div className="customer_view_filter_wrap">
            <select
              value={this.state.filter}
              id="customer_view_filter_select"
              onChange={event => this.setState({ filter: event.target.value })}
            >
              {Object.keys(filters).map(filter => (
                <option key={filter} value={filter}>
                  {filters[filter]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="customer_view_data">{this.paginationDisplay()}</div>
      </div>
    );
  }
}
