import { createAvatar } from "@dicebear/core";
import { create, meta, schema } from "@dicebear/micah";

const micahStyle = { create, meta, schema };

/**
 * Génère une data URL d'avatar Dicebear (style micah) pour utilisation dans <img src>
 * @param seed - Identifiant unique (login, userId, etc.)
 * @returns Data URL de l'avatar SVG
 */
export function getAvatarDataUrl(seed: string): string {
	const svg = createAvatar(micahStyle, {
		seed,
		size: 128,
	}).toString();
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
