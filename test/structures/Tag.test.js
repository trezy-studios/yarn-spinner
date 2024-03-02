// Module imports
import { expect } from 'chai'





// Local imports
import { Tag } from '../../src/structures/Tag.js'





describe('Tag', function() {
	it('parses a tag with no value', function() {
		const mappedTag = new Tag('#key')

		expect(mappedTag).to.include({
			original: '#key',
			key: 'key',
			// eslint-disable-next-line no-undefined
			value: undefined,
		})
	})

	it('parses a tag with a value', function() {
		const mappedTag = new Tag('#key:value')

		expect(mappedTag).to.include({
			original: '#key:value',
			key: 'key',
			value: 'value',
		})
	})
})
