// Module imports
import { expect } from 'chai'
import { Parser as BBCodeParser } from 'bbcode-ast'





// Local imports
import {
	LINE_TYPES,
	parseLine,
} from '../../src/index.js'





// Constants
const COMMAND_STRING = '<<doAThing>>'
const DIALOG_STRING = 'Bob Borgenstein: Well howdy, partner!'
const OPTION_STRING = '-> This is an option'
const PARSER_STATE = {
	bbcodeParser: new BBCodeParser([], false, true),
	context: {},
	validMarkup: [],
}





describe('parseLine', function() {
	it('parses a line of dialog', function() {
		const parsedLine = parseLine(DIALOG_STRING, PARSER_STATE)

		expect(parsedLine)
			.to.have.own.property('id')
			.and.to.be.a.string

		expect(parsedLine.indentationLevel).to.equal(0)
		expect(parsedLine.type).to.equal(LINE_TYPES.DIALOG)
	})

	it('parses a line of dialog with indentation', function() {
		const parsedLine = parseLine(`\t\t${DIALOG_STRING}`, PARSER_STATE)

		expect(parsedLine.indentationLevel).to.equal(16)
	})

	it('parses a command line', function() {
		const parsedLine = parseLine(COMMAND_STRING, PARSER_STATE)

		expect(parsedLine.type).to.equal(LINE_TYPES.COMMAND)
	})

	it('parses a command line with indentation', function() {
		const parsedLine = parseLine(`\t\t${COMMAND_STRING}`, PARSER_STATE)

		expect(parsedLine.indentationLevel).to.equal(16)
	})

	it('parses a option line', function() {
		const parsedLine = parseLine(OPTION_STRING, PARSER_STATE)

		expect(parsedLine.type).to.equal(LINE_TYPES.OPTION)
	})

	it('parses a option line with indentation', function() {
		const parsedLine = parseLine(`\t\t${OPTION_STRING}`, PARSER_STATE)

		expect(parsedLine.indentationLevel).to.equal(16)
	})
})
