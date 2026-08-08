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
	},
	{
		ignores: ["node_modules/**", "dist/**", "*.js", "*.mjs"],
	}
);
