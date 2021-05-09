import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from './auth/Auth';
import Loader from './components/widgets/Loader';
import Toast from './components/widgets/Toast';
import { AlertProvider } from './context/AlertContext';
import { AppProvider } from './context/AppContext';
import { routes } from './utils/routes';
import { theme } from './styles/theme';
import { ThemeProvider } from '@material-ui/styles';

const LazyLayout = React.lazy(() => import('./components/Layout'));
const LazyAuthLayout = React.lazy(() => import('./auth/AuthLayout'));
const LazyVerify = React.lazy(() => import('./components/verifier/VerifyVC'));

function App() {
	return (
		<div className="App">
			<AppProvider>
				<BrowserRouter>
					<Suspense fallback={<Loader />}>
						<Switch>
							<AlertProvider>
								<Route path={routes.ACCEPT} component={LazyAuthLayout} />
								<Route path={routes.VERIFY} exact component={LazyVerify} />
								<Auth>
									<ThemeProvider theme={theme}>
										<Toast />
										<Route
											path={routes.LOGIN}
											exact
											component={LazyAuthLayout}
										/>
										<Route
											path={routes.SIGNUP}
											exact
											component={LazyAuthLayout}
										/>
										<Route path={routes.HOME} exact component={LazyLayout} />
										<Route path={routes.WALLET} exact component={LazyLayout} />
										<Route
											path={routes.ACCEPTCREDENTIALS}
											component={LazyLayout}
										/>
										<Route path={routes.DETAIL} component={LazyLayout} />
									</ThemeProvider>
								</Auth>
							</AlertProvider>
						</Switch>
					</Suspense>
				</BrowserRouter>
			</AppProvider>
		</div>
	);
}

export default App;
