import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { ToastContext } from 'context/ToastContext';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
	const toastContext = useContext(ToastContext);

	return (
		<Snackbar
			open={toastContext.open}
			autoHideDuration={2500}
			onClose={() => toastContext.setOpen(false)}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<MuiAlert
				elevation={6}
				variant="filled"
				onClose={() => toastContext.setOpen(false)}
				severity={toastContext.severity}
			>
				{toastContext.message}
			</MuiAlert>
		</Snackbar>
	);
};

export default Alert;
