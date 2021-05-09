import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { AlertContext } from '../../context/AlertContext';
import MuiAlert from '@material-ui/lab/Alert';

const Toast = (props) => {
	const alertContext = useContext(AlertContext);

	return (
		<Snackbar
			open={alertContext.open}
			autoHideDuration={2500}
			onClose={() => alertContext.setOpen(false)}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<MuiAlert
				elevation={6}
				variant="filled"
				onClose={() => alertContext.setOpen(false)}
				severity={alertContext.severity}
			>
				{alertContext.message}
			</MuiAlert>
		</Snackbar>
	);
};

export default Toast;
