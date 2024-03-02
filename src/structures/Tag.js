// Local imports
import { parseValue } from '../helpers/parseValue.js'





/**
 * Manages a tag.
 */
export class Tag {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {string} */
	#key

	/** @type {string} */
	#original

	/** @type {import('../types/Value.js').Value | undefined} */
	#value





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new tag.
	 *
	 * @param {string} tagString The original tag.
	 */
	constructor(tagString) {
		this.#original = tagString

		const [key, value] = tagString
			.trim()
			.replace(/^#/u, '')
			.split(':')

		this.#key = key

		if (typeof value !== 'undefined') {
			this.#value = parseValue(value)
		}
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {string} The key of the tag. */
	get key() {
		return this.#key
	}

	/** @returns {string} The original, unparsed tag. */
	get original() {
		return this.#original
	}

	/** @returns {import('../types/Value.js').Value | undefined} The value of the tag. */
	get value() {
		return this.#value
	}
}
