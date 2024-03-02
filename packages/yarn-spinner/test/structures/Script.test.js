// Module imports
import { expect } from 'chai'





// Local imports
import { Script } from '../../src/index.js'





// Types
/**
 * @typedef {import('../../src/structures/Line.js').Line} Line
 */





describe('Script', function() {
	it('parses a script with a single node', function() {
		const scriptString = `
			title: Node Title
			---
			NPC Name: Oh, hi!
			Player: Hello!
			===`
			.replace(/^\t{3}/gmu, '')
		const script = new Script(scriptString)

		expect(script).to.have.property('nodes')
			.and.to.be.instanceOf(Map)
		expect(script).to.have.property('original', scriptString)
	})

	it('parses a script with multiple nodes', function() {
		const scriptString = `
			title: Node 1
			---
			NPC Name: Oh, hi!
			Player: Hello!
			===

			title: Node 2
			---
			NPC Name: Goodbye.
			Player: Goodbye!
			===`
			.replace(/^\t{3}/gmu, '')
		const script = new Script(scriptString)

		expect(script).to.have.property('nodes')
			.and.to.be.instanceOf(Map)
		expect(script).to.have.property('original', scriptString)
	})

	it('allows script traversal by previous line', function() {
		const scriptString = `
			title: Node1
			---
			NPC Name: Oh, hi!
			Player: Hello!
			<<jump Node2>>
			-> Option 1
				Blep.
			-> Option 2
			-> Option 3
			===`
			.replace(/^\t{3}/gmu, '')
		const script = new Script(scriptString)

		const lines = [
			'NPC Name: Oh, hi!',
			'Player: Hello!',
			'<<jump Node2>>',
			'-> Option 1',
			'-> Option 2',
			'-> Option 3',
		]

		/** @type {Line} */
		let currentLine

		lines.forEach(line => {
			currentLine = /** @type {Line} */ (script.getNextLine(currentLine))
			expect(currentLine).to.have.property('original', line)
		})
	})

	it('allows script traversal by previous line ID', function() {
		const scriptString = `
			title: Node1
			---
			NPC Name: Oh, hi!
			Player: Hello!
			<<jump Node2>>
			-> Option 1
				Blep.
			-> Option 2
			-> Option 3
			===`
			.replace(/^\t{3}/gmu, '')
		const script = new Script(scriptString)

		const lines = [
			'NPC Name: Oh, hi!',
			'Player: Hello!',
			'<<jump Node2>>',
			'-> Option 1',
			'-> Option 2',
			'-> Option 3',
		]

		/** @type {string} */
		let currentLineID

		lines.forEach(line => {
			const currentLine = /** @type {Line} */ (script.getNextLine(currentLineID))
			currentLineID = currentLine.id
			expect(currentLine).to.have.property('original', line)
		})
	})
})
