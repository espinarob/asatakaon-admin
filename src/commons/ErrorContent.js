import React, { Component } from 'react';


class ErrorContent extends Component {

	render(){
		return(
			<div style ={{
					height: '100%',
					width: '100%',
					position: 'relative',
					border: 'solid'
			}}>
				<p
				 	style= {{
				 		height: '5%',
				 		width: '50%',
				 		left: '25%',
				 		top: '35%',
				 		position: 'relative',
				 		fontSize: '15px',
				 		paddingTop: '10px',
				 		fontWeight: 'bold',
				 		textAlign: 'center'
				 	}}>
				 	{'Error: Page not found'}
			 	</p>
			</div>
		);
    }
}

export default ErrorContent;