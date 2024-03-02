// Module imports
import { randomUUID } from 'crypto'





/**
 * Manages an character.
 */
export class Character {
	/****************************************************************************\
	 * Private static properties
	\****************************************************************************/

	/** @type {Map<string, Character>} */
	static #collection = new Map





	/****************************************************************************\
	 * Public static methods
	\****************************************************************************/

	/**
	 * Retrieves the character from the global collection, or creates a new character if one does not exist.
	 *
	 * @param {string} name The name of the character.
	 * @returns {Character} The character.
	 */
	static fromName(name) {
		let character = Character.#collection.get(name)

		if (!character) {
			character = new Character(name)
		}

		return character
	}





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {string} */
	#id = randomUUID()

	/** @type {string} */
	#name





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Character.
	 *
	 * @param {string} name The name of the character.
	 */
	constructor(name) {
		this.#name = name

		Character.#collection.set(this.#name, this)
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {string} A unique identifier for this character. */
	get id() {
		return this.#id
	}

	/** @returns {string} The name of the character. */
	get name() {
		return this.#name
	}
}
