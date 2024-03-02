// Local imports
import { state } from './state.js'





/**
 * Logs a message using the provided logging namespace.
 *
 * @param {string} type The type of log to print, e.g. `log`, `info`, `warn`, `error`, etc.
 * @param {...*} args Arguments to be passed to the logger.
 */
export function log(type, ...args) {
	if (!state.isDebuggingEnabled) {
		return
	}

	// console.log(type, args)

	if (type in state.logger) {
		state.logger[type](...args)
	} else {
		state.logger.log(type, ...args)
	}
}
