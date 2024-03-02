// Module imports
import { expect } from 'chai'





// Local imports
import { Command } from '../../src/index.js'





describe('Command', function() {
	it('parses a command', function() {
		const command = new Command('<<stop>>')

		expect(command)
			.to.include({
				name: 'stop',
				original: '<<stop>>',
			})
			.and.to.have.property('parameters')
			.and.to.be.an.instanceOf(Set)
			.and.to.be.empty
	})

	it('parses a command with a string parameter', function() {
		const command = new Command('<<setSprite "anxious 01">>')
		const parameters = command.parameters.values()

		expect(command).to.include({
			name: 'setSprite',
			original: '<<setSprite "anxious 01">>',
		})
		expect(parameters.next().value).to.equal('anxious 01')
	})

	it('parses a command with a number parameter', function() {
		const command = new Command('<<wait 100>>')
		const parameters = command.parameters.values()

		expect(command).to.include({
			name: 'wait',
			original: '<<wait 100>>',
		})
		expect(parameters.next().value).to.equal(100)
	})

	it('parses a command with a boolean parameter', function() {
		const command = new Command('<<foo false>>')
		const parameters = command.parameters.values()

		expect(command).to.include({
			name: 'foo',
			original: '<<foo false>>',
		})
		expect(parameters.next().value).to.be.false
	})

	it('parses a command with multiple parameters', function() {
		const command = new Command('<<foo 100 foo \'bar baz\' true false>>')
		const parameters = command.parameters.values()

		expect(command).to.include({
			name: 'foo',
			original: '<<foo 100 foo \'bar baz\' true false>>',
		})
		expect(parameters.next().value).to.equal(100)
		expect(parameters.next().value).to.equal('foo')
		expect(parameters.next().value).to.equal('bar baz')
		expect(parameters.next().value).to.equal(true)
		expect(parameters.next().value).to.equal(false)
	})
})
