import React, { Component } from 'react';
import * as firebase        from 'firebase';

import Constants      from './commons/Constants.js';
import ErrorContent   from './commons/ErrorContent.js';
import LoginDashboard from './login/LoginDashboard.js';
import UsersSection   from './operations/UsersSection.js';
import './App.css';

class App extends Component {

	state = {
		displayOperation     : Constants.APPLICATION.BLANK,
		operationTitle       : Constants.APPLICATION_TITLE.BLANK,
		successfullyLoggedIn : false,
		displayLoading       : false
	}

	componentDidMount(){
        if(!firebase.apps.length){
            firebase.initializeApp(Constants.FIRE_BASE_CONFIG);
        }
        this.initializeDisplay();
    }

    setDisplayLoading = (flag)=>{
    	this.setState({displayLoading:flag});
    }

    setDisplayOperation = (operation)=>{
    	this.setState({displayOperation:operation});
    }

    setSuccessfullyLoggedIn = (flag,data)=>{
    	if(flag){
    		this.setState({
    			successfullyLoggedIn : flag,
    			displayOperation     : Constants.APPLICATION.HOME_USERS,
    			operationTitle       : Constants.APPLICATION_TITLE.HOME
    		});
    		this.saveCredentialLocally(data);
    	}
    }

    initializeDisplay = ()=>{
   		this.setState({displayLoading:true});
    	const username = localStorage.getItem(Constants.ADMIN_ACCOUNT_USERNAME);
    	const password = localStorage.getItem(Constants.ADMIN_ACCOUNT_PASSWORD);
    	if(password == undefined || username == undefined){
    		this.setState({
    			displayLoading   : false,
    			displayOperation : Constants.APPLICATION.LOGIN_DASHBOARD,
    			operationTitle   : Constants.APPLICATION_TITLE.LOGIN_DASHBOARD
    		});
    	}
    	else{
    		firebase
    			.database()
    			.ref("ADMIN_CRED")
    			.once("value",snapshot=>{
    				if(snapshot.exists()){
    					const adminCredential = JSON.parse(JSON.stringify(snapshot.val()));
    					if(adminCredential.username == username 
    						&& adminCredential.password == password){
    						this.setState({
				    			displayLoading       : false,
				    			displayOperation     : Constants.APPLICATION.HOME_USERS,
				    			successfullyLoggedIn : true,
				    			operationTitle       : Constants.APPLICATION_TITLE.HOME
				    		});
    					}
    					else{
    						this.setState({
				    			displayLoading   : false,
				    			displayOperation : Constants.APPLICATION.LOGIN_DASHBOARD,
				    			operationTitle   : Constants.APPLICATION_TITLE.LOGIN_DASHBOARD 
				    		});
    					}
    				}
    				else{
    					this.setState({
			    			displayLoading   : false,
			    			displayOperation : Constants.APPLICATION.LOGIN_DASHBOARD 
			    		});
    				}
    			});
    	}
    }

    saveCredentialLocally = (data)=>{
    	localStorage.setItem(Constants.ADMIN_ACCOUNT_USERNAME,data.username);
		localStorage.setItem(Constants.ADMIN_ACCOUNT_PASSWORD,data.password);
    }

    logoutCredential = ()=>{
    	this.setState({
    		displayLoading       : true,
    		displayOperation     : Constants.APPLICATION.LOGIN_DASHBOARD,
    		successfullyLoggedIn : false
    	});
    	localStorage.removeItem(Constants.ADMIN_ACCOUNT_USERNAME);
		localStorage.removeItem(Constants.ADMIN_ACCOUNT_PASSWORD);
		setTimeout(()=>{
			this.setState({
				displayLoading: false
			})
		},1500);
    }

	mainDashboarDisplay = ()=>{
		switch(this.state.displayOperation){
			case Constants.APPLICATION.LOGIN_DASHBOARD:
				return 	<LoginDashboard
							setDisplayLoading       = {this.setDisplayLoading}
							setSuccessfullyLoggedIn = {this.setSuccessfullyLoggedIn}
							doUseFirebaseObject     = {firebase} />;
			case Constants.APPLICATION.HOME_USERS:
				if(this.state.successfullyLoggedIn == false){
					return 	<ErrorContent/>;
				}
				else return	<UsersSection
								setDisplayLoading   = {this.setDisplayLoading}
								doUseFirebaseObject = {firebase} />;
		}
	}

	displayLoggedInFeatures = ()=>{
		if(this.state.successfullyLoggedIn){
			return	<React.Fragment>
						<p style ={{
	            				height: '70%',
	            				width: '120px',
	            				fontSize: '14px',
	            				fontWeight: 'bold',
	            				left: '30px',
	            				paddingTop: '10px',
	            				position: 'relative',
	            				textAlign: 'center',
	            				display: 'inline-block',
	            				color: '#fff',
	            				borderBottom: (this.state.displayOperation
	            					== Constants.APPLICATION.HOME_USERS ?
	            					'solid': 'none'),
	            				borderWidth: '3.5px',
	            				borderColor: '#555dff',
	            				cursor: 'pointer'
	            		}}>
	            			{'Users'}
	            		</p>
	            		<p style ={{
	            				height: '70%',
	            				width: '120px',
	            				fontSize: '14px',
	            				fontWeight: 'bold',
	            				left: '30px',
	            				paddingTop: '10px',
	            				position: 'relative',
	            				textAlign: 'center',
	            				display: 'inline-block',
	            				color: '#fff',
	            				borderBottom: (this.state.displayOperation 
	            					== Constants.APPLICATION.HOME_MAP ?
	            					'solid': 'none'),
	            				borderWidth: '3.5px',
	            				borderColor: '#555dff',
	            				cursor: 'pointer'
	            		}}>
	            			{'Map'}
	            		</p>
	            		<p style ={{
	            				height: '70%',
	            				width: '120px',
	            				fontSize: '14px',
	            				fontWeight: 'bold',
	            				left: '30px',
	            				paddingTop: '10px',
	            				position: 'relative',
	            				textAlign: 'center',
	            				display: 'inline-block',
	            				color: '#fff',
	            				borderBottom: (this.state.displayOperation 
	            					== Constants.APPLICATION.HOME_MAP ?
	            					'solid': 'none'),
	            				borderWidth: '3.5px',
	            				borderColor: '#555dff',
	            				cursor: 'pointer'
	            		}}>
	            			{'Messages'}
	            		</p>
	            		<p 
	            			onClick = {this.logoutCredential}
	            			style ={{
	            				height: '70%',
	            				width: '120px',
	            				fontSize: '14px',
	            				fontWeight: 'bold',
	            				paddingTop: '10px',
	            				position: 'relative',
	            				textAlign: 'center',
	            				display: 'inline-block',
	            				color: '#fff',
	            				left: '11.3%',
	            				borderWidth: '3.5px',
	            				borderColor: '#555dff',
	            				cursor: 'pointer'
	            		}}>
	            			{'Logout'}
	            		</p>
	            	</React.Fragment>
		}
	}

    render() {
        return (
            <div className="App">
            	<div id = 'ApplicationHeader'>
            		<p style ={{
            				height: '70%',
            				width: '150px',
            				fontSize: '14px',
            				fontWeight: 'bold',
            				left: '15px',
            				paddingTop: '10px',
            				position: 'relative',
            				textAlign: 'center',
            				display: 'inline-block',
            				color: '#fff',
            				cursor: 'pointer'
            		}}>
            			{'Asa-Ta-Kaon Admin'}
            		</p>
            		<p style ={{
            				height: '70%',
            				width: '150px',
            				fontSize: '14px',
            				fontWeight: 'bold',
            				left: '20px',
            				paddingTop: '10px',
            				position: 'relative',
            				textAlign: 'center',
            				display: 'inline-block',
            				color: '#fff'
            		}}>
            			{this.state.operationTitle}
            		</p>
            		{this.displayLoggedInFeatures()}
            	</div>
            	<div id = 'ApplicationContent'>
            		{this.mainDashboarDisplay()}
            	</div>
            	{
            		this.state.displayLoading  ?
	            	<div
		        		style ={{
		        				height: '100%',
		        				width: '100%',
		        				position:'absolute',
		        				top: '0%',
		        				left:'0%'
		        		}}>
		        		<div
		        			style ={{
		        				height: '100%',
		        				width: '100%',
		        				opacity: '0.5',
		        				position: 'absolute',
		        				backgroundColor: '#000'
		        			}}>
	        			</div>
	        			<img 
	        				style ={{
	        					height: '15%',
	        					width: '20%',
	        					position: 'absolute',
	        					objectFit: 'contain',
	        					opacity : '1.1',
	        					left: '40%',
	        					top: '67%'
	        				}}
	        				src = {require('./img/loading.gif')}/>
	        			<p
	        				style ={{
	        					height: '5%',
	        					top: '80%',
	        					position: 'absolute',
	        					textAlign: 'center',
	        					fontSize: '15px',
	        					fontWeight: 'bold',
	        					color: '#fff',
	        					width: '15%',
	        					left: '42.5%'
	        				}}>
	        				Loading...
	        			</p>
		        	</div>:
		        	<React.Fragment>
		        	</React.Fragment>
		        }
            </div>
        );
    }
}

export default App;
