// Local imports
import { parseCommandLine } from './parseCommandLine.js'
import { parseDialogLine } from './parseDialogLine.js'





/**
 * Parses an option line.
 *
 * @param {string} line The line to be parsed.
 * @param {import('../types/ParseState.js').ParseState} parseState The state of the parser.
 * @returns {object} The parsed line.
 */
export function parseOptionLine(line, parseState) {
	const [, dialog, command] = /^\s*->\s*(.*?)(?:\s*<<(.+?)>>)?$/gu.exec(line.trim())

	let result = {
		...parseDialogLine(dialog, parseState),
	}

	if (command) {
		result = {
			...result,
			...parseCommandLine(command),
		}
	}

	return result
}
