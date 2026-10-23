import { ApiError } from "@/lib/api/api_client";

/** Mot de passe actuel refusé par l'API (403) : l'erreur s'affiche dans la modale de confirmation */
export function isWrongPasswordError(error: unknown): boolean {
	return error instanceof ApiError && error.status === 403;
}

export const WRONG_PASSWORD_MESSAGE = "Mot de passe incorrect.";
