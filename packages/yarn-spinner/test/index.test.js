// Module imports
import { expect } from 'chai'





// Local imports
import * as AllExports from '../src/index.js'





const EXPECTED_EXPORTS = [
	'enableDebugging',
	'parseValue',

	'Character',
	'Command',
	'Dialog',
	'Line',
	'Node',
	'Script',
	'Tag',
	'Variable',
]

describe('exports', function() {
	// eslint-disable-next-line mocha/no-setup-in-describe
	EXPECTED_EXPORTS.forEach(exportName => {
		it(`includes \`${exportName}\``, function() {
			expect(AllExports).to.have.property(exportName)
		})
	})

	it('has no extraneous exports', function() {
		expect(Object.keys(AllExports).sort()).to.deep.equal(EXPECTED_EXPORTS.sort())
	})
})
