// Local imports
import { mapTag } from './mapTag.js'
import { traverseBBCodeAST } from './traverseBBCodeAST.js'





/**
 * Parses a line of dialog.
 *
 * @param {string} line The line to be parsed.
 * @param {import('../types/ParseState.js').ParseState} parseState The state of the parser.
 * @returns {object} The parsed line.
 */
export function parseDialogLine(line, parseState) {
	const {
		bbcodeParser,
		validMarkup,
	} = parseState

	const [lineWithoutTags, ...tags] = line
		.trim()
		.split('#')
		.map(item => item.trim())

	const [, author, bodyString] = /^(?:(.*?):\s?)?(.+)$/u.exec(lineWithoutTags)

	const parsedBody = bbcodeParser.parse(bodyString)

	const {
		content: dialogLineContent,
		markup: dialogLineMarkup,
	} = traverseBBCodeAST(parsedBody, validMarkup)

	return {
		ast: parsedBody,
		author: author,
		body: dialogLineContent,
		markup: dialogLineMarkup,
		tags: tags.map(mapTag),
	}
}
