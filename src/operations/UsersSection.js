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
		allRestaurants           : [],
		viewRestaurantMenu       : false
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

	toggleUserPrivilege = (customer)=>{
		if(customer.status == Constants.ACCOUNT_USER_STATUS.ACCEPTED){
			this.props.setDisplayLoading(true);
			this.props.doUseFirebaseObject	
				.database()
				.ref("USERS/"
					+String(customer.accountID))
				.update({
					'status' : Constants.ACCOUNT_USER_STATUS.BLOCKED
				})
				.then(()=>{
					setTimeout(()=>{
						this.props.setDisplayLoading(false);
						alert('Blocked');
					},Constants.LOG_DISPLAY_TIME);	
				})
				.catch((error)=>{
					this.props.setDisplayLoading(false);
					alert('Error in connecting to the server');
				});
		}
		else{
			this.props.setDisplayLoading(true);
			this.props.doUseFirebaseObject	
				.database()
				.ref("USERS/"
					+String(customer.accountID))
				.update({
					'status' : Constants.ACCOUNT_USER_STATUS.ACCEPTED
				})
				.then(()=>{
					setTimeout(()=>{
						this.props.setDisplayLoading(false);
						alert('Unblocked');
					},Constants.LOG_DISPLAY_TIME);	
				})
				.catch((error)=>{
					this.props.setDisplayLoading(false);
					alert('Error in connecting to the server');
				});
		}
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
								width: '90%',
								position: 'relative',
								marginTop: '10px',
								marginBottom: '10px',
								border: 'solid',
								left: '5%',
								borderWidth: '0.1px',
								paddingTop: '10px',
								paddingBottom: '15px'
							}}>
								<p style ={{
									height: '20px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'First name: '+String(customer.firstName)}
								</p>
								<p style ={{
									height: '20px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Last name: '+String(customer.lastName)}
								</p>
								<p style ={{
									height: '20px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Gender: '+String(customer.gender)}
								</p>
								<p style ={{
									height: '20px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Address: '+String(customer.address)}
								</p>
								<p style ={{
									height: '20px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Email: '+String(customer.email)}
								</p>
								<p style ={{
									height: '20px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'ID: '+String(customer.accountID)}
								</p>
								<p style ={{
									height: '20px',
									position:'relative',
									width: '50%',
									left: '25%',
									fontSize: '13px',
									textAlign: 'center',
									fontWeight: 'bold'
								}}>
									{'Status: '
										+(customer.status == Constants.ACCOUNT_USER_STATUS.ACCEPTED ? 
											'Valid' : 'Blocked' )}
								</p>
								<p 
									onClick = {()=>this.toggleUserPrivilege(customer)}
									style ={{
									height: '25px',
									position:'relative',
									width: '130px',
									fontSize: '14px',
									textAlign: 'center',
									fontWeight: 'bold',
									border: 'solid',
									borderRadius: '15px',
									paddingTop: '2px',
									cursor: 'pointer',
									margin: '0 auto'
								}}>
									{(customer.status == Constants.ACCOUNT_USER_STATUS.ACCEPTED ? 
											'Block User' : 'Unblock User' )}
								</p>
						</div>
			});
		}
	}

	toggleRestaurantPrivilege = (restaurant)=>{
		if(restaurant.placeStatus == Constants.RESTAURANT_PLACE_STATUS.ACCEPTED){
			this.props.setDisplayLoading(true);
			this.props.doUseFirebaseObject
				.database()
				.ref("RESTAURANT/"
					+String(restaurant.key))
				.update({
					'placeStatus' : Constants.RESTAURANT_PLACE_STATUS.BLOCKED
				})
				.then(()=>{
					setTimeout(()=>{
						this.props.setDisplayLoading(false);
						alert('Blocked');
					},Constants.LOG_DISPLAY_TIME);
				})
				.catch((error)=>{
					this.props.setDisplayLoading(false);
					alert('Error in connecting to the server');
				});
		}
		else{
			this.props.setDisplayLoading(true);
			this.props.doUseFirebaseObject
				.database()
				.ref("RESTAURANT/"
					+String(restaurant.key))
				.update({
					'placeStatus' : Constants.RESTAURANT_PLACE_STATUS.ACCEPTED
				})
				.then(()=>{
					setTimeout(()=>{
						this.props.setDisplayLoading(false);
						alert('Accepted');
					},Constants.LOG_DISPLAY_TIME);
				})
				.catch((error)=>{
					this.props.setDisplayLoading(false);
					alert('Error in connecting to the server');
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
			const button = 	<p
								onClick = {()=>this.toggleViewRestaurantMenu()}
								style ={{
									height: '41px',
									position: 'fixed',
									left: '93%',
									top: '67px',
									width: '51px',
									borderRadius: '100%',
									paddingTop: '7px',
									textAlign: 'center',
									fontWeight: 'bold',
									cursor: 'pointer',
									backgroundColor :'#000',
									fontSize: '12px',
									color: '#fff'
								}}>
								{	this.state.viewRestaurantMenu ? 
									'Close Menu':
									'View Menu'}
							</p>
			const data =  this.state.allRestaurants.map((restaurant)=>{
				return 	<div 
							style ={{
								width: '90%',
								position: 'relative',
								marginTop: '10px',
								marginBottom: '10px',
								border: 'solid',
								left: '5%',
								borderWidth: '0.1px',
								paddingTop: '10px',
								paddingBottom: '10px'
							}}>
								<p style ={{
									height: '25x',
									position:'relative',
									width: '90%',
									margin: '0 auto',
									fontSize: '13px',
									textAlign: 'center'
								}}>
									{'Restaurant name: '+String(restaurant.restaurantName)}
								</p>
								<p style ={{
									height: '22px',
									position:'relative',
									width: '90%',
									margin: '0 auto',
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
								<p style ={{
									height: '20px',
									position:'relative',
									width: '80%',
									margin: '0 auto',
									fontSize: '13px',
									textAlign: 'center',
									fontWeight: 'bold'
								}}>
									{'Status: '
										+(restaurant.placeStatus == Constants.RESTAURANT_PLACE_STATUS.ACCEPTED ? 
											'Currently Operating' : 'Waiting for validation' )}
								</p>
								<p
									onClick = {()=>this.toggleRestaurantPrivilege(restaurant)}
									style ={{
										height: '25px',
										position:'relative',
										width: '140px',
										fontSize: '14px',
										textAlign: 'center',
										fontWeight: 'bold',
										border: 'solid',
										borderRadius: '15px',
										paddingTop: '2px',
										cursor: 'pointer',
										margin: '0 auto'
									}}>
									{(restaurant.placeStatus == Constants.RESTAURANT_PLACE_STATUS.BLOCKED ?
										'Accept Restaurant' : 'Block Restaurant')}
								</p>
								
								{
									this.state.viewRestaurantMenu ?
									<div style ={{
											width: '99%',
											position: 'relative',
											marginTop: '10px',
											overflow: 'scroll',
											overflowX: 'hidden',
											paddingTop: '5px',
											paddingBottom:'5px'
									}}>
										{
											!restaurant.Menu ?
											<p style ={{
												height: '30x',
												position:'relative',
												width: '91%',
												margin: '0 auto',
												fontSize: '13px',
												textAlign: 'center',
												fontWeight: 'bold',
												top:'5px'
											}}>
												{'No dish have been added'}
											</p>:
											(this.displayMenuCreated(restaurant))
										}
									</div>:
									<React.Fragment>
									</React.Fragment>
								}
						</div>
			});
			return 	<React.Fragment>
						{data}
						{button}
					</React.Fragment>
		}
	}

	displayMenuCreated = (restaurant)=>{
		const dishWithKey = restaurant.Menu;
		const allDishes   = [];
		Object
			.keys(dishWithKey)
			.forEach((dishKey)=>{
				allDishes.push(dishWithKey[dishKey]);
			});
		return allDishes.map((dish)=>{
			return 	<div 
						style ={{
							width: '70%',
							position: 'relative',
							margin: '0 auto',
							marginTop: '7px',
							marginBottom: '7px',
							paddingBottom: '5px',
							paddingTop: '5px',
							borderBottom: 'solid'
						}}>
						<p 
							style ={{
								height:'20px',
								width: '100%',
								margin: '0 auto',
								fontSize: '13px',
								textAlign: 'center'
							}}>
							{'Name: '+dish.name}
						</p>
						<p 
							style ={{
								height:'20px',
								width: '100%',
								margin: '0 auto',
								fontSize: '13px',
								textAlign: 'center'
							}}>
							{'Type: '+dish.foodType}
						</p>
						<p 
							style ={{
								height:'20px',
								width: '100%',
								margin: '0 auto',
								fontSize: '13px',
								textAlign: 'center'
							}}>
							{'Price: '+dish.price}
						</p>
						<p 
							style ={{
								height:'20px',
								width: '100%',
								margin: '0 auto',
								fontSize: '13px',
								textAlign: 'center'
							}}>
							{'Good for '+dish.price}
						</p>
						<p 
							style ={{
								height:'42px',
								width: '50%',
								margin: '0 auto',
								fontSize: '13px',
								textAlign: 'center'
							}}>
							{'Description: '+ (
								dish.description.length == 0 ?
								'No description' : dish.description)}
						</p>
					</div>
		});
	}

	toggleViewRestaurantMenu = ()=>{
		this.setState({viewRestaurantMenu:!this.state.viewRestaurantMenu});
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