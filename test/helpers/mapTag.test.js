// Module imports
import { expect } from 'chai'





// Local imports
import { mapTag } from '../../src/index.js'
import { Tag } from '../../src/structures/Tag.js'





describe('mapTag', function() {
	it('parses a tag with no value', function() {
		const tag = 'tagKey'

		const mappedTag = mapTag(tag)

		expect(mappedTag).to.be.instanceOf(Tag)
		expect(mappedTag.original).to.equal(`#${tag}`)
		expect(mappedTag.key).to.equal(tag)
		expect(mappedTag.value).to.be.undefined
	})

	it('parses a tag with a value', function() {
		const tagKey = 'tagKey'
		const tagValue = 'tagValue'
		const tag = `${tagKey}:${tagValue}`

		const mappedTag = mapTag(tag)

		expect(mappedTag).to.be.instanceOf(Tag)
		expect(mappedTag.original).to.equal(`#${tag}`)
		expect(mappedTag.key).to.equal(tagKey)
		expect(mappedTag.value).to.equal(tagValue)
	})
})
