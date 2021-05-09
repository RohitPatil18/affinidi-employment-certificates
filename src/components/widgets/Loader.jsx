import { CircularProgress } from '@material-ui/core';
import React from 'react';

const Loader = () => {
	return (
		<div
			style={{
				height: '100vh',
				width: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<CircularProgress />
		</div>
	);
};

export default Loader;
