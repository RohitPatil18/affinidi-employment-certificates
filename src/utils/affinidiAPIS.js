import axios from 'axios';
import { routes } from './routes';
import {
	CLOUD_WALLET_BASE_URL,
	endpoints,
	ISSUER_BASE_URL,
	VERIFIER_BASE_URL,
} from './../constants/endpoints';

axios.interceptors.response.use(
	(response) => {
		if (response.status === 401) {
			alert('You are not authorized or JWT token expired!');
			window.localStorage.clear();
			window.sessionStorage.clear();
			window.location.replace(routes.LOGIN);
			return;
		}
		return response;
	},
	(error) => {
		return Promise.reject(error.response);
	}
);

export const generateVC = (detail) => {
	return {
		type: 'EmploymentCredentialPersonV1',
		data: {
			'@type': ['Person', 'PersonE', 'EmploymentPerson'],
			worksFor: {
				'@type': ['EmployeeRole', 'PersonEmployeeRoleE'],
				reference: {
					'@type': 'ContactPoint',
					name: 'Admin',
					email: localStorage.getItem('email'),
				},
				skills: detail.skills.split(','),
				offerLetter: detail.email,
				experienceLetter: detail.experience,
				worksFor: {
					'@type': ['Organization', 'OrganizationE'],
					name: 'ABC Infotech',
				},
				salary: {
					'@type': ['Salary'],
					gross: {
						'@type': 'MonetaryAmount',
						value: detail.salary,
						currency: 'INR',
					},
					net: {
						'@type': 'MonetaryAmount',
						value: detail.salary,
						currency: 'INR',
					},
					frequency: 'Yearly',
				},
			},
			name: detail.firstName + detail.lastName,
		},
		holderDid: detail.did,
	};
};

const getHeaders = (auth) => {
	let headers = {
		'Content-Type': 'application/json',
		'Api-Key': process.env.REACT_APP_API_KEY_HASH,
	};

	if (auth) {
		headers['Authorization'] = localStorage.getItem('accessToken');
	}

	return headers;
};

export default class ApiService {
	static async buildUnsignedVC(data) {
		const url = ISSUER_BASE_URL + endpoints.BUILD_UNSIGNED;

		const response = await axios
			.post(url, data, {
				headers: getHeaders(),
			})
			.then((response) => {
				return response.data;
			});

		return response;
	}

	static async signVC(data) {
		const url = CLOUD_WALLET_BASE_URL + endpoints.SIGN_VC;

		const response = await axios
			.post(url, data, {
				headers: getHeaders(true),
			})
			.then((response) => {
				return response.data;
			});

		return response;
	}

	static async storeVC(data) {
		const url = CLOUD_WALLET_BASE_URL + endpoints.STORE_VC;

		const response = await axios
			.post(url, data, {
				headers: getHeaders(true),
			})
			.then((response) => {
				return response.data;
			});

		return response;
	}

	static async shareCredentials(data) {
		const url =
			CLOUD_WALLET_BASE_URL + endpoints.STORE_VC + '/' + data + '/share';

		// Used 0 as VC validity for 100 years
		const response = await axios
			.post(
				url,
				{
					ttl: '0',
				},
				{
					headers: getHeaders(true),
				}
			)
			.then((response) => {
				return response.data;
			});

		return response;
	}

	static async getAllCredentials(data) {
		const url = CLOUD_WALLET_BASE_URL + endpoints.STORE_VC;

		const response = await axios
			.get(url, {
				headers: getHeaders(true),
			})
			.then((response) => {
				return response.data;
			});

		return response;
	}

	static async deleteVC(data) {
		const url = CLOUD_WALLET_BASE_URL + endpoints.DELETE_VC + data;

		const response = await axios
			.delete(url, {
				headers: getHeaders(true),
			})
			.then((response) => {
				return response.data;
			});

		return response;
	}

	static async verifyVC(data) {
		const url = VERIFIER_BASE_URL + endpoints.VERIFY_VC;

		const response = await axios
			.post(url, data, {
				headers: getHeaders(),
			})
			.then((response) => {
				return response.data;
			});

		return response;
	}
}
