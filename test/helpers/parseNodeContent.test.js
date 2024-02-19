// Module imports
import { expect } from 'chai'
import { Parser as BBCodeParser } from 'bbcode-ast'





// Local imports
import { parseNodeContent } from '../../src/index.js'





// Constants
const PARSER_STATE = {
	bbcodeParser: new BBCodeParser([], false, true),
	context: {},
	validMarkup: [],
}





describe('parseNodeContent', function() {
	it('parses a node\'s content', function() {
		const content = `
			Bob Borgenstein: Well howdy, partner!

			-> Hello!
				<<jump hello>>
			-> Hi
				<<jump hi>>
			-> Nope.
				<<stop>>
		`

		const parsedNodeContent = parseNodeContent(content, PARSER_STATE)

		expect(parsedNodeContent).to.have.lengthOf(7)
	})
})
