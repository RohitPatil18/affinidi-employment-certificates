import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import Login from './Login';
import { Route } from 'react-router-dom';
import { routes } from '../utils/routes';
import Signup from './Signup';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	left: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		height: 'inherit',
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		},
	},
	right: {
		height: 'inherit',
	},
	left_root: {
		height: 'inherit',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		fontSize: 32,
	},
}));

const AuthLayout = () => {
	const classes = useStyles();
	return (
		<>
			<Grid container className={classes.root}>
				<Grid
					item
					xl={7}
					lg={7}
					md={7}
					sm={12}
					xs={12}
					className={classes.left}
				>
					<div className={classes.left_root}>ABC Infotech</div>
				</Grid>
				<Grid
					item
					xl={5}
					lg={5}
					md={5}
					sm={12}
					xs={12}
					className={classes.right}
				>
					<Route path={routes.ACCEPT} component={Login} />
					<Route path={routes.LOGIN} exact component={Login} />
					<Route path={routes.SIGNUP} exact component={Signup} />
				</Grid>
			</Grid>
		</>
	);
};

export default AuthLayout;
