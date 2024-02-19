// Local imports
import { parseLine } from './parseLine.js'





/**
 * Compiles a content string.
 *
 * @param {string} contentString The content string.
 * @param {import('../types/ParseState.js').ParseState} parseState The state of the parser.
 * @returns {object} The parsed content.
 */
export function parseNodeContent(contentString, parseState) {
	return contentString
		.split(/\n/)
		.map(line => line.trim())
		.filter(Boolean)
		.map(line => parseLine(line, parseState))
}
