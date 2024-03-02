// Module imports
import { expect } from 'chai'
import { fake } from 'sinon'





// Local imports
import { enableDebugging } from '../../src/index.js'
import { log } from '../../src/helpers/log.js'





// Constants
const TEST_MESSAGE = 'message!'





// Constants
const globalLogOriginal = global.console.log





// Variables
/** @type {import('sinon').SinonSpy} */
let globalLogFake





describe('log', function() {
	beforeEach(function() {
		globalLogFake = fake()
		global.console.log = globalLogFake
	})

	after(function() {
		global.console.log = globalLogOriginal
	})

	it('doesn\'t log anything if debugging is disabled', function() {
		log('log', TEST_MESSAGE)

		expect(globalLogFake.calledOnce).to.be.false
	})

	it('logs if debugging is enabled', function() {
		enableDebugging()

		log('log', TEST_MESSAGE)

		expect(globalLogFake.calledOnce).to.be.true
	})

	it('falls back to using the `log` method if an invalid log type is provided', function() {
		enableDebugging()

		log('florglspern', TEST_MESSAGE)

		expect(globalLogFake.calledOnce).to.be.true
	})
})
