// Local imports
import { Line } from './Line.js'
import { Node } from './Node.js'





/**
 * Manages a script.
 */
export class Script {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {Map<string, Node>} */
	#nodes = new Map

	/** @type {string} */
	#original





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new script.
	 *
	 * @param {string} scriptString The original script.
	 */
	constructor(scriptString) {
		this.#original = scriptString
		this.#parseNodes()
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Parses a script into nodes.
	 */
	#parseNodes() {
		const allLines = this.#original
			.replace(/\r/ug, '')
			.split(/\n/u)
			.filter(Boolean)

		while (allLines.length) {
			const endOfNodeIndex = allLines.findIndex(item => item === '===')
			const nodeLines = allLines.splice(0, endOfNodeIndex)
			const node = new Node(nodeLines.join('\n'))

			this.#nodes.set(node.id, node)

			// Remove the node separator
			allLines.shift()
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Retrieves the next line.
	 *
	 * @param {string | import('./Line.js').Line} [lineOrLineID] Either a Line or a Line ID from which to determine the next line to be returned.
	 * @returns {import('./Line.js').Line | undefined} The next line to be rendered.
	 */
	getNextLine(lineOrLineID) {
		if (!lineOrLineID) {
			return this.#nodes.values().next().value.firstLine
		}

		let line = lineOrLineID

		if (typeof line === 'string') {
			line = /** @type {Line} */ (Line.getByID(/** @type {string} */ (lineOrLineID)))
		}

		return line.nextSibling
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {Map<string, Node>} A mapping of all nodes in this script. */
	get nodes() {
		return this.#nodes
	}

	/** @returns {string} The original, unparsed node. */
	get original() {
		return this.#original
	}
}
