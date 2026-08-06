import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		ignores: ['node_modules/**', 'dist/**', '*.js', '*.mjs'],
	}
);
