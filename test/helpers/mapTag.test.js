// Module imports
import { expect } from 'chai'
import { fake } from 'sinon'





// Local imports
import { mapTag } from '../../src/index.js'





describe('mapTag', function() {
	it('parses a tag with no value', function() {
		const tag = 'tagKey'

		const mappedTag = mapTag(tag)

		expect(mappedTag).to.deep.equal({
			key: 'tagKey',
			value: undefined,
			original: `#${tag}`,
		})
	})

	it('parses a tag with a value', function() {
		const tagKey = 'tagKey'
		const tagValue = 'tagValue'
		const tag = `${tagKey}:${tagValue}`

		const mappedTag = mapTag(tag)

		expect(mappedTag).to.deep.equal({
			key: tagKey,
			value: tagValue,
			original: `#${tag}`,
		})
	})
})
