// Module imports
import { expect } from 'chai'





// Local imports
import { parseMeta } from '../../src/index.js'





describe('parseMeta', function() {
	it('parses metadata', function() {
		const metadata = {
			string: 'value',
			boolean: true,
			number: 100,
		}

		const serialisedMetadata = Object.entries(metadata).reduce((accumulator, [key, value]) => {
			return accumulator + `${key}: ${value}\n`
		}, '')

		const parsedMeta = parseMeta(serialisedMetadata)

		expect(parsedMeta).to.deep.equal(metadata)
	})
})
