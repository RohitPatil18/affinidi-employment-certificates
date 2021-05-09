import React, { useContext, useEffect, useState } from 'react';
import { Card, makeStyles, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import Input from '../widgets/Input';
import Button from '../widgets/Button';
import app from '../../utils/firebase';
import { AlertContext } from '../../context/AlertContext';
import * as Yup from 'yup';
import { AppContext } from '../../context/AppContext';
import Loader from '../widgets/Loader';

const db = app.firestore();

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 32,
		backgroundColor: '#faf9fc',
		height: 'calc(100% - 128px)',
	},
	credential: {
		marginTop: 32,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		[theme.breakpoints.down('sm')]: {
			display: 'block',
		},
	},
	card_root: {
		padding: 24,
	},
	notApproved: {
		color: '#0d47a1',
		fontWeight: 600,
	},
	approved: {
		color: '#43a047',
		fontWeight: 600,
	},
	rejected: {
		color: '#f44336',
		fontWeight: 600,
	},
}));

const Home = () => {
	const [detail, setDetail] = useState({});
	const [requestStatus, setStatus] = useState(null);
	const [email, setEmail] = useState(null);
	const alertContext = useContext(AlertContext);
	const appContext = useContext(AppContext);
	const did = appContext.did;
	const classes = useStyles();
	const Schema = Yup.object({
		firstName: Yup.string('Enter your first name').required(
			'First name is required'
		),
		lastName: Yup.string('Enter your last name').required(
			'Last name is required'
		),
		salary: Yup.string('Enter your salary').required('Salary name is required'),
		experience: Yup.string('Enter your experience in years').required(
			'Experience name is required'
		),
	});

	const getStatus = async () => {
		const citiesRef = db.collection('users');
		const snapshot = await citiesRef.get();
		snapshot.forEach((doc) => {
			if (doc.data().did === did) {
				setStatus(doc.data().requestStatus);
				setEmail(doc.data().email);
			}
		});

		const vcRequests = db.collection('vc-requests');
		const vcReqList = await vcRequests.get();
		vcReqList.forEach((doc) => {
			if (doc.data().did === did) {
				setDetail(doc.data());
			}
		});
	};

	const setReqStatus = async () => {
		const citiesRef = db.collection('users');
		const snapshot = await citiesRef.get();
		snapshot.forEach((doc) => {
			if (doc.data().did === did) {
				db.collection('users').doc(doc.id).update({
					requestStatus: 1,
				});
				setStatus(1);
			}
		});
	};

	useEffect(() => {
		getStatus();
	}, []);

	const status = () => {
		switch (requestStatus) {
			case 1:
				return <span className={classes.notApproved}>Not Approved</span>;

			case 2:
				return <span className={classes.approved}>Approved</span>;

			case 3:
				return <span className={classes.rejected}>Rejected</span>;

			default:
				break;
		}
	};

	return requestStatus === null ? (
		<Loader />
	) : (
		<>
			<section className={classes.root}>
				<Card className={classes.card_root}>
					<Typography variant="h5" className="mb-32">
						Application for experience certificate
					</Typography>

					{requestStatus === 0 ? (
						<Formik
							initialValues={{
								firstName: '',
								lastName: '',
								email: email,
								salary: '',
								experience: '',
								skills: '',
							}}
							validationSchema={Schema}
							onSubmit={async (values, { setSubmitting }) => {
								await db.collection('vc-requests').add({
									firstName: values.firstName,
									lastName: values.lastName,
									email: email,
									salary: values.salary,
									experience: values.experience,
									skills: values.skills,
									did: did,
									approved: 1,
									createdAt: new Date(),
								});
								setSubmitting(false);
								getStatus();
								setReqStatus();
								alertContext.toast(
									true,
									'Request sent sucessfully!',
									'success'
								);
							}}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								handleSubmit,
								isSubmitting,
								isValidating,
							}) => (
								<Form className={classes.form} onSubmit={handleSubmit}>
									<div className="row">
										<div className="input_box">
											<Input
												label="First name *"
												fullWidth
												value={values.firstName}
												onChange={handleChange}
												name="firstName"
												helperText={touched.firstName ? errors.firstName : ''}
												error={touched.firstName && Boolean(errors.firstName)}
											/>
										</div>
										<div className="input_box">
											<Input
												label="Last name *"
												fullWidth
												value={values.lastName}
												onChange={handleChange}
												name="lastName"
												helperText={touched.lastName ? errors.lastName : ''}
												error={touched.lastName && Boolean(errors.lastName)}
											/>
										</div>
									</div>
									<div className="row">
										<div className="input_box">
											<Input
												label="Company Email"
												fullWidth
												value={email}
												name="email"
												disabled
											/>
										</div>
										<div className="input_box">
											<Input
												label="Experience in years *"
												fullWidth
												type="number"
												value={values.experience}
												onChange={handleChange}
												name="experience"
												helperText={touched.experience ? errors.experience : ''}
												error={touched.experience && Boolean(errors.experience)}
											/>
										</div>
									</div>
									<div className="row">
										<div className="input_box">
											<Input
												label="Annual salary in Rs.*"
												fullWidth
												value={values.salary}
												onChange={handleChange}
												name="salary"
												helperText={touched.salary ? errors.salary : ''}
												error={touched.salary && Boolean(errors.salary)}
											/>
										</div>
										<div className="input_box">
											<Input
												label="Skills"
												fullWidth
												value={values.skills}
												onChange={handleChange}
												name="skills"
												helperText={touched.skills ? errors.skills : ''}
												error={touched.skills && Boolean(errors.skills)}
											/>
										</div>
									</div>
									<div className="row">
										<div className="button right_aligned">
											<Button
												fullWidth
												type="submit"
												disabled={!isValidating && isSubmitting}
											>
												Submit
											</Button>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					) : (
						<div className={classes.credential}>
							<div>
								<div className="row data">
									<Typography>Name</Typography>:
									<label>
										{detail.firstName} {detail.lastName}
									</label>
								</div>
								<div className="row data">
									<Typography>Status </Typography>:<label>{status()}</label>
								</div>
								{requestStatus === 2 && (
									<div className="row data">
										<Typography>Issued By</Typography>:
										<label>ABC Infotech</label>
									</div>
								)}
							</div>
						</div>
					)}
				</Card>
			</section>
		</>
	);
};

export default Home;
