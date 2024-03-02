// Local imports
import { state } from './state.js'





/**
 * Enables debug logging.
 *
 * @param {import('../types/CustomLogger.js').CustomLogger | Function} [logger] The namespace to use for logging.
 */
export function enableDebugging(logger) {
	state.isDebuggingEnabled = true

	if (typeof logger === 'function') {
		state.logger = { log: logger }
	} else if (typeof logger?.log === 'function') {
		state.logger = logger
	} else if (typeof logger !== 'undefined') {
		throw new TypeError(`\`logger\` must be a function, instead received ${typeof logger}`)
	}
}
