// Module imports
import { expect } from 'chai'





// Local imports
import { Dialog } from '../../src/index.js'





describe('Dialog', function() {
	it('parses a string', function() {
		const dialog = new Dialog('This is a string of dialog.')

		expect(dialog).to.have.property('body', 'This is a string of dialog.')
		expect(dialog).to.have.property('original', 'This is a string of dialog.')
	})

	it('parses a string with a void markup', function() {
		const dialog = new Dialog('This is a string of dialog with a [void /] markup.')
		const markup = dialog.markup.values().next().value

		expect(dialog).to.have.property('body', 'This is a string of dialog with a markup.')
		expect(dialog.markup.size).to.equal(1)

		expect(markup).to.include({
			index: 34,
			length: 0,
			name: 'void',
		})
		expect(markup.parameters.size).to.equal(0)
	})

	it('parses a string with a basic markup', function() {
		const dialog = new Dialog('This is a string of [bounce]bouncing[/bounce] dialog.')
		const markup = dialog.markup.values().next().value

		expect(dialog).to.have.property('body', 'This is a string of bouncing dialog.')
		expect(dialog.markup.size).to.equal(1)

		expect(markup).to.include({
			index: 20,
			length: 8,
			name: 'bounce',
		})
		expect(markup.parameters.size).to.equal(0)
	})

	it('parses a string with markup with parameters', function() {
		const dialog = new Dialog('This is a string of [bounce speed=5]bouncing[/bounce] dialog.')
		const markup = dialog.markup.values().next().value

		expect(dialog).to.have.property('body', 'This is a string of bouncing dialog.')
		expect(dialog.markup.size).to.equal(1)

		expect(markup).to.include({
			index: 20,
			length: 8,
			name: 'bounce',
		})
		expect(markup.parameters.size).to.equal(1)
		expect(markup.parameters.get('speed')).to.equal(5)
	})

	it('parses a string with markup with a boolean parameter', function() {
		const dialog = new Dialog('This is a string of [bounce vertical]bouncing[/bounce] dialog.')
		const markup = dialog.markup.values().next().value

		expect(dialog).to.have.property('body', 'This is a string of bouncing dialog.')
		expect(dialog.markup.size).to.equal(1)

		expect(markup).to.include({
			index: 20,
			length: 8,
			name: 'bounce',
		})
		expect(markup.parameters.size).to.equal(1)
		expect(markup.parameters.get('vertical')).to.be.true
	})

	it('parses a string with markup with a shorthand parameter', function() {
		const dialog = new Dialog('This is a string of [bounce=5]bouncing[/bounce] dialog.')
		const markup = dialog.markup.values().next().value

		expect(dialog).to.have.property('body', 'This is a string of bouncing dialog.')
		expect(dialog.markup.size).to.equal(1)

		expect(markup).to.include({
			index: 20,
			length: 8,
			name: 'bounce',
		})
		expect(markup.parameters.size).to.equal(1)
		expect(markup.parameters.get('bounce')).to.equal(5)
	})

	it('parses a string with multiple markups', function() {
		const dialog = new Dialog('This is a [red]string of [bounce]bouncing[/bounce][/red] dialog.')
		const markup = dialog.markup.values()

		expect(dialog).to.have.property('body', 'This is a string of bouncing dialog.')
		expect(dialog.markup.size).to.equal(2)

		expect(markup.next().value).to.include({
			index: 10,
			length: 18,
			name: 'red',
		})
		expect(markup.next().value).to.include({
			index: 20,
			length: 8,
			name: 'bounce',
		})
	})

	it('parses a string with multiple markups and a close all markup', function() {
		const dialog = new Dialog('This is a [red]string of [bounce]bouncing[/] dialog.')
		const markup = dialog.markup.values()

		expect(dialog).to.have.property('body', 'This is a string of bouncing dialog.')
		expect(dialog.markup.size).to.equal(2)

		expect(markup.next().value).to.include({
			index: 10,
			length: 18,
			name: 'red',
		})
		expect(markup.next().value).to.include({
			index: 20,
			length: 8,
			name: 'bounce',
		})
	})
})
