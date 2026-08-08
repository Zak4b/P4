import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { baseConfig } from "../../eslint.config.base.mjs";

const eslintConfig = defineConfig([
	// React/JSX, hooks, Next.js and jsx-a11y
	...nextVitals,
	...nextTs,
	...baseConfig,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		// Root-level config files aren't part of tsconfig.json's `include`,
		// so they can't be type-checked by parserOptions.project.
		"eslint.config.mjs",
		"postcss.config.mjs",
	]),
]);

export default eslintConfig;
