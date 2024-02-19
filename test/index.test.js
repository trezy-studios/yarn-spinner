// Module imports
import { expect } from 'chai'





// Local imports
import * as AllExports from '../src/index.js'





const EXPECTED_EXPORTS = [
	'default',
  'DEFAULT_MARKUP',
	'LINE_TYPES',
	'enableDebugging',
	'mapTag',
	'parseCommandLine',
	'parseDialogLine',
	'parseLine',
	'parseMeta',
	'parseNodeContent',
	'parseNodes',
	'parseOptionLine',
	'parseScript',
	'traverseBBCodeAST',
]

describe('exports', function () {
  EXPECTED_EXPORTS.forEach(exportName => {
    it(`includes \`${exportName}\``, function () {
      expect(AllExports).to.have.property(exportName)
    })
  })

  it('has no extraneous exports', function () {
    expect(Object.keys(AllExports).sort()).to.deep.equal(EXPECTED_EXPORTS.sort())
  })
})
