// Module imports
import { expect } from 'chai'





// Local imports
import { Variable } from '../../src/index.js'





describe('Variable', function() {
	it('parses a string', function() {
		const variable = new Variable('{$variable}')

		expect(variable).to.include({
			name: 'variable',
			original: '{$variable}',
		})
	})
})
