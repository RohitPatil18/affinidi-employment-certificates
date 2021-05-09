import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Route, useHistory } from 'react-router';
import { routes } from './../utils/routes';
import Home from './holder/Home';
import IssuerHome from './issuer/IssuerHome';
import { AppContext } from '../context/AppContext';
import Loader from './widgets/Loader';
import RequestDetail from './issuer/RequestDetail';
import AcceptCredentials from './holder/AcceptCredentials';
import { NavLink } from 'react-router-dom';
import Wallet from './holder/Wallet';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		marginRight: 32,
		padding: '0 8px',
	},
	appBar: {
		backgroundColor: theme.palette.primary.main,
	},
	account: {
		marginLeft: 'auto',
	},
	tab: {
		height: 64,
		display: 'flex',
		alignItems: 'center',
		'& a': {
			color: theme.palette.primary.contrastText,
			margin: '0px 16px',
			fontSize: 16,
			padding: '0px 16px',
			textDecoration: 'none',
			fontFamily: 'Poppins',
			boxSizing: 'border-box',
			borderBottom: `4px solid ${theme.palette.primary.main}`,
			display: 'flex',
			alignItems: 'center',
			height: '100%',
			'&:hover': {
				backgroundColor: theme.palette.primary.light,
			},
		},
	},
	active: {
		borderBottom: `4px solid ${theme.palette.primary.contrastText} !important`,
		borderRadius: 2,
	},
}));

export default function MenuAppBar() {
	const classes = useStyles();
	const history = useHistory();
	const appContext = useContext(AppContext);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const logout = () => {
		localStorage.clear();
		history.push(routes.LOGIN);
	};

	return (
		<>
			<div className={classes.root}>
				<AppBar position="static" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							ABC Infotech
						</Typography>
						{appContext.isAdmin === false && (
							<nav className={classes.tab}>
								<NavLink
									to={routes.HOME}
									exact
									activeClassName={classes.active}
								>
									Home
								</NavLink>
								<NavLink
									to={routes.WALLET}
									exact
									activeClassName={classes.active}
								>
									Wallet
								</NavLink>
							</nav>
						)}
						<div className={classes.account}>
							<IconButton
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'end',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'end',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}
							>
								<MenuItem onClick={logout}>Logout</MenuItem>
							</Menu>
						</div>
					</Toolbar>
				</AppBar>
			</div>
			{appContext.isAdmin === null ? (
				<Loader />
			) : appContext.isAdmin ? (
				<>
					<Route path={routes.HOME} exact component={IssuerHome} />
					<Route path={routes.DETAIL} exact component={RequestDetail} />
				</>
			) : (
				<>
					<Route path={routes.HOME} exact component={Home} />
					<Route path={routes.WALLET} exact component={Wallet} />
					<Route
						path={routes.ACCEPTCREDENTIALS}
						component={AcceptCredentials}
					/>
				</>
			)}
		</>
	);
}
