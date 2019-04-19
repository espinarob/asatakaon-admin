import React, { Component } from 'react';

import Constants from '../commons/Constants.js';
import './UsersSection.css';

class UsersSection extends Component {

	state = {
		userSectionData          : Constants.USERS_OPERATION.CUSTOMERS,
		loadingCustomersData     : false,
		loadingRestaurantData    : true,
		firebaseCustomersObject  : '',
		firebaseRestaurantObject : '',
		allCustomers             : [],
		allRestaurants           : []
	}

	componentDidMount(){
		this.getRegisteredUsers();
		this.getRegisteredRestaurants();
	}

	componentWillUnmount(){
		this.props.doUseFirebaseObject
			.database()
			.ref("RESTAURANT")
			.off("value",this.state.firebaseRestaurantObject);
		this.props.doUseFirebaseObject
			.database()
			.ref("USERS")
			.off("value",this.state.firebaseCustomersObject);
	}

	getRegisteredRestaurants = ()=>{
		const firebaseRestaurantObject = 	this.props.doUseFirebaseObject
												.database()
												.ref("RESTAURANT")
												.on("value",snapshot=>{
													if(snapshot.exists()){
														const currentRestaurantsWithKey = JSON.parse(JSON.stringify(snapshot.val()));
														const initAllRestaurants        = [];
														Object
															.keys(currentRestaurantsWithKey)
															.forEach((restaurantKey)=>{
																initAllRestaurants.push(currentRestaurantsWithKey[restaurantKey]);
															});
														this.setState({allRestaurants:initAllRestaurants});
														setTimeout(()=>{
															this.setState({loadingRestaurantData:false})
														},Constants.LOG_DISPLAY_TIME);
													}
													else{
														setTimeout(()=>{
															this.setState({loadingRestaurantData:false})
														},Constants.LOG_DISPLAY_TIME);
													}
												});
		this.setState({firebaseRestaurantObject:firebaseRestaurantObject});
	}

	getRegisteredUsers = ()=>{
		const firebaseCustomersObject = 	this.props.doUseFirebaseObject
												.database()
												.ref("USERS")
												.on("value",snapshot=>{
													if(snapshot.exists()){
														const currentCustomersWithKey = JSON.parse(JSON.stringify(snapshot.val()));
														const initAllCustomers        = [];
														Object
															.keys(currentCustomersWithKey)
															.forEach((customerKey)=>{
																initAllCustomers.push(currentCustomersWithKey[customerKey]);
															});
														this.setState({allCustomers:initAllCustomers});
														setTimeout(()=>{
															this.setState({loadingCustomersData:false})
														},Constants.LOG_DISPLAY_TIME);
													}
													else{
														setTimeout(()=>{
															this.setState({loadingCustomersData:false})
														},Constants.LOG_DISPLAY_TIME);
													}
												});
		this.setState({firebaseCustomersObject:firebaseCustomersObject});
	}

	displayAllRegisteredCustomers = ()=>{
		if(this.state.loadingCustomersData == false && this.state.allCustomers.length == 0){
			return 	<p
					 	style= {{
					 		height: '45px',
					 		width: '50%',
					 		left: '25%',
					 		top: '250px',
					 		position: 'relative',
					 		fontSize: '15px',
					 		paddingTop: '10px',
					 		fontWeight: 'bold',
					 		textAlign: 'center'
					 	}}>
					 	{'Sorry, no current registered users/customers'}
				 	</p>
		}
		else{
			return this.state.allCustomers.map((customer)=>{
				return 	<div 
							style ={{
								height: '100px',
								width: '90%',
								position: 'relative',
								marginTop: '10px',
								marginBottom: '10px',
								border: 'solid',
								left: '5%',
								borderWidth: '0.1px',
								paddingTop: '10px'
							}}>
								<p style ={{
									height: '15%',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'First name: '+String(customer.firstName)}
								</p>
								<p style ={{
									height: '15%',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Last name: '+String(customer.lastName)}
								</p>
								<p style ={{
									height: '15%',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Gender: '+String(customer.gender)}
								</p>
								<p style ={{
									height: '15%',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Address: '+String(customer.address)}
								</p>
								<p style ={{
									height: '15%',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Email: '+String(customer.email)}
								</p>
								<p style ={{
									height: '15%',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'ID: '+String(customer.accountID)}
								</p>
						</div>
			});
		}
	}

	displayAllRegisteredRestaurants = ()=>{
		if(this.state.loadingRestaurantData == false && this.state.allRestaurants.length == 0){
			return 	<p
					 	style= {{
					 		height: '45px',
					 		width: '50%',
					 		left: '25%',
					 		top: '250px',
					 		position: 'relative',
					 		fontSize: '15px',
					 		paddingTop: '10px',
					 		fontWeight: 'bold',
					 		textAlign: 'center'
					 	}}>
					 	{'Sorry, no current registered owners/restaurants'}
				 	</p>
		}
		else{
			return this.state.allRestaurants.map((restaurant)=>{
				return 	<div 
							style ={{
								width: '90%',
								position: 'relative',
								marginTop: '10px',
								marginBottom: '10px',
								border: 'solid',
								left: '5%',
								borderWidth: '0.1px',
								paddingTop: '10px'
							}}>
								<p style ={{
									height: '40px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Restaurant name: '+String(restaurant.restaurantName)}
								</p>
								<p style ={{
									height: '40px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Operating hours: '+String(restaurant.startingHour)
									+'-'+String(restaurant.closingHour)}
								</p>
								<p style ={{
									height: '40px',
									position:'relative',
									margin: '0 auto',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Location: '+ (restaurant.location ?
										restaurant.location.addressName : 'Location has not been set')}
								</p>
						</div>
			});
		}
	}


	handleCustomersClicked = ()=>{
		this.setState({userSectionData:Constants.USERS_OPERATION.CUSTOMERS});
	}

	handleRestaurantsClicked = ()=>{
		this.setState({userSectionData:Constants.USERS_OPERATION.RESTAURANTS});
	}

	render(){
		return(
			<div id = 'UsersSectionWrapper'>
				<div
					style ={{
						height: '35px',
						width: '100%',
						position: 'relative',
						top: '15px'
					}}>
					<p
						onClick = {this.handleCustomersClicked}
						style ={{
							height: '80%',
							width: '120px',
							position: 'relative',
							display: 'inline-block',
							fontSize: '15px',
							left: '20px',
							paddingTop: '5px',
							textAlign: 'center',
							fontWeight: 'bold',
							cursor:'pointer',
							borderBottom: (
								this.state.userSectionData ==
								Constants.USERS_OPERATION.CUSTOMERS ?
								'solid' : ''
							)
					}}>	
						CUSTOMERS
					</p>
					<p
						onClick = {this.handleRestaurantsClicked}
						style ={{
							height: '80%',
							width: '120px',
							position: 'relative',
							display: 'inline-block',
							fontSize: '15px',
							left: '25px',
							paddingTop: '5px',
							textAlign: 'center',
							fontWeight: 'bold',
							cursor: 'pointer',
							borderBottom: (
								this.state.userSectionData ==
								Constants.USERS_OPERATION.RESTAURANTS ?
								'solid' : ''
								)
					}}>	
						RESTAURANTS
					</p>
				</div>
				<div 
					style ={{
						width: '100%',
						position:'relative',
						top: '15px',
						paddingTop: '25px'
					}}>
					{
						this.state.userSectionData == Constants.USERS_OPERATION.CUSTOMERS ?
						this.displayAllRegisteredCustomers():
						this.displayAllRegisteredRestaurants()
					}
				</div>
			</div>
		);
    }
}

export default UsersSection;