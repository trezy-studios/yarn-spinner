/**
 * Parses a string value into an appropriate type.
 *
 * @param {string} parameter
 * @returns {number | boolean | string}
 */
export function parseValue(parameter) {
	if (!isNaN(parseFloat(parameter))) {
		return parseFloat(parameter)
	}

	if (['false', 'true'].includes(parameter)) {
		return Boolean(parameter)
	}

	return parameter
}
