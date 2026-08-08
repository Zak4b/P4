export const PREVIEW_SIZE = 200;

export const EDITOR_HEIGHT = { xs: 640, md: 560 };

export const OPTIONAL_COMPONENTS = ["hair", "earrings", "glasses", "facialHair"];
export const NONE = "none";

export const EDITOR_GROUPS: { title: string; keys: string[] }[] = [
	{
		title: "Visage",
		keys: [
			"baseColor",
			"ears",
			"eyebrows",
			"eyebrowsColor",
			"eyes",
			"eyesColor",
			"eyeShadowColor",
			"nose",
			"mouth",
			"mouthColor",
			"facialHair",
			"facialHairColor",
		],
	},
	{ title: "Cheveux", keys: ["hair", "hairColor"] },
	{ title: "Accessoires", keys: ["earrings", "earringColor", "glasses", "glassesColor"] },
	{ title: "Vêtements", keys: ["shirt", "shirtColor"] },
	{ title: "Fond", keys: ["backgroundColor", "backgroundType"] },
];

export const PROBABILITY_KEYS = [
	"hairProbability",
	"glassesProbability",
	"earringsProbability",
	"facialHairProbability",
];

export const COMPONENT_KEYS = [
	"base",
	"mouth",
	"eyebrows",
	"hair",
	"eyes",
	"nose",
	"ears",
	"shirt",
	"earrings",
	"glasses",
	"facialHair",
];

export const COLOR_KEYS = [
	"baseColor",
	"earringColor",
	"eyeShadowColor",
	"eyebrowsColor",
	"facialHairColor",
	"glassesColor",
	"hairColor",
	"mouthColor",
	"shirtColor",
	"eyesColor",
];

export const TRANSPARENT_SWATCH =
	"linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)";
