/**
 * File containing various API endpoints.
 * */

export const CLOUD_WALLET_BASE_URL =
	'https://cloud-wallet-api.prod.affinity-project.org/api/v1';
export const ISSUER_BASE_URL =
	'https://affinity-issuer.prod.affinity-project.org/api/v1';
export const VERIFIER_BASE_URL =
	'https://affinity-verifier.prod.affinity-project.org/api/v1';

export const BASE_URL = 'http://localhost:3000/';

export const endpoints = {
	SIGNUP: '/users/signup',
	LOGIN: '/users/login/',
	CONFIRM_SIGNUP: '/users/signup/confirm',

	BUILD_UNSIGNED: '/vc/build-unsigned',
	SIGN_VC: '/wallet/sign-credential',
	STORE_VC: '/wallet/credentials',

	DELETE_VC: '/wallet/credentials/',
	VERIFY_VC: '/verifier/verify-vcs',
};
