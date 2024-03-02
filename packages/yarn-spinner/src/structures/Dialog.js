// Local imports
import { parseValue } from '../helpers/parseValue.js'





// Constants
const DIALOG_SEGMENT_PATTERNS = {
	startMarkup: '\\[[^\\/].+?[^\\/]\\]',
	endMarkup: '\\[\\/.+?[^\\/]\\]',
	voidMarkup: '\\[[^\\/].+?\\/\\]',
	closeAllMarkup: '\\[\\/\\]',
}
const SERIALISED_DIALOG_SEGMENT_PATTERNS = Object.entries(DIALOG_SEGMENT_PATTERNS)
	.map(([name, pattern]) => `(?<${name}>${pattern})`)
	.join('|')
const SERIALISED_REGEX = `(?<!\\\\)(?:${SERIALISED_DIALOG_SEGMENT_PATTERNS})`





/**
 * Manages a dialog.
 */
export class Dialog {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {string} */
	#body

	/** @type {Set<import('../types/Markup.js').Markup>} */
	#markup = new Set

	/** @type {string} */
	#original





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Dialog.
	 *
	 * @param {string} dialogString The original, unparsed dialog string.
	 */
	constructor(dialogString) {
		this.#original = dialogString
		this.#body = ''

		// eslint-disable-next-line security/detect-non-literal-regexp
		const segmentDiscoveryRegex = new RegExp(SERIALISED_REGEX, 'gu')
		const matches = dialogString.matchAll(segmentDiscoveryRegex)

		/** @type {import('../types/Markup.js').Markup[]} */
		let openMarkups = []

		/** @type {*} */
		let previousMatch

		for (const match of matches) {
			const {
				groups = {},
				index = 0,
			} = /** @type {RegExpMatchArray} */ (match)

			let precedingStringStartIndex = 0

			if (typeof previousMatch !== 'undefined') {
				precedingStringStartIndex = previousMatch.index + previousMatch[0].length
			}

			if ((index - precedingStringStartIndex) >= 0) {
				this.#body += dialogString.substring(precedingStringStartIndex, index)
			}

			if (groups.startMarkup ?? groups.voidMarkup) {
				/** @type {import('../types/Markup.js').Markup} */
				const markup = {
					index: this.#body.length,
					length: 0,
					name: '',
					parameters: new Map,
				}

				const segments = (groups.startMarkup ?? groups.voidMarkup)
					// eslint-disable-next-line optimize-regex/optimize-regex
					.replace(/^\[|\/?\]$/gu, '')
					.trim()
					.split(' ')

				let segmentIndex = 0

				while (segments.length > segmentIndex) {
					const segment = segments[segmentIndex]
					const [key, value] = segment.split('=')

					if (segmentIndex === 0) {
						markup.name = key

						if (value) {
							markup.parameters.set(key, parseValue(value))
						}
					} else {
						markup.parameters.set(key, value ? parseValue(value) : true)
					}

					segmentIndex += 1
				}

				if (groups.startMarkup) {
					openMarkups.push(markup)
				}

				this.#markup.add(markup)
			} else if (groups.endMarkup) {
				const {
					groups: endMarkupGroups = {},
				} = /** @type {RegExpExecArray} */ (/^\[\/(?<name>\w+?)[=\s\]]/u.exec(groups.endMarkup))

				/** @type {import('../types/Markup.js').Markup} */
				const markup = /** @type {*} */ (openMarkups.find(openMarkup => openMarkup.name === endMarkupGroups.name))

				markup.length = this.#body.length - markup.index

				openMarkups = openMarkups.filter(openMarkup => openMarkup !== markup)
			} else if (groups.closeAllMarkup) {
				openMarkups.forEach(openMarkup => {
					openMarkup.length = this.#body.length - openMarkup.index
				})

				openMarkups = []
			}

			previousMatch = match
		}

		let finalStringStartIndex = 0

		if (previousMatch) {
			finalStringStartIndex = previousMatch.index + previousMatch[0].length
		}

		if (finalStringStartIndex < dialogString.length) {
			this.#body += dialogString.substring(finalStringStartIndex)
		}

		this.#body = this.#body.replace(/\s+/gu, ' ')
	}





	/****************************************************************************\
	 * Public getters/setters
	\****************************************************************************/

	/** @returns {string} The body of the dialog. */
	get body() {
		return this.#body
	}

	/** @returns {Set<import('../types/Markup.js').Markup>} Any markup extracted from the original string. */
	get markup() {
		return this.#markup
	}

	/** @returns {string} The original, unparsed dialog string. */
	get original() {
		return this.#original
	}
}
