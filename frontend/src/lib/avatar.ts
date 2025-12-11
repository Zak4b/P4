import { createAvatar } from "@dicebear/core";
import { avataaars, bottts, identicon, initials, lorelei, micah, openPeeps, personas, pixelArt, shapes, thumbs } from "@dicebear/collection";

const avatarStyles = {
	avataaars,
	bottts,
	identicon,
	initials,
	lorelei,
	micah,
	openPeeps,
	personas,
	pixelArt,
	shapes,
	thumbs,
} as const;

export type AvatarStyle = keyof typeof avatarStyles;

/**
 * Génère un avatar SVG pour un utilisateur basé sur son identifiant
 * @param seed - Identifiant unique (userId, email, etc.)
 * @param style - Style d'avatar (par défaut: "avataaars")
 * @returns SVG string de l'avatar
 */
export function generateAvatar(seed: string, style: AvatarStyle = "micah"): string {
	const avatarStyle = avatarStyles[style];
	const avatar = createAvatar<typeof avatarStyle>(avatarStyle, {
		seed: seed,
		size: 128,
	});

	return avatar.toString();
}

/**
 * Génère une URL d'avatar SVG en base64 pour utilisation dans les balises <img>
 * @param seed - Identifiant unique (userId, email, etc.)
 * @param style - Style d'avatar (par défaut: "avataaars")
 * @returns Data URL de l'avatar
 */
export function generateAvatarDataUrl(seed: string, style: AvatarStyle = "avataaars"): string {
	const svg = generateAvatar(seed, style);
	const base64 = Buffer.from(svg).toString("base64");
	return `data:image/svg+xml;base64,${base64}`;
}