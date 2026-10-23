import { OptionsDescriptor } from "@dicebear/core";
import { micahColors, micahStyle } from "@/lib/avatar";

export type AvatarField = ReturnType<OptionsDescriptor["toJSON"]>[string];

export const avatarFields = new OptionsDescriptor(micahStyle).toJSON();

export const propertyLabels: Record<string, string> = {
	backgroundColor: "Couleur de fond",
	backgroundColorFill: "Type de fond",
	baseColor: "Couleur de peau",
	clothesVariant: "Haut",
	earringColor: "Couleur des boucles",
	earringsVariant: "Boucles d'oreille",
	earsVariant: "Oreilles",
	eyeShadowColor: "Couleur fard à paupières",
	eyebrowsVariant: "Sourcils",
	eyebrowsColor: "Couleur sourcils",
	eyesVariant: "Yeux",
	eyesColor: "Couleur des yeux",
	facialHairVariant: "Barbe / moustache",
	facialHairColor: "Couleur barbe",
	glassesVariant: "Lunettes",
	glassesColor: "Couleur lunettes",
	hairVariant: "Coiffure",
	hairColor: "Couleur des cheveux",
	mouthVariant: "Bouche",
	mouthColor: "Couleur bouche",
	noseVariant: "Nez",
	shirtColor: "Couleur du haut",
};

const FALLBACK_COLORS = ["transparent", "#000000", "#ffffff", "#77311d", "#ac6651", "#f9c9b6", "#9287ff", "#6bd9e9"];

/**
 * `Array.isArray` élargit un `unknown` en `any[]`, ce qui fait fuiter du `any`
 * dès qu'on lit un élément. Ce garde conserve `unknown` pour les éléments.
 */
export function isUnknownArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

/** `hairColor` → palette `hair` du style ; `backgroundColor` n'en a pas. */
export function getColorOptions(key: string): string[] {
	const palette = micahColors[key.replace(/Color$/, "")];
	return palette && palette.length > 0 ? palette : FALLBACK_COLORS;
}

export function getEnumOptions(field: AvatarField): string[] | null {
	return field.type === "enum" ? [...field.values] : null;
}
