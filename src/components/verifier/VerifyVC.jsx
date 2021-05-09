import React, { useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, Typography, Card } from '@material-ui/core';
// import QrReader from 'react-qr-reader';
import QrReader from 'react-qr-scanner';
import Input from '../widgets/Input';
import Button from './../widgets/Button';
import axios from 'axios';
import ApiService from '../../utils/affinidiAPIS';
import { AlertContext } from './../../context/AlertContext';

const useStyles = makeStyles((theme) => ({
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
	root: {
		padding: 32,
		backgroundColor: '#faf9fc',
		height: 'calc(100% - 128px)',
		[theme.breakpoints.down('sm')]: {
			padding: 16,
		},
	},
	card_root: {
		display: 'flex',
		padding: 24,
		[theme.breakpoints.down('sm')]: {
			display: 'block',
		},
	},
	left: {
		width: '30%',
		[theme.breakpoints.down('md')]: {
			width: '50%',
		},
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	right: {
		width: '80%',
		[theme.breakpoints.down('md')]: {
			width: '50%',
		},
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	QR_btn: {
		margin: '32px 16px',
	},
	QRScanner: {
		minWidth: 240,
		maxWidth: 500,
		height: '100%',
		marginLeft: 'auto',
		[theme.breakpoints.down('sm')]: {
			maxWidth: 400,
		},
	},
	credential: {
		display: 'flex',
		justifyContent: 'center',
	},
	verified: {
		backgroundColor: '#43a047',
		display: 'flex',
		justifyContent: 'center',
		padding: 8,
		fontSize: 24,
		fontFamily: 'Poppins',
		fontWeight: 500,
		borderRadius: 4,
		marginBottom: 16,
		color: theme.palette.primary.contrastText,
		'&:hover': {
			backgroundColor: '#2e7d32',
		},
	},
}));

const VerifyVC = () => {
	const classes = useStyles();
	const [scan, setScan] = useState(false);
	const [vcDetail, setVCDetail] = useState(false);
	const [verified, setVerified] = useState(false);
	const [url, setURL] = useState('');
	const alertContext = useContext(AlertContext);

	const handleScan = async (data) => {
		if (data) {
// 			setURL(data);
// 			await submit(null, data);
			setURL(data.text);
			await submit(null, data.text);
			setScan(false);
		}
	};

	const handleError = (err) => {
		console.error(err);
	};

	const submit = async (e, temp) => {
		if (e) e.preventDefault();

		const vc = await axios
			.get(e ? url : temp)
			.then((res) => {
				setVCDetail(res.data);
				return res.data;
			})
			.catch((err) => {
				console.log(err.message);
			});

		if (vc) {
			var data = {
				verifiableCredentials: [vc],
			};
			const response = await ApiService.verifyVC(data);
			if (response.isValid) {
				setVerified(true);
			} else {
				alertContext.toast(true, response.errors[0], 'error');
			}
		} else {
			alertContext.toast(true, 'Invalid URL', 'error');
		}
	};

	return (
		<>
			<AppBar position="static" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						ABC Infotech
					</Typography>
				</Toolbar>
			</AppBar>
			<section className={classes.root}>
				<Card className={classes.card_root}>
					{verified ? (
						<Verified vc={vcDetail} />
					) : (
						<>
							<div className={classes.left}>
								<form onSubmit={(e) => submit(e)}>
									<div className="input_box">
										<Input
											label="Enter sharing url"
											fullWidth
											value={url}
											onChange={(e) => {
												setURL(e.target.value);
											}}
											name="url"
										/>
										<div className="row">
											<div className="button">
												<Button fullWidth type="submit">
													Submit
												</Button>
											</div>
										</div>
									</div>
								</form>
								<div className="row">
									<div className="input_box">
										<Typography className={classes.QR_btn}>OR</Typography>
									</div>
								</div>
								<div className="row">
									<div className="input_box">
										<div className={classes.QR_btn}>
											<Button fullWidth onClick={() => setScan(!scan)}>
												{scan ? 'Stop Scanner' : 'Scan QR Code'}
											</Button>
										</div>
									</div>
								</div>
							</div>
							<div className={classes.right}>
								{scan && (
									<QrReader
										delay={300}
										onError={handleError}
										onScan={handleScan}
										className={classes.QRScanner}
									/>
								)}
							</div>
						</>
					)}
				</Card>
			</section>
		</>
	);
};

export default VerifyVC;

const getTime = (data) => {
	return new Date(data).toUTCString();
};

const Verified = ({ vc }) => {
	const classes = useStyles();
	return (
		<>
			<div className={classes.credential}>
				<div>
					<div className={classes.verified}>Verified!</div>
					<div className="row data">
						<Typography>VC Type</Typography>:<label>{vc.type[1]}</label>
					</div>
					<div className="row data">
						<Typography>Name</Typography>:
						<label>{vc.credentialSubject.data.name}</label>
					</div>
					<div className="row data">
						<Typography>Email </Typography>:
						<label>{vc.credentialSubject.data.worksFor.offerLetter}</label>
					</div>
					<div className="row data">
						<Typography>Salary </Typography>:
						<label>
							Rs. {vc.credentialSubject.data.worksFor.salary.gross.value}
						</label>
					</div>
					<div className="row data">
						<Typography>Experience </Typography>:
						<label>
							{vc.credentialSubject.data.worksFor.experienceLetter} years
						</label>
					</div>
					<div className="row data">
						<Typography>Skills </Typography>:
						<label>{vc.credentialSubject.data.worksFor.skills.join(' ')}</label>
					</div>
					<div className="row data">
						<Typography>Status </Typography>:
						<label className={classes.approved}>Approved</label>
					</div>
					<div className="row data">
						<Typography>Issued By</Typography>:<label>ABC Infotech</label>
					</div>
					<div className="row data">
						<Typography>Issued at</Typography>:
						<label>{getTime(vc.issuanceDate)}</label>
					</div>
				</div>
			</div>
		</>
	);
};
