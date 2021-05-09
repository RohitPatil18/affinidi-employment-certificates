import React, { useEffect, useState } from 'react';
import Loader from '../components/widgets/Loader';
import { useHistory } from 'react-router';
import { routes } from '../utils/routes';

const Auth = ({ children }) => {
	const [isLoggedIn, setLogin] = useState(false);
	const history = useHistory();

	useEffect(() => {
		if (localStorage.getItem('accessToken')) {
			if (history.location.pathname === routes.LOGIN) {
				history.push(routes.HOME);
			}
		} else {
			history.push(routes.LOGIN);
		}
		setLogin(true);
	}, [history]);

	return <>{isLoggedIn ? <>{children}</> : <Loader />}</>;
};

export default Auth;
