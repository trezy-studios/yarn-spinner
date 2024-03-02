// Module imports
import { randomUUID } from 'crypto'





// Local imports
import { Line } from './Line.js'
import { parseValue } from '../helpers/parseValue.js'





/**
 * Manages a node.
 */
export class Node {
	/****************************************************************************\
	 * Private static properties
	\****************************************************************************/

	/** @type {Map<string, Node>} */
	static #collection = new Map





	/****************************************************************************\
	 * Public static methods
	\****************************************************************************/

	/**
	 * Gets a node from the global collection by its ID.
	 *
	 * @param {string} nodeID The ID of the node to be retrieved.
	 * @returns {Node | undefined} The retrieved node.
	 */
	static getByID(nodeID) {
		return Node.#collection.get(nodeID)
	}





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {string} */
	#internalID = randomUUID()

	/** @type {string} */
	#id = this.#internalID

	/** @type {Map<string, Line>} */
	#lines = new Map

	/** @type {Map<string, import('../types/Value.js').Value>} */
	#meta = new Map

	/** @type {string} */
	#original





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Node.
	 *
	 * @param {string} nodeString The original, unparsed node string.
	 */
	constructor(nodeString) {
		this.#original = nodeString

		const [
			metaString,
			contentString,
		] = nodeString.split('---')

		this.#parseMeta(metaString)
		this.#parseContent(contentString)
		this.#buildTree()

		Node.#collection.set(this.#id, this)
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Builds a linked tree from this node's lines.
	 */
	#buildTree() {
		/** @type {{ [key: string]: Line }} */
		const indentationTracker = {}

		const lines = Array.from(this.#lines.values())

		lines.forEach((line, lineIndex) => {
			const previousLine = lines[lineIndex - 1]

			if (previousLine) {
				const parentIndentationLevel = Object
					.keys(indentationTracker)
					.map(Number)
					.reduce((accumulator, key) => {
						if ((key < line.indentationLevel) && (key > Number(accumulator))) {
							return key
						}

						return accumulator
					})
				const previousLineAtSameIndentationLevel = indentationTracker[line.indentationLevel]

				if (line.indentationLevel > previousLine.indentationLevel) {
					previousLine.firstChild = line
				} else if (previousLineAtSameIndentationLevel) {
					previousLineAtSameIndentationLevel.nextSibling = line
				}

				if (line.isOption && (previousLine.indentationLevel === parentIndentationLevel)) {
					previousLine.addTag('#lastline')
				}
			}

			indentationTracker[line.indentationLevel] = line
		})
	}

	/**
	 * Parses a content string.
	 *
	 * @param {string} contentString The meta string.
	 */
	#parseContent(contentString) {
		contentString
			.split(/\n/u)
			.filter(lineString => lineString.trim())
			.filter(lineString => lineString !== '===')
			.forEach(lineString => {
				const line = new Line(lineString, this.id)
				this.#lines.set(line.id, line)
			})
	}

	/**
	 * Parses a meta string.
	 *
	 * @param {string} metaString The meta string.
	 */
	#parseMeta(metaString) {
		const lines = metaString
			.split(/\n/u)
			.filter(Boolean)

		let index = 0

		while (index < lines.length) {
			const line = lines[index]

			if (line) {
				const [key, value] = line.split(':')

				this.#meta.set(key.trim(), parseValue(value.trim()))
			}

			index += 1
		}

		this.#id = /** @type {string} */ (this.#meta.get('title'))
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {string} A unique identifier for this node. */
	get id() {
		return this.#id
	}

	/** @returns {Map<string, Line>} All lines in this node. */
	get lines() {
		return this.#lines
	}

	/** @returns {Map<string, import('../types/Value.js').Value>} Node metadata. */
	get meta() {
		return this.#meta
	}

	/** @returns {string} The original, unparsed node. */
	get original() {
		return this.#original
	}

	/** @returns {Line} The first line in the node. */
	get firstLine() {
		return this.#lines.values().next().value
	}
}
