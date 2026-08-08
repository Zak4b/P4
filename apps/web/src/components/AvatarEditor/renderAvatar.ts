import { createAvatar } from "@dicebear/core";
import { micahStyle } from "@/lib/avatar";

/** Rendu SVG (string) d'un avatar micah pour un jeu d'options déjà résolu (voir resolveAvatarOptions). */
export function renderAvatarSvg(options: Record<string, unknown>): string {
	return createAvatar(micahStyle, options as Record<string, string | number>).toString();
}
