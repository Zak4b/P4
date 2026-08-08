import tseslint from "typescript-eslint";
import { baseConfig } from "../../eslint.config.base.mjs";

export default tseslint.config(
	...baseConfig,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-unsafe-assignment": "warn",
			"@typescript-eslint/no-unsafe-member-access": "warn",
			"@typescript-eslint/no-unsafe-call": "warn",
			"@typescript-eslint/no-unsafe-return": "warn",
			"@typescript-eslint/no-unsafe-argument": "warn",
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/no-misused-promises": "warn",
			"@typescript-eslint/no-unnecessary-type-assertion": "warn",
			"@typescript-eslint/no-redundant-type-constituents": "warn",
		},
	},
	{
		ignores: ["node_modules/**", "dist/**", "*.js", "*.mjs", "prisma/**", "scripts/**"],
	},
);
