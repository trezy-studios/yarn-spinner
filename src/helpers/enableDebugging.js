// Local imports
import { state } from './state.js'





/**
 * Enables debug logging.
 *
 * @param {Console} [logger] The namespace to use for logging.
 */
export function enableDebugging(logger) {
	state.isDebuggingEnabled = true

	if (typeof logger === 'function') {
		state.logger = logger
	} else if (typeof logger !== 'undefined') {
		throw new TypeError(`\`logger\` must be a function, instead received ${typeof logger}`)
	}
}
