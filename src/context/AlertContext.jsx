/**
 * We have a commnot toast at the root of the application. This context it used for storing the message and status of the alert.
 * This component can we used to show any alerts in the application.
 */

import React from 'react';
import { createContext, useState } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [message, setMsg] = useState('');
	const [severity, setSeverity] = useState('info');

	const toast = (flag, msg, mode) => {
		setOpen(flag);
		setMsg(msg);
		setSeverity(mode === '' ? 'info' : mode);
	};

	return (
		<AlertContext.Provider
			value={{
				open,
				message,
				severity,
				toast,
				setOpen,
			}}
		>
			{children}
		</AlertContext.Provider>
	);
};
