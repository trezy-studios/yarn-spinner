/**
 * Parses a string value into an appropriate type.
 *
 * @param {string} parameterString The initial string to be parsed to a value.
 * @returns {import('../types/Value.js').Value} The parsed value.
 */
export function parseValue(parameterString) {
	if (/^\d+$/u.test(parameterString)) {
		return parseFloat(parameterString)
	}

	if (parameterString === 'true') {
		return true
	} else if (parameterString === 'false') {
		return false
	}

	return parameterString
}
