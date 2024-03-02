// Module imports
import { randomUUID } from 'crypto'





// Local imports
import { Character } from './Character.js'
import { Command } from './Command.js'
import { Dialog } from './Dialog.js'
import { Tag } from './Tag.js'
import { Variable } from './Variable.js'





// Constants
const LINE_SEGMENT_PATTERNS = {
	command: '<<.+?>>',
	variable: '\\{\\$\\w+?\\}',
}
const SERIALISED_LINE_SEGMENT_PATTERNS = Object.entries(LINE_SEGMENT_PATTERNS)
	.map(([name, pattern]) => `(?<${name}>${pattern})`)
	.join('|')
const SERIALISED_REGEX = `(?<!\\\\)(?:${SERIALISED_LINE_SEGMENT_PATTERNS})`





/**
 * Manages a line.
 */
export class Line {
	/****************************************************************************\
	 * Private static properties
	\****************************************************************************/

	/** @type {Map<string, Line>} */
	static #collection = new Map





	/****************************************************************************\
	 * Public static methods
	\****************************************************************************/

	/**
	 * Gets a line from the global collection by its ID.
	 *
	 * @param {string} lineID The ID of the line to be retrieved.
	 * @returns {Line | undefined} The retrieved line.
	 */
	static getByID(lineID) {
		return Line.#collection.get(lineID)
	}





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {Character | undefined} */
	#character

	/** @type {number} */
	#indentationLevel

	/** @type {string} */
	#internalID = randomUUID()

	/** @type {string} */
	#id = this.#internalID

	/** @type {boolean} */
	#isOption = false

	/** @type {Line | undefined} */
	#firstChild

	/** @type {Line | undefined} */
	#nextSibling

	/** @type {string} */
	#nodeID

	/** @type {string} */
	#original

	/** @type {Set<import('../types/LineSegment.js').LineSegment>} */
	#segments = new Set

	/** @type {Set<Tag>} */
	#tags = new Set





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Line.
	 *
	 * @param {string} lineString The original, unparsed line string.
	 * @param {string} nodeID The ID of the node to which this line belongs.
	 */
	constructor(lineString, nodeID) {
		Line.#collection.set(this.#id, this)

		this.#nodeID = nodeID
		this.#original = lineString

		let mutableLineString = lineString

		const [indentation] = /** @type {RegExpExecArray} */ (/^(\s*)/u.exec(lineString))

		this.#indentationLevel = indentation
			.replace(/\t/gu, ' '.repeat(8))
			.length

		mutableLineString = mutableLineString.trim()

		if (/^->/u.test(mutableLineString)) {
			this.#isOption = true
			mutableLineString = mutableLineString
				.replace(/^->/u, '')
				.trim()
		}

		this.#parseSegments(mutableLineString)
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Handles a command line segment.
	 *
	 * @param {string} commandString The command string.
	 * @param {string} lineString The full line string.
	 * @returns {string} The full line string.
	 */
	#handleCommand(commandString, lineString) {
		this.#segments.add(new Command(commandString))

		return lineString
	}

	/**
	 * Handles a dialog line segment.
	 *
	 * @param {string} dialogString The dialog string.
	 * @param {string} lineString The full line string.
	 * @returns {string} The full line string.
	 */
	#handleDialog(dialogString, lineString) {
		this.#segments.add(new Dialog(dialogString))

		return lineString
	}

	/**
	 * Handles a variable line segment.
	 *
	 * @param {string} variableString The variable string.
	 * @param {string} lineString The full line string.
	 * @returns {string} The full line string.
	 */
	#handleVariable(variableString, lineString) {
		this.#segments.add(new Variable(variableString))

		return lineString
	}

	/**
	 * Parses the line into segments.
	 *
	 * @param {string} lineString The line to be parsed into segments.
	 */
	#parseSegments(lineString) {
		// eslint-disable-next-line security/detect-unsafe-regex
		const tagMatches = lineString.matchAll(/(?<!\\\\)#\w+(?::\w+)?/gu)

		for (const tagMatch of tagMatches) {
			const lineStringWithoutTag = lineString.split('')

			lineStringWithoutTag.splice((tagMatch.index ?? 0), tagMatch[0].length)

			lineString = lineStringWithoutTag.join('')

			const newTag = this.addTag(tagMatch[0])

			if (newTag.key === 'line') {
				this.#id = /** @type {string} **/ (newTag.value)
			}
		}

		if (this.#id === this.#internalID) {
			this.addTag(`#line:${this.#id}`)
		}

		const [characterName] = (/^(.+?)(?=:)/u.exec(lineString) ?? [])

		if (characterName) {
			this.#character = Character.fromName(characterName)
			lineString = lineString
				.replace(/^.+?:/u, '')
				.trim()
		}

		// eslint-disable-next-line security/detect-non-literal-regexp
		const segmentDiscoveryRegex = new RegExp(SERIALISED_REGEX, 'gu')
		const matches = lineString.matchAll(segmentDiscoveryRegex)

		let previousMatch

		for (const match of matches) {
			const {
				groups = {},
				index = 0,
			} = match

			const precedingStringStartIndex = (previousMatch?.index ?? 0) + (previousMatch?.[0]?.length ?? 0)

			if ((index - precedingStringStartIndex) > 0) {
				this.#handleDialog(lineString.substring(precedingStringStartIndex, index), lineString)
			}

			if (groups.command) {
				this.#handleCommand(groups.command, lineString)
			} else if (groups.variable) {
				this.#handleVariable(groups.variable, lineString)
			}

			previousMatch = match
		}

		const finalStringStartIndex = (previousMatch?.index ?? 0) + (previousMatch?.[0]?.length ?? 0)

		if (finalStringStartIndex < lineString.length) {
			this.#handleDialog(lineString.substring(finalStringStartIndex), lineString)
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Adds a tag.
	 *
	 * @param {string | Tag} tag The tag to be added.
	 * @returns {Tag} The generated tag.
	 */
	addTag(tag) {
		if (typeof tag === 'string') {
			tag = new Tag(tag)
		}

		this.#tags.add(tag)

		return tag
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {Character | undefined} The character of this line. */
	get character() {
		return this.#character
	}

	/** @returns {Line | undefined} The first child of this line. */
	get firstChild() {
		return this.#firstChild
	}

	/** @param {Line} line The first child of this line. */
	set firstChild(line) {
		if (line instanceof Line) {
			this.#firstChild = line
		}
	}

	/** @returns {string} A unique identifier for this line. */
	get id() {
		return this.#id
	}

	/** @returns {number} The number of spaces at the beginning of this line. */
	get indentationLevel() {
		return this.#indentationLevel
	}

	/** @returns {boolean} Whether this line is an option. */
	get isOption() {
		return this.#isOption
	}

	/** @returns {Line | undefined} The next line at this indentation level. */
	get nextSibling() {
		return this.#nextSibling
	}

	/** @param {Line} line The next line at this indentation level. */
	set nextSibling(line) {
		if (line instanceof Line) {
			this.#nextSibling = line
		}
	}

	/** @returns {string} The ID of the node to which this line belongs. */
	get nodeID() {
		return this.#nodeID
	}

	/** @returns {string} The original, unparsed line. */
	get original() {
		return this.#original
	}

	/** @returns {Set<Tag>} An array of the segments of this line. */
	get tags() {
		return this.#tags
	}

	/** @returns {Set<import('../types/LineSegment.js').LineSegment>} An array of the segments of this line. */
	get segments() {
		return this.#segments
	}
}
