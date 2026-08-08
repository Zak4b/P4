import axios, { AxiosError } from "axios";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";
export const API_BASE = `${BACKEND_URL}/api`;

export const apiClient = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	(error: unknown) => {
		if (error instanceof AxiosError) {
			const body = error.response?.data as { error?: string } | undefined;
			return Promise.reject(new Error(body?.error ?? error.message ?? "Request failed"));
		}
		return Promise.reject(error instanceof Error ? error : new Error(String(error)));
	},
);
