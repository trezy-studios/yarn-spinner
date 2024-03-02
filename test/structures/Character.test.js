// Module imports
import { expect } from 'chai'
import validate from 'uuid-validate'





// Local imports
import { Character } from '../../src/index.js'





describe('Character', function() {
	it('generates a new ID', function() {
		const character = new Character('Character')

		expect(validate(character.id)).to.be.true
	})

	it('adds the character to the global collection', function() {
		const character = new Character('Character')

		expect(Character.fromName('Character')).to.equal(character)
	})

	it('parses a string', function() {
		const character = new Character('Character')

		expect(character).to.include({ name: 'Character' })
	})

	it('parses a string with spaces', function() {
		const character = new Character('Bob Bergenstein')

		expect(character).to.include({ name: 'Bob Bergenstein' })
	})

	it('parses a string with special characters', function() {
		const character = new Character('Bob Bërgenstein_1')

		expect(character).to.include({ name: 'Bob Bërgenstein_1' })
	})
})
