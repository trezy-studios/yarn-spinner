// Local imports
import { parseValue } from './parseValue.js'





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
		.map(parseValue)

	return {
		commandName,
		parameters: parsedParameters,
	}
}
