// Métadonnées écrites à la main pour la présentation de l'éditeur : dans quel onglet ranger
// chaque clé, et comment l'étiqueter. Le schéma dicebear ne donne aucune de ces informations —
// leur propre éditeur n'a d'ailleurs pas cette notion de regroupement (un onglet par option, voir
// apps/editor/src/utils/getSchemaOptions.ts sur github.com/dicebear/dicebear) — donc tout ici doit
// être tenu à jour à la main quand une clé est ajoutée. Pour les listes dérivées automatiquement
// du schéma (quelles clés sont des couleurs/composants), voir fields.ts.

import { avatarSchemaProperties } from "./fieldOptions";
import { COLOR_KEYS, COMPONENT_KEYS } from "./fields";

export type FieldTag = "face" | "hair" | "accessories" | "clothing" | "background" | "other";

const GROUP_FIELDS: Record<Exclude<FieldTag, "other">, string[]> = {
	face: [
		"base",
		"baseColor",
		"ears",
		"eyes",
		"eyesColor",
		"eyeShadowColor",
		"nose",
		"mouth",
		"mouthColor",
		"facialHair",
		"facialHairColor",
	],
	hair: ["hair", "hairColor", "eyebrows", "eyebrowsColor"],
	accessories: ["earrings", "earringColor", "glasses", "glassesColor"],
	clothing: ["shirt", "shirtColor"],
	background: ["backgroundColor", "backgroundType"],
};

// Filet de sécurité : toute clé affichable (couleur ou variante) qu'on aurait oublié de ranger
// dans une famille ci-dessus (ex. si dicebear ajoute une option) atterrit dans "Autre" plutôt que
// de disparaître silencieusement de l'éditeur.
const ASSIGNED_FIELDS = new Set(Object.values(GROUP_FIELDS).flat());
const OTHER_FIELDS = [...COMPONENT_KEYS, ...COLOR_KEYS].filter((key) => !ASSIGNED_FIELDS.has(key));

const RESOLVED_FIELDS: Record<FieldTag, string[]> = { ...GROUP_FIELDS, other: OTHER_FIELDS };

const GROUP_TITLES: Record<FieldTag, string> = {
	face: "Visage",
	hair: "Cheveux",
	accessories: "Accessoires",
	clothing: "Vêtements",
	background: "Fond",
	other: "Autre",
};

export const propertyLabels: Record<string, string> = {
	backgroundColor: "Couleur de fond",
	backgroundType: "Type de fond",
	base: "Base",
	baseColor: "Couleur de peau",
	earringColor: "Couleur des boucles",
	earrings: "Boucles d'oreille",
	ears: "Oreilles",
	eyeShadowColor: "Couleur fard à paupières",
	eyebrows: "Sourcils",
	eyebrowsColor: "Couleur sourcils",
	eyes: "Yeux",
	eyesColor: "Couleur des yeux",
	facialHair: "Barbe / moustache",
	facialHairColor: "Couleur barbe",
	glasses: "Lunettes",
	glassesColor: "Couleur lunettes",
	hair: "Coiffure",
	hairColor: "Couleur des cheveux",
	mouth: "Bouche",
	mouthColor: "Couleur bouche",
	nose: "Nez",
	shirt: "Haut",
	shirtColor: "Couleur du haut",
};

export const EDITOR_GROUPS: { title: string; keys: string[] }[] = (Object.keys(GROUP_TITLES) as FieldTag[]).map(
	(tag) => ({
		title: GROUP_TITLES[tag],
		keys: RESOLVED_FIELDS[tag],
	}),
);

// EDITOR_GROUPS et avatarSchemaProperties sont tous deux figés au chargement du module : pas
// besoin de recalculer ça par instance, encore moins de le mémoïser dans le composant.
export const VISIBLE_GROUPS = EDITOR_GROUPS.map((group) => ({
	...group,
	keys: group.keys.filter((k) => avatarSchemaProperties[k]),
})).filter((group) => group.keys.length > 0);
