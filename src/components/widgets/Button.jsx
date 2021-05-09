import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
}));

const Button = (props) => {
	const classes = useStyles();
	return (
		<MuiButton
			{...props}
			variant="contained"
			className={clsx(classes.root, props.className)}
		>
			{props.children}
		</MuiButton>
	);
};

export default Button;
