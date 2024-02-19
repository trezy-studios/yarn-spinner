// Module imports
import { expect } from 'chai'
import { Parser as BBCodeParser } from 'bbcode-ast'





// Local imports
import { parseOptionLine } from '../../src/index.js'





// Constants
const PARSER_STATE = {
	bbcodeParser: new BBCodeParser([], false, true),
	context: {},
	validMarkup: [],
}





describe('parseOptionLine', function() {
	it('parses an option line', function() {
		const optionString = 'This is an option!'
		const parsedOptionLine = parseOptionLine(`-> ${optionString}`, PARSER_STATE)

		expect(parsedOptionLine).to.have.own.property('ast')
		expect(parsedOptionLine.author).to.be.undefined
		expect(parsedOptionLine.body).to.equal(optionString)
		expect(parsedOptionLine.markup).to.deep.equal([])
		expect(parsedOptionLine.tags).to.deep.equal([])
	})
})
