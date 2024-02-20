// Local imports
import { LINE_TYPES } from '../data/LINE_TYPES.js'





/**
 * Manages a markup.
 */
export class Markup {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {number} */
	#length

	/** @type {number} */
	#position

	/** @type {LINE_TYPES} */
	#type





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new tag.
	 *
	 * @param {number} length The length of the markup contents.
	 * @param {number} position The starting position of the markup in the string.
	 * @param {string} type The markup's type.
	 */
	constructor(length, position, type) {
		this.#length = length
		this.#position = position
		this.#type = type
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {number} The length of the markup contents. */
	get length() {
		return this.#length
	}

	/** @returns {number} The starting position of the markup in the string. */
	get position() {
		return this.#position
	}

	/** @returns {string} The markup's type. */
	get type() {
		return this.#type
	}
}
