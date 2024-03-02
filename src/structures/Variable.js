/**
 * Manages a variable.
 */
export class Variable {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {string} */
	#name

	/** @type {string} */
	#original





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Variable.
	 *
	 * @param {string} variableString The variable string
	 */
	constructor(variableString) {
		this.#original = variableString

		// eslint-disable-next-line optimize-regex/optimize-regex
		this.#name = /** @type {RegExpExecArray} */ (/(?<=\{\$).+(?=\})/u.exec(variableString))[0]
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {string} The name of the variable. */
	get name() {
		return this.#name
	}

	/** @returns {string} The original, unparsed variable. */
	get original() {
		return this.#original
	}
}
