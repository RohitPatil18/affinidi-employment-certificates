import React, { useContext, useState } from 'react';
import { Card, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '../widgets/Button';
import ApiService, { generateVC } from '../../utils/affinidiAPIS';
import app from '../../utils/firebase';
import emailjs from 'emailjs-com';
import { AlertContext } from '../../context/AlertContext';
import { BASE_URL } from '../../constants/endpoints';
import Loader from './../widgets/Loader';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 32,
		backgroundColor: '#faf9fc',
		height: '100%',
	},
	card_root: {
		padding: 24,
	},
	title: {
		color: '#363b98',
		fontWeight: 600,
		fontSize: 32,
		fontFamily: 'Poppins',
	},
	header: {
		display: ' flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	btn: {
		margin: '32px 24px 16px 16px',
	},
	approve: {
		backgroundColor: '#43a047',
		'&:hover': {
			backgroundColor: '#2e7d32',
		},
	},
	reject: {
		backgroundColor: '#f44336',
		'&:hover': {
			backgroundColor: '#c62828',
		},
	},
}));

const RequestDetail = (props) => {
	const classes = useStyles();
	const detail = props.history.location.state.detail;
	const alertContext = useContext(AlertContext);
	const [loader, setLoader] = useState(false);

	const sendEmail = (code, string) => {
		emailjs
			.send(
				process.env.REACT_APP_EMAILJS_SERVICE_ID,
				process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
				{
					to_name: detail.firstName + ' ' + detail.lastName,
					to_email: detail.email,
					message: BASE_URL + 'accept/URL=' + string,
				},
				process.env.REACT_APP_EMAILJS_USER_ID
			)
			.then(
				function (response) {
					console.log('SUCCESS!', response.status, response.text);
				},
				function (error) {
					console.log('FAILED...', error);
				}
			);
	};

	const approveVC = async () => {
		const vcDetail = generateVC(detail);

		try {
			// Build unsigned VC
			const { unsignedVC } = await ApiService.buildUnsignedVC(vcDetail);

			// Sign the VC
			const { signedCredential } = await ApiService.signVC({
				unsignedCredential: unsignedVC,
			});

			// Store the VC
			const { credentialIds } = await ApiService.storeVC({
				data: [signedCredential],
			});

			// Delete the VC
			// await ApiService.deleteVC(credentialIds);

			// Share the credentials
			const claimID = credentialIds[0];
			const { qrCode, sharingUrl } = await ApiService.shareCredentials(claimID);
			await sendEmail(qrCode, sharingUrl);

			const db = app.firestore();
			// Store the information under Approved Table
			const citiesRef = db.collection('vc-requests');
			const snapshot = await citiesRef.get();
			snapshot.forEach((doc) => {
				if (doc.data().email === detail.email) {
					db.collection('vc-requests').doc(doc.id).update({
						approved: 2,
					});
				}
			});

			// Store the information under Approved Table
			const usersList = db.collection('users');
			const users = await usersList.get();
			users.forEach((doc) => {
				if (doc.data().email === detail.email) {
					db.collection('users').doc(doc.id).update({
						requestStatus: 2,
					});
				}
			});

			alertContext.toast(true, 'Application has been approved!', 'success');
			props.history.goBack();
		} catch (error) {
			alertContext.toast(true, error.message, 'error');
		}
	};

	const rejectVC = async () => {
		const db = app.firestore();
		// Store the information under Approved Table
		const citiesRef = db.collection('vc-requests');
		const snapshot = await citiesRef.get();
		snapshot.forEach((doc) => {
			if (doc.data().email === detail.email) {
				db.collection('vc-requests').doc(doc.id).update({
					approved: 3,
				});
			}
		});

		// Store the information under Approved Table
		const usersList = db.collection('users');
		const users = await usersList.get();
		users.forEach((doc) => {
			if (doc.data().email === detail.email) {
				db.collection('users').doc(doc.id).update({
					requestStatus: 3,
				});
			}
		});
		props.history.goBack();
	};

	return loader ? (
		<Loader />
	) : (
		<>
			<section className={classes.root}>
				<Card className={classes.card_root}>
					<div className={classes.header}>
						<Typography variant="h5" className={clsx(classes.title)}>
							{detail.firstName} {detail.lastName}
						</Typography>
						<Button onClick={() => props.history.goBack()}>Back</Button>
					</div>
					<div className="detail">
						<div>
							<div className="row data">
								<Typography>Email </Typography>:<label>{detail.email}</label>
							</div>
							<div className="row data">
								<Typography>Salary </Typography>:
								<label>Rs. {detail.salary}</label>
							</div>
							<div className="row data">
								<Typography>Experience </Typography>:
								<label>{detail.experience} years</label>
							</div>
							<div className="row data">
								<Typography>Skills </Typography>:<label>{detail.skills}</label>
							</div>
						</div>
					</div>

					<div className="row">
						<Button
							className={clsx(classes.approve, classes.btn)}
							onClick={() => {
								setLoader(true);
								approveVC();
							}}
						>
							Approve
						</Button>
						<Button
							className={clsx(classes.reject, classes.btn)}
							onClick={rejectVC}
						>
							Reject
						</Button>
						<Button
							className={clsx(classes.btn)}
							onClick={() => props.history.goBack()}
						>
							Back
						</Button>
					</div>
				</Card>
			</section>
		</>
	);
};

export default RequestDetail;
