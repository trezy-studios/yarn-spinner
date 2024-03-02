/* eslint-env node */

module.exports = {
	root: true,
	extends: [
		'@trezy-studios/eslint-config',
		'plugin:mocha/recommended',
	],
	overrides: [
		{
			files: ['test/**/*.test.js'],
			rules: {
				'no-unused-expressions': ['off'],
			},
		},
	],
}
