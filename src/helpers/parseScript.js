// Module imports
import { Parser as BBCodeParser } from 'bbcode-ast'
import { createMachine } from 'xstate'
import { v4 as uuid } from 'uuid'





// Local imports
import { DEFAULT_MARKUP } from '../data/DEFAULT_MARKUP.js'
import { LINE_TYPES } from '../data/LINE_TYPES.js'
import { log } from './log.js'
import { parseMeta } from './parseMeta.js'
import { parseNodeContent } from './parseNodeContent.js'
import { parseNodes } from './parseNodes.js'





/**
 * Parses a Yarn Spinner script into a state machine.
 *
 * @param {string} script The script as a string.
 * @param {object} [options] All options.
 * @returns {import('xstate').StateMachine} The new state machine.
 */
export function parseScript(script, options) {
	log('group', 'parseScript')

	const {
		context,
		validMarkup = [],
	} = options ?? {}

	const allMarkup = [
		...DEFAULT_MARKUP,
		...validMarkup,
	]

	const parseState = {
		bbcodeParser: new BBCodeParser(allMarkup, false, true),
		context,
		validMarkup: [
			...DEFAULT_MARKUP,
			...validMarkup,
		],
	}

	const allNodes = parseNodes(script)
	const allStates = new Map
	const machineID = uuid()

	const doneState = {
		meta: {
			id: uuid(),
		},
	}

	doneState.type = 'final'

	const machineConfig = {
		context,
		id: machineID,
		states: {
			[doneState.meta.id]: doneState,
		},
	}

	log('info', { allNodes })

	allNodes.forEach((nodeString, nodeIndex) => {
		log('group', 'parsing node')
		log('info', {
			nodeIndex,
			nodeString,
		})

		const [metaString, contentString] = nodeString.split('---')

		log('info', {
			nodeIndex,
			nodeString,

			metaString,
			contentString,
		})
		log('groupEnd')

		const contentLines = parseNodeContent(contentString, parseState)
		const parsedLines = new Set

		const node = {
			actions: {},
			initial: contentLines[0].id,
			meta: parseMeta(metaString),
			states: {},
		}

		let lineIndex = 0

		while (lineIndex < contentLines.length) {
			const line = contentLines[lineIndex]

			if (!parsedLines.has(line.id)) {
				const lineState = {}
				let shouldAddState = true

				switch (line.type) {
					case LINE_TYPES.COMMAND:
						if (line.commandName === 'jump') {
							let previousLineID = contentLines[lineIndex - 1].id
							let previousLineState = allStates.get(previousLineID)
							let nextKey = 'next'

							if (previousLineState.type === 'parallel') {
								previousLineID = Object.keys(previousLineState.states)[0]
								previousLineState = allStates.get(previousLineID)
							}

							if (previousLineState.meta.isOption) {
								nextKey += `::${previousLineID}`
							}

							previousLineState.on = {
								[nextKey]: {
									target: `#${machineID}.${line.parameters[0]}`,
								},
							}

							shouldAddState = false
						} else {
							lineState.entry = {
								type: line.commandName,
								parameters: line.parameters,
							}
						}
						break

					case LINE_TYPES.OPTION: {
						lineState.states = {}
						lineState.type = 'parallel'

						let nextLineIndex = lineIndex
						let nextLine = contentLines[nextLineIndex]

						while (nextLine?.indentationLevel >= line.indentationLevel) {
							if (
								(nextLine.indentationLevel === line.indentationLevel)
								&& (line.type === LINE_TYPES.OPTION)
							) {
								let nextLineID = nextLine.id

								if (nextLineIndex === lineIndex) {
									nextLineID = uuid()
								}

								lineState.states[nextLineID] = {
									meta: {
										author: nextLine.author,
										body: nextLine.body,
										id: nextLineID,
										isOption: true,
										markup: nextLine.markup,
										tags: nextLine.tags,
									},
								}

								const nextNextLine = contentLines[nextLineIndex + 1]

								if (nextNextLine) {
									lineState.states[nextLineID].on = {
										[`next-${nextLineID}`]: {
											target: `#${machineID}.${node.meta.title}.${nextNextLine.id}`,
										},
									}
								}

								parsedLines.add(nextLineID)
								allStates.set(nextLineID, lineState.states[nextLineID])
							}

							nextLineIndex += 1
							nextLine = contentLines[nextLineIndex]
						}

						break
					}

					// case LINE_TYPES.DIALOG:
					default: {
						lineState.meta = {
							ast: line.ast,
							author: line.author,
							body: line.body,
							id: line.id,
							markup: line.markup,
							tags: line.tags,
						}

						const nextLine = contentLines[lineIndex + 1]

						if (nextLine) {
							lineState.on = {
								next: {
									target: nextLine.id,
								},
							}
						} else {
							lineState.on = {
								next: {
									target: `#${machineID}.${doneState.meta.id}`,
								},
							}
						}
					}
				}

				parsedLines.add(line.id)
				allStates.set(line.id, lineState)

				if (shouldAddState) {
					node.states[line.id] = lineState
				}
			}

			lineIndex += 1
		}

		machineConfig.states[node.meta.title] = node

		if (nodeIndex === 0) {
			machineConfig.initial = node.meta.title
		}
	})

	log('groupEnd')

	return createMachine(machineConfig)
}
