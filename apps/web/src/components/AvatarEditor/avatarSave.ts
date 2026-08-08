import { apiClient, ApiError } from "@/lib/api";
import type { AvatarOptions as AvatarSaveOptions } from "@p4/schemas/avatar";

export async function saveAvatarOptions(options: Record<string, unknown>): Promise<void> {
	// "size" est un paramètre de rendu de la preview, pas une caractéristique de l'avatar :
	const { size: _size, ...persisted } = options;
	await apiClient.saveAvatar(persisted as AvatarSaveOptions);
}

/** Transforme une erreur de sauvegarde en messages affichables à l'utilisateur. */
export function formatSaveErrors(err: unknown): string[] {
	if (err instanceof ApiError && err.issues?.length) {
		return err.issues.map((issue) => `${issue.path || "options"} : ${issue.message}`);
	}
	return [err instanceof Error ? err.message : "Erreur inconnue lors de l'enregistrement"];
}
