import { makeStyles } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useContext } from 'react';
import Button from '../components/widgets/Button';
import Input from '../components/widgets/Input';
import * as Yup from 'yup';
import { routes } from '../utils/routes';
import { useHistory } from 'react-router';
import { CLOUD_WALLET_BASE_URL, endpoints } from '../constants/endpoints';
import axios from 'axios';
import { AlertContext } from '../context/AlertContext';
import clsx from 'clsx';

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
	bold: {
		color: theme.palette.primary.main,
	},
}));

const Login = (props) => {
	const classes = useStyles();
	const history = useHistory();
	const alertContext = useContext(AlertContext);
	const LoginSchema = Yup.object({
		email: Yup.string('Enter your email')
			.email('Enter a valid email')
			.required('Email is required'),
		password: Yup.string('')
			.min(8, 'Password must contain at least 8 characters')
			.required('Enter your password'),
	});

	return (
		<div className={classes.root}>
			<Formik
				initialValues={{ email: '', password: '' }}
				validationSchema={LoginSchema}
				onSubmit={async (values, { setSubmitting }) => {
					const data = {
						username: values.email,
						password: values.password,
					};

					const url = CLOUD_WALLET_BASE_URL + endpoints.LOGIN;
					await axios
						.post(url, data, {
							headers: {
								Accept: 'application/json',
								'Api-Key': process.env.REACT_APP_API_KEY_HASH,
							},
						})
						.then((response) => {
							localStorage.setItem('email', values.email);
							localStorage.setItem('accessToken', response.data.accessToken);
							if (history.location.pathname !== '/login') {
								window.location.replace(
									routes.ACCEPTCREDENTIALS +
										history.location.pathname.split('/accept')[1] +
										history.location.search
								);
							} else {
								alertContext.toast(true, 'Login Successful!', 'success');
								setTimeout(() => {
									window.location.replace(routes.HOME);
								}, 2000);
							}
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
					handleChange,
					handleSubmit,
					isSubmitting,
					isValidating,
				}) => (
					<form className={classes.form} onSubmit={handleSubmit}>
						<div className="input_box mb-24">
							<Input
								type="email"
								variant="outlined"
								label="Email *"
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

						<div className={classes.button}>
							<Button
								fullWidth
								type="submit"
								disabled={!isValidating && isSubmitting}
							>
								Login
							</Button>
							<p
								className="center click_me auth_redirect"
								onClick={() => history.push(routes.SIGNUP)}
							>
								Don't have an account?
								<strong className={clsx('ml-8', classes.bold)}>Signup</strong>
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
		</div>
	);
};

export default Login;
