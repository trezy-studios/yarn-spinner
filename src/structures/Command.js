// Local imports
import { parseValue } from '../helpers/parseValue.js'





/**
 * Manages a command line.
 */
export class Command {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {string} */
	#name

	/** @type {string} */
	#original

	/** @type {Set<import('../types/Value.js').Value>} */
	#parameters = new Set





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new CommandLine.
	 *
	 * @param {string} commandString The original, unparsed command string.
	 */
	constructor(commandString) {
		this.#original = commandString

		const [,
			name,
			parameters = '',
		// eslint-disable-next-line security/detect-unsafe-regex
		] = /** @type {RegExpExecArray} */ (/^<<(\w+)(?:\s(.*))?>>$/u.exec(commandString.trim()))

		this.#name = name
		this.#parseParameters(parameters)
	}

	/**
	 * Parses a paramter string.
	 *
	 * @param {string} parameterString The string of parameters from the command.
	 */
	#parseParameters(parameterString) {
		let parameterBuffer = []
		let isProcessingString = false
		let processingStringCharacter = null

		const parameterCharacters = parameterString.split('')

		for (const character of parameterCharacters) {
			if (/'|"/u.test(character)) {
				if (isProcessingString && (character === processingStringCharacter)) {
					isProcessingString = false
					processingStringCharacter = null
				} else {
					isProcessingString = true
					processingStringCharacter = character
				}
			} else if (/\s/u.test(character) && !isProcessingString) {
				this.#parameters.add(parseValue(parameterBuffer.join('')))
				parameterBuffer = []
			} else {
				parameterBuffer.push(character)
			}
		}

		if (parameterBuffer.length) {
			this.#parameters.add(parseValue(parameterBuffer.join('')))
		}
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {string} The name of the command. */
	get name() {
		return this.#name
	}

	/** @returns {string} The original, unparsed command string. */
	get original() {
		return this.#original
	}

	/** @returns {Set<import('../types/Value.js').Value>} All parameters that were passed to the command. */
	get parameters() {
		return this.#parameters
	}
}
