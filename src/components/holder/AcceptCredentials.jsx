import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Card, makeStyles, Typography } from '@material-ui/core';
import Button from '../widgets/Button';
import { AlertContext } from '../../context/AlertContext';
import ApiService from '../../utils/affinidiAPIS';
import { routes } from '../../utils/routes';

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
	credential: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		[theme.breakpoints.down('sm')]: {
			display: 'block',
		},
	},
	approved: {
		color: '#43a047',
		fontWeight: 600,
	},
	btn: {
		display: 'flex',
		margin: '0px 16px',
		marginLeft: 'auto',
	},
}));

const AcceptCredentials = (props) => {
	const classes = useStyles();
	const history = useHistory();
	const [vcDetail, setVCDetail] = useState(null);
	const alertContext = useContext(AlertContext);

	const getVCDetail = async () => {
		const response = await axios
			.get(
				history.location.pathname.split('/accept-credentials/URL=')[1] +
					history.location.search
			)
			.then((res) => {
				return res.data;
			});
		setVCDetail(response);
	};

	const saveToHolderWallet = async () => {
		const vc = vcDetail;

		try {
			// Store the VC
			await ApiService.storeVC({
				data: [vc],
			});
			alertContext.toast(true, 'Credential saved in your wallet', 'success');
			props.history.push(routes.HOME);
		} catch (error) {
			alertContext.toast(true, error.message, 'error');
		}
	};

	useEffect((temp) => {
		getVCDetail();
	}, []);

	if (vcDetail) {
		const data = vcDetail.credentialSubject.data;
		return (
			<>
				<section className={classes.root}>
					<Card className={classes.card_root}>
						<div className={classes.credential}>
							<div>
								<div className="row data">
									<Typography>Name</Typography>:<label>{data.name}</label>
								</div>
								<div className="row data">
									<Typography>Email </Typography>:
									<label>{data.worksFor.offerLetter}</label>
								</div>
								<div className="row data">
									<Typography>Salary </Typography>:
									<label>Rs. {data.worksFor.salary.gross.value}</label>
								</div>
								<div className="row data">
									<Typography>Experience </Typography>:
									<label>{data.worksFor.experienceLetter} years</label>
								</div>
								<div className="row data">
									<Typography>Skills </Typography>:
									<label>{data.worksFor.skills.join(' ')}</label>
								</div>
								<div className="row data">
									<Typography>Status </Typography>:
									<label className={classes.approved}>Approved</label>
								</div>
								<div className="row data">
									<Typography>Issued By</Typography>:<label>ABC Infotech</label>
								</div>
							</div>
						</div>
						<div className="row">
							<Button
								className={classes.btn}
								onClick={() => saveToHolderWallet()}
							>
								Save credential
							</Button>
						</div>
					</Card>
				</section>
			</>
		);
	}
	return <></>;
};

export default AcceptCredentials;
