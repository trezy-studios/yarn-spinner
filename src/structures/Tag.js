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

	/** @type {string | number | boolean} */
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
		const [key, value] = tagString
			.trim()
			.replace(/^#/, '')
			.split(':')

		this.#key = key
		this.#original = `#${key}`

		if (typeof value !== 'undefined') {
			this.#value = parseValue(value)
			this.#original += `:${value}`
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

	/** @returns {string | number | boolean} The value of the tag. */
	get value() {
		return this.#value
	}
}
