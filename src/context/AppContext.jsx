import React, { useEffect } from 'react';
import { createContext, useState } from 'react';
import app from '../utils/firebase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [isAdmin, setAdmin] = useState(null);
	const [did, setDID] = useState(null);
	const email = localStorage.getItem('email');

	const checkIfAdmin = async () => {
		if (email) {
			const db = app.firestore();
			const users = db.collection('users');
			const userList = await users.get();
			userList.forEach((doc) => {
				if (doc.data().email === email) {
					setDID(doc.data().did);
					setAdmin(doc.data().isAdmin);
				}
			});
		} else {
			setAdmin(false);
			setDID('');
		}
	};

	useEffect(() => {
		checkIfAdmin();
	});

	return (
		<AppContext.Provider
			value={{
				did,
				isAdmin,
				email,
				setAdmin,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
