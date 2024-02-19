// Module imports
import { expect } from 'chai'





// Local imports
import { parseCommandLine } from '../../src/index.js'





describe('parseCommandLine', function() {
	it('parses a command with no parameters', function() {
		const commandName = 'wait'
		const commandLine = `<<${commandName}>>`

		const parsedCommandLine = parseCommandLine(commandLine)

		expect(parsedCommandLine).to.deep.equal({
			commandName,
			parameters: [],
		})
	})

	it('parses a command with a string parameter', function() {
		const commandName = 'wait'
		const parameters = ['foobar']
		const commandLine = `<<${commandName} ${parameters.join(' ')}>>`

		const parsedCommandLine = parseCommandLine(commandLine)

		expect(parsedCommandLine).to.deep.equal({
			commandName,
			parameters,
		})
	})

	it('parses a command with a number parameter', function() {
		const commandName = 'wait'
		const parameters = [100]
		const commandLine = `<<${commandName} ${parameters.join(' ')}>>`

		const parsedCommandLine = parseCommandLine(commandLine)

		expect(parsedCommandLine).to.deep.equal({
			commandName,
			parameters,
		})
	})

	it('parses a command with a boolean parameter', function() {
		const commandName = 'wait'
		const parameters = [true]
		const commandLine = `<<${commandName} ${parameters.join(' ')}>>`

		const parsedCommandLine = parseCommandLine(commandLine)

		expect(parsedCommandLine).to.deep.equal({
			commandName,
			parameters,
		})
	})

	it('parses a command with many parameters of varied types', function() {
		const commandName = 'wait'
		const parameters = [
			100,
			true,
			'foobar',
		]

		const commandLine = `<<${commandName} ${parameters.join(' ')}>>`
		const parsedCommandLine = parseCommandLine(commandLine)

		expect(parsedCommandLine).to.deep.equal({
			commandName,
			parameters,
		})
	})
})
