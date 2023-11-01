// Module imports
import { Parser as BBCodeParser } from 'bbcode-ast'
import { createMachine } from 'xstate'
import { v4 as uuid } from 'uuid'





// Local imports
import { DEFAULT_MARKUP } from '../data/DEFAULT_MARKUP.js'
import { LINE_TYPES } from '../data/LINE_TYPES.js'
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

	const machineConfig = {
		context,
		id: machineID,
		predictableActionArguments: true,
		states: {},
	}

	allNodes.forEach((nodeString, nodeIndex) => {
		const [metaString, contentString] = nodeString.split('---')

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
							let previousLineState = allStates.get(contentLines[lineIndex - 1].id)

							if (previousLineState.type === 'parallel') {
								previousLineState = allStates.get(Object.keys(previousLineState.states)[0])
							}

							previousLineState.on = {
								next: {
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
										markup: nextLine.markup,
										tags: nextLine.tags,
									},
								}

								const nextNextLine = contentLines[nextLineIndex + 1]

								if (nextNextLine) {
									lineState.states[nextLineID].on = {
										next: {
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
							author: line.author,
							body: line.body,
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
							lineState.type = 'final'
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

	return createMachine(machineConfig)
}
