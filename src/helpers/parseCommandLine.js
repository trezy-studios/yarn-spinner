/**
 * Parses a command line.
 *
 * @param {string} line The line to be parsed.
 * @returns {object} The parsed line.
 */
export function parseCommandLine(line) {
	const [,
		commandName,
		parameters = '',
	] = /^\s*<<(\w+)(?:\s(.*))?>>\s*$/u.exec(line.trim())

	const parsedParameters = parameters
		.split(' ')
		.filter(Boolean)
		.map(parameter => {
			if (!isNaN(parseFloat(parameter))) {
				return parseFloat(parameter)
			}

			if (['false', 'true'].includes(parameter)) {
				return Boolean(parameter)
			}

			return parameter
		})

	return {
		commandName,
		parameters: parsedParameters,
	}
}
