import { makeStyles, Card, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ApiService from '../../utils/affinidiAPIS';
import Button from '../widgets/Button';
import Loader from '../widgets/Loader';

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
		alignItems: 'start',
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
	vc: {
		display: 'block',
		textAlign: 'center',
		[theme.breakpoints.down('sm')]: {
			marginTop: 32,
		},
	},
	sharingUrl: {
		padding: '0 16px',
		fontWeight: 400,
		width: 380,
		height: 32,
		backgroundColor: '#faf9fc',
		border: '1px solid #e1e0e2',
		fontSize: 16,
		borderRadius: 4,
		marginBottom: 16,
		fontFamily: 'Poppins',
	},
}));

const Wallet = () => {
	const classes = useStyles();
	const [list, setList] = useState([]);
	const [detail, setVCDetail] = useState(true);
	const [loader, setLoader] = useState(true);
	const [shareloader, setshareLoader] = useState(false);
	const [share, setShare] = useState(false);

	const getCreds = async () => {
		const response = await ApiService.getAllCredentials();
		setList(response);
		setLoader(false);
	};

	const getSharedCred = async () => {
		const detail = await ApiService.shareCredentials(list[0]?.id);
		setVCDetail(detail);
		setshareLoader(false);
	};

	const getTime = (data) => {
		return new Date(data).toUTCString();
	};

	useEffect((temp) => {
		getCreds();
	}, []);

	return (
		<>
			{loader ? (
				<Loader />
			) : (
				<section className={classes.root}>
					<Card className={classes.card_root}>
						{list.map(
							(vc, index) =>
								vc && (
									<div className={classes.credential} key={index}>
										<div>
											<div className="row data">
												<Typography>VC Type</Typography>:
												<label>{vc.type[1]}</label>
											</div>
											<div className="row data">
												<Typography>Name</Typography>:
												<label>{vc.credentialSubject.data.name}</label>
											</div>
											<div className="row data">
												<Typography>Email </Typography>:
												<label>
													{vc.credentialSubject.data.worksFor.offerLetter}
												</label>
											</div>
											<div className="row data">
												<Typography>Salary </Typography>:
												<label>
													Rs.{' '}
													{
														vc.credentialSubject.data.worksFor.salary.gross
															.value
													}
												</label>
											</div>
											<div className="row data">
												<Typography>Experience </Typography>:
												<label>
													{vc.credentialSubject.data.worksFor.experienceLetter}{' '}
													years
												</label>
											</div>
											<div className="row data">
												<Typography>Skills </Typography>:
												<label>
													{vc.credentialSubject.data.worksFor.skills.join(' ')}
												</label>
											</div>
											<div className="row data">
												<Typography>Status </Typography>:
												<label className={classes.approved}>Approved</label>
											</div>
											<div className="row data">
												<Typography>Issued By</Typography>:
												<label>ABC Infotech</label>
											</div>
											<div className="row data">
												<Typography>Issued at</Typography>:
												<label>{getTime(vc.issuanceDate)}</label>
											</div>
										</div>
										<div className="row">
											{share ? (
												shareloader ? (
													<Loader />
												) : (
													<div className={classes.vc}>
														<img src={detail.qrCode} alt="qrCode" />
														<div>
															<input
																className={classes.sharingUrl}
																disabled
																value={detail.sharingUrl}
															/>
															<Typography>
																The link and QR code will expire after 1 hour
															</Typography>
														</div>
													</div>
												)
											) : (
												<Button
													className={classes.btn}
													onClick={() => {
														setshareLoader(true);
														setShare(true);
														getSharedCred();
													}}
												>
													Share credential
												</Button>
											)}
										</div>
									</div>
								)
						)}
						{list.length === 0 && <Typography> Wallet is empty! </Typography>}
					</Card>
				</section>
			)}
		</>
	);
};

export default Wallet;
