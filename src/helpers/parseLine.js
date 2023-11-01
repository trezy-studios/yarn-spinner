// Module imports
import { v4 as uuid } from 'uuid'





// Local imports
import { LINE_TYPES } from '../data/LINE_TYPES.js'
import { parseCommandLine } from './parseCommandLine.js'
import { parseDialogLine } from './parseDialogLine.js'
import { parseOptionLine } from './parseOptionLine.js'





/**
 * Parses a line from a content string.
 *
 * @param {string} line The line to be parsed.
 * @param {import('../types/ParseState.js').ParseState} parseState The state of the parser.
 * @returns {object} The parsed content.
 */
export function parseLine(line, parseState) {
	const [indentation] = /^(\s*)/u.exec(line)
	const indentationLevel = indentation
		.replace(/\t/gu, ' '.repeat(8))
		.length

	const trimmedLine = line.trim()

	let result = {
		id: uuid(),
		indentationLevel,
		type: LINE_TYPES.DIALOG,
	}

	if (/^\s*<</u.test(line)) {
		result.type = LINE_TYPES.COMMAND
	} else if (/^\s*->/u.test(line)) {
		result.type = LINE_TYPES.OPTION
	}

	switch (result.type) {
		case LINE_TYPES.COMMAND:
			result = {
				...result,
				...parseCommandLine(trimmedLine),
			}
			break

		case LINE_TYPES.OPTION:
			result = {
				...result,
				...parseOptionLine(trimmedLine, parseState),
			}
			break

		default:
			result = {
				...result,
				...parseDialogLine(trimmedLine, parseState),
			}
			break
	}

	return result
}
