import { makeStyles } from '@material-ui/core';
import { Formik, Form } from 'formik';
import React, { useContext, useState } from 'react';
import Button from '../components/widgets/Button';
import Input from '../components/widgets/Input';
import * as Yup from 'yup';
import { useHistory } from 'react-router';
import { routes } from '../utils/routes';
import { CLOUD_WALLET_BASE_URL, endpoints } from '../constants/endpoints';
import axios from 'axios';
import { AlertContext } from './../context/AlertContext';
import clsx from 'clsx';
import app from '../utils/firebase';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const db = app.firestore();

const useStyles = makeStyles((theme) => ({
	root: {
		height: 'inherit',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	form: {
		width: '80%',
		[theme.breakpoints.down('md')]: {
			width: '70%',
		},
		[theme.breakpoints.down('xs')]: {
			width: '90%',
		},
	},
	button: {
		margin: '32px 24px',
	},
	textCenter: {
		textAlign: 'center',
	},
	bold: {
		color: theme.palette.primary.main,
	},
}));

const Signup = (props) => {
	const classes = useStyles();
	const [confirmSignup, setConfirm] = useState(false);
	const [token, setToken] = useState('');
	const [email, setEmail] = useState('');
	const history = useHistory();
	const alertContext = useContext(AlertContext);
	const SignupSchema = Yup.object({
		email: Yup.string('Enter your email')
			.email('Enter a valid email')
			.required('Email is required'),
		password: Yup.string('')
			.min(8, 'Password must contain at least 8 characters')
			.required('Enter your password'),
		confirmPassword: Yup.string().oneOf(
			[Yup.ref('password'), null],
			'Passwords must match'
		),
	});

	return (
		<div className={classes.root}>
			{confirmSignup ? (
				<Formik
					initialValues={{ confirmationCode: '' }}
					onSubmit={async (values, { setSubmitting }) => {
						const data = {
							token: token,
							confirmationCode: values.confirmationCode,
							options: {
								didMethod: 'elem',
							},
						};

						const url = CLOUD_WALLET_BASE_URL + endpoints.CONFIRM_SIGNUP;
						await axios
							.post(url, data, {
								headers: {
									Accept: 'application/json',
									'Api-Key': process.env.REACT_APP_API_KEY_HASH,
								},
							})
							.then(async (response) => {
								localStorage.setItem('accessToken', response.data.accessToken);
								localStorage.setItem('email', email);

								alertContext.toast(true, 'Signup Successful!', 'success');

								const citiesRef = db.collection('users');
								const snapshot = await citiesRef.get();
								snapshot.forEach((doc) => {
									if (doc.data().email === email) {
										db.collection('users').doc(doc.id).update({
											did: response.data.did,
											requestStatus: 0,
										});
									}
								});

								setTimeout(() => {
									history.push(routes.HOME);
									setConfirm(false);
								}, 1500);
							})
							.catch((error) => {
								alertContext.toast(true, error.message, 'error');
								setSubmitting(false);
							});
					}}
				>
					{({
						values,
						handleChange,
						handleSubmit,
						isSubmitting,
						isValidating,
					}) => (
						<Form className={classes.form} onSubmit={handleSubmit}>
							<p className={clsx('center mb-24', classes.textCenter)}>
								A verification code has been sent to the email. Please enter the
								code to proceed.
							</p>
							<div className="input_box mb-24">
								<Input
									label="Code"
									variant="outlined"
									fullWidth
									value={values.confirmationCode}
									onChange={handleChange}
									name="confirmationCode"
								/>
							</div>
							<div className={classes.button}>
								<Button
									fullWidth
									type="submit"
									disabled={!isValidating && isSubmitting}
								>
									Submit
								</Button>
							</div>
						</Form>
					)}
				</Formik>
			) : (
				<Formik
					initialValues={{
						email: '',
						password: '',
						confirmPassword: '',
						isAdmin: false,
					}}
					validationSchema={SignupSchema}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						const data = {
							username: values.email,
							password: values.password,
							options: {
								didMethod: 'elem',
							},
							messageParameters: {
								message: 'string',
								subject: 'Sign',
								htmlMessage: 'string',
							},
						};

						const url = CLOUD_WALLET_BASE_URL + endpoints.SIGNUP;
						await axios
							.post(url, data, {
								headers: {
									Accept: 'application/json',
									'Api-Key': process.env.REACT_APP_API_KEY_HASH,
								},
							})
							.then((response) => {
								setToken(response.data);

								db.collection('users').add({
									email: values.email,
									did: '',
									isAdmin: values.isAdmin,
								});
								setEmail(values.email);
								resetForm();
								alertContext.toast(true, 'Signup Successful!', 'success');
								setTimeout(() => {
									setConfirm(true);
								}, 1500);
							})
							.catch((error) => {
								alertContext.toast(true, error.message, 'error');
								setSubmitting(false);
							});
					}}
				>
					{({
						values,
						errors,
						touched,
						setFieldValue,
						handleChange,
						handleSubmit,
						isSubmitting,
						isValidating,
					}) => (
						<form className={classes.form} onSubmit={handleSubmit}>
							<div className="input_box mb-24">
								<Input
									type="email"
									label="Email *"
									variant="outlined"
									fullWidth
									value={values.email}
									onChange={handleChange}
									name="email"
									helperText={touched.email ? errors.email : ''}
									error={touched.email && Boolean(errors.email)}
								/>
							</div>
							<div className="input_box mb-24">
								<Input
									type="password"
									label="Password *"
									variant="outlined"
									fullWidth
									value={values.password}
									onChange={handleChange}
									name="password"
									helperText={touched.password ? errors.password : ''}
									error={touched.password && Boolean(errors.password)}
								/>
							</div>
							<div className="input_box mb-24">
								<Input
									type="password"
									label="Confirm Password *"
									variant="outlined"
									fullWidth
									value={values.confirmPassword}
									onChange={handleChange}
									name="confirmPassword"
									helperText={
										touched.confirmPassword ? errors.confirmPassword : ''
									}
									error={
										touched.confirmPassword && Boolean(errors.confirmPassword)
									}
								/>
							</div>
							<div className="input_box mb-24">
								<FormControlLabel
									control={
										<Switch
											checked={values.isAdmin}
											onChange={() => setFieldValue('isAdmin', !values.isAdmin)}
											name="isAdmin"
											color="primary"
										/>
									}
									label="Issuer"
								/>
							</div>

							<div className={classes.button}>
								<Button
									fullWidth
									type="submit"
									disabled={!isValidating && isSubmitting}
								>
									Signup
								</Button>
								<p
									className="center click_me auth_redirect"
									onClick={() => history.push(routes.LOGIN)}
								>
									Already have an account?
									<strong className={clsx('ml-8', classes.bold)}>Login</strong>
								</p>
								<p
									className="center click_me auth_redirect"
									onClick={() => history.push(routes.VERIFY)}
								>
									Do you want to verify VC?
									<strong className={clsx('ml-8', classes.bold)}>Verify</strong>
								</p>
							</div>
						</form>
					)}
				</Formik>
			)}
		</div>
	);
};

export default Signup;
