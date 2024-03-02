// Module imports
import { expect } from 'chai'
import { fake } from 'sinon'





// Local imports
import { enableDebugging } from '../../src/index.js'
import { log } from '../../src/helpers/log.js'
import { state } from '../../src/helpers/state.js'





// Functions
// eslint-disable-next-line jsdoc/require-jsdoc
function testLog() {
	log('log', 'message!')
}





// Constants
const globalLogOriginal = global.console.log





// Variables
/** @type {import('sinon').SinonSpy} */
let globalLogFake





describe('enableDebugging', function() {
	beforeEach(function() {
		globalLogFake = fake()
		global.console.log = globalLogFake
	})

	afterEach(function() {
		state.isDebuggingEnabled = false
		state.logger = global.console
		global.console.log = globalLogOriginal
	})

	it('enables debugging', function() {
		expect(state.isDebuggingEnabled).to.be.false
		testLog()
		expect(globalLogFake.calledOnce).to.be.false

		enableDebugging()
		expect(state.isDebuggingEnabled).to.be.true
		testLog()
		expect(globalLogFake.calledOnce).to.be.true
	})

	it('enables debugging with a custom logger object', function() {
		const customLogger = {
			log: fake(),
		}

		expect(state.logger).to.equal(global.console)

		enableDebugging(customLogger)
		expect(state.logger).to.equal(customLogger)

		testLog()
		expect(customLogger.log.calledOnce).to.be.true
	})

	it('enables debugging with a custom logger function', function() {
		const customLoggerFunction = fake()

		expect(state.logger).to.equal(global.console)

		enableDebugging(customLoggerFunction)
		expect(state.logger).to.not.equal(global.console)
		expect(state.logger.log).to.equal(customLoggerFunction)

		testLog()
		expect(customLoggerFunction.calledOnce).to.be.true
	})

	it('throws an error if provided with an invalid logger', function() {
		expect(() => {
			// @ts-expect-error We're forcing an error here by passing and invalid logger for the sake of the test.
			enableDebugging({})
		}).to.throw('`logger` must be a function, instead received ')
	})
})
