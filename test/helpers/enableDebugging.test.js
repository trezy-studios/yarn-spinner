// Module imports
import { expect } from 'chai'
import { fake } from 'sinon'





// Local imports
import { enableDebugging } from '../../src/index.js'
import { log } from '../../src/helpers/log.js'
import { state } from '../../src/helpers/state.js'





// Functions
function testLog() {
	log('log', 'message!')
}





// Variables
let globalLogFake
let globalLogOriginal = global.console.log





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
})
