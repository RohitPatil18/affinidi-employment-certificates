import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import app from '../../utils/firebase';
import clsx from 'clsx';
import { useHistory } from 'react-router';
import { routes } from '../../utils/routes';

const db = app.firestore();

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 32,
		backgroundColor: '#faf9fc',
		height: 'calc(100% - 128px)',
		[theme.breakpoints.down('sm')]: {
			padding: 16,
		},
	},
	card_root: {
		padding: 24,
	},
	requests: {
		marginBottom: 48,
	},
	req_card: {
		border: '1px solid #f2f2f2',
		display: 'inline-block',
		background: '#f2f2f2',
		minWidth: 240,
		minHeight: 160,
		borderRadius: 4,
		padding: 24,
		color: '#363b98',
		margin: '24px 0',
		cursor: 'pointer',
		'&:hover': {
			background: '#e5e5e5',
		},
		[theme.breakpoints.down('sm')]: {
			margin: '16px 0',
			padding: 16,
		},
	},
	title: {
		color: '#363b98',
		fontWeight: 600,
		fontSize: 32,
		marginBottom: 16,
		fontFamily: 'Poppins',
	},
	card_title: {
		fontSize: 20,
		fontFamily: 'Poppins',
		fontWeight: 600,
		marginBottom: 16,
		marginTop: 0,
	},
	grid: {
		display: 'flex',
		alignItems: 'center',
		justifyItems: 'center',
		columnGap: 16,
		flexWrap: 'wrap',
		[theme.breakpoints.down('sm')]: {
			display: 'block',
		},
	},
	text: {
		fontFamily: 'Open Sans',
		fontSize: 16,
		color: '#35353a',
		'& div': {
			padding: '8px 0px ',
		},
	},
}));

const IssuerHome = () => {
	const classes = useStyles();
	const history = useHistory();
	const [list, setList] = useState([]);
	const [approved, setApproved] = useState([]);
	const [rejected, setRejected] = useState([]);

	const getList = async () => {
		const citiesRef = db.collection('vc-requests').orderBy('createdAt', 'asc');
		const vcRequests = await citiesRef.get();

		let list = [];
		let approved = [];
		let rejected = [];

		/* 1 = requested, 2 = approved, 3 = rejected */

		vcRequests.forEach((doc) => {
			if (doc.data().approved === 2) {
				approved.push({ ...doc.data(), id: doc.id });
			} else if (doc.data().approved === 3) {
				rejected.push({ ...doc.data(), id: doc.id });
			} else if (doc.data().approved === 1) {
				list.push({ ...doc.data(), id: doc.id });
			}
		});
		setList(list);
		setApproved(approved);
		setRejected(rejected);
	};

	useEffect(() => {
		getList();
	}, [history.location.pathname]);

	return (
		<section className={classes.root}>
			<Card className={classes.card_root}>
				<div className={classes.requests}>
					<Typography variant="h5" className={clsx('mb-32', classes.title)}>
						Requests
					</Typography>
					<div className={classes.grid}>
						{list.map((temp) => (
							<div
								className={classes.req_card}
								key={temp.id}
								onClick={() => {
									history.push({
										pathname: routes.DETAIL,
										state: {
											detail: temp,
										},
									});
								}}
							>
								<h3 className={classes.card_title}>
									{temp.firstName} {temp.lastName}
								</h3>
								<div className={classes.text}>
									<div>{temp.email}</div>
									<div>{temp.experience} years</div>
									<div>{temp.skills}</div>
								</div>
							</div>
						))}
						{list.length === 0 && (
							<Typography variant="h6" className={clsx('mb-32')}>
								No data found
							</Typography>
						)}
					</div>
				</div>
				{approved.length > 0 && (
					<div>
						<Typography variant="h5" className={clsx('mb-32', classes.title)}>
							Approved
						</Typography>
						<div className={classes.grid}>
							{approved.map((temp) => (
								<div className={classes.req_card} key={temp.id}>
									<h3 className={classes.card_title}>
										{temp.firstName} {temp.lastName}
									</h3>
									<div className={classes.text}>
										<div>{temp.email}</div>
										<div>{temp.experience} years</div>
										<div>{temp.skills}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				{rejected.length > 0 && (
					<div>
						<Typography variant="h5" className={clsx('mb-32', classes.title)}>
							Rejected
						</Typography>
						<div className={classes.grid}>
							{rejected.map((temp) => (
								<div className={classes.req_card} key={temp.id}>
									<h3 className={classes.card_title}>
										{temp.firstName} {temp.lastName}
									</h3>
									<div className={classes.text}>
										<div>{temp.email}</div>
										<div>{temp.experience} years</div>
										<div>{temp.skills}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</Card>
		</section>
	);
};

export default IssuerHome;
