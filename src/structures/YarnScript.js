// Module imports
import { Parser as BBCodeParser } from 'bbcode-ast'
import { createMachine } from 'xstate'
import { v4 as uuid } from 'uuid'





// Constants
const DEFAULT_MARKUP = [
	'character',
	'nomarkup',
	'ordinal',
	'plural',
	'select',
]
const LINE_TYPES = {
	COMMAND: 'command',
	DIALOG: 'dialog',
	OPTION: 'option',
}





/**
 * Representes a Yarn script
 */
export class YarnScript {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#bbcodeParser

	#context

	#machine

	#script

	#validMarkup





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Yarn script.
	 *
	 * @param {string} script The script as a string.
	 * @param {object} [options] All options.
	 */
	constructor(script, options) {
		const {
			context,
			validMarkup = [],
		} = options ?? {}

		const allMarkup = [
			...DEFAULT_MARKUP,
			...validMarkup,
		]

		this.#bbcodeParser = new BBCodeParser(allMarkup, false, true)

		this.#context = context
		this.#validMarkup = allMarkup
		this.#script = script

		this.parseScript()
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Maps a tag string into a tag object.
	 *
	 * @param {string} tagString The original tag string.
	 * @returns {import('../types/DialogLineTag.js').DialogLineTag} The parsed tag data.
	 */
	mapTag(tagString) {
		const [key, value] = tagString.split(':')

		return {
			key,
			value,
			original: `#${tagString}`,
		}
	}

	/**
	 * Parses a command line.
	 *
	 * @param {string} line The line to be parsed.
	 * @returns {object} The parsed line.
	 */
	parseCommandLine(line) {
		const [, commandName, parameters] = /^\s*<<(\w+)(?:\s(.*))?>>\s*$/u.exec(line.trim())

		return {
			commandName,
			parameters: parameters.split(' '),
		}
	}

	/**
	 * Parses commands from a content string.
	 *
	 * @param {string} contentString The content string.
	 * @returns {object} The parsed commands.
	 */
	parseCommands(contentString) {
		const commands = []
		const lines = contentString.split('\n')

		let index = 0

		while (index < lines.length) {
			const line = lines[index]
			const lineMatch = /^\s*<<(?<command>.+)>>/u.exec(line)

			if (lineMatch) {
				const {
					groups: { command },
				} = lineMatch

				const [name, ...params] = command.split(' ')

				commands.push({
					name,
					params,
				})
			}

			index += 1
		}

		return commands
	}

	/**
	 * Compiles a content string.
	 *
	 * @param {string} contentString The content string.
	 * @returns {object} The parsed content.
	 */
	parseContent(contentString) {
		return contentString
			.split('\n')
			.filter(Boolean)
			.map(line => this.parseLine(line))
	}

	/**
	 * Parses a line of dialog.
	 *
	 * @param {string} line The line to be parsed.
	 * @returns {object} The parsed line.
	 */
	parseDialogLine(line) {
		const [lineWithoutTags, ...tags] = line
			.trim()
			.split('#')
		const [, author, bodyString] = /^(?:(.*?):\s?)?(.+)$/u.exec(lineWithoutTags)

		const {
			content: dialogLineContent,
			markup: dialogLineMarkup,
		} = this.traverseBBCodeAST(this.bbcodeParser.parse(bodyString))

		return {
			author: author,
			body: dialogLineContent,
			markup: dialogLineMarkup,
			tags: tags.map(this.mapTag),
		}
	}

	/**
	 * Parses a line from a content string.
	 *
	 * @param {string} line The line to be parsed.
	 * @returns {object} The parsed content.
	 */
	parseLine(line) {
		const [indentation] = /^(\s*)/u.exec(line)
		const indentationLevel = indentation
			.replace(/\t/gu, ' '.repeat(8))
			.length

		const trimmedLine = line.trim()

		let result = {
			id: uuid(),
			indentationLevel,
			type: LINE_TYPES.DIALOG,
		}

		if (/^\s*<</u.test(line)) {
			result.type = LINE_TYPES.COMMAND
		} else if (/^\s*->/u.test(line)) {
			result.type = LINE_TYPES.OPTION
		}

		switch (result.type) {
			case LINE_TYPES.COMMAND:
				result = {
					...result,
					...this.parseCommandLine(trimmedLine),
				}
				break

			case LINE_TYPES.OPTION:
				result = {
					...result,
					...this.parseOptionLine(trimmedLine),
				}
				break

			default:
				result = {
					...result,
					...this.parseDialogLine(trimmedLine),
				}
				break
		}

		return result
	}

	/**
	 * Compiles a meta string to an object.
	 *
	 * @param {string} metaString The meta string.
	 * @returns {object} The parsed meta data.
	 */
	parseMeta(metaString) {
		const lines = metaString
			.split('\n')
			.filter(Boolean)

		const meta = {}

		let index = 0

		while (index < lines.length) {
			const line = lines[index]
			const [key, value] = line.split(':')
			meta[key.trim()] = value.trim()

			index += 1
		}

		return meta
	}


	/**
	 * Breaks the script into nodes.
	 *
	 * @returns {string[]} An array of nodes.
	 */
	parseNodes() {
		const nodes = []

		const allLines = this.#script
			.split('\n')
			.filter(Boolean)

		while (allLines.length) {
			const endOfNodeIndex = allLines.findIndex(item => item === '===')
			const nodeLines = allLines.splice(0, endOfNodeIndex)
			nodes.push(nodeLines.join('\n'))

			// Remove the node separator
			allLines.shift()
		}

		return nodes
	}

	/**
	 * Parses an option line.
	 *
	 * @param {string} line The line to be parsed.
	 * @returns {object} The parsed line.
	 */
	parseOptionLine(line) {
		const [, dialog, command] = /^\s*->\s*(.*?)(?:\s*<<(.+?)>>)?$/gu.exec(line.trim())

		let result = {
			...this.parseDialogLine(dialog),
		}

		if (command) {
			result = {
				...result,
				...this.parseCommandLine(command),
			}
		}

		return result
	}


	/**
	 * Compiles the script to a state machine.
	 */
	parseScript() {
		const context = this.#context
		const allNodes = this.parseNodes()
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

			const contentLines = this.parseContent(contentString)
			const parsedLines = new Set

			const node = {
				actions: {},
				initial: contentLines[0].id,
				meta: this.parseMeta(metaString),
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

		this.#machine = createMachine(machineConfig)
	}

	/**
	 * Traverses a BBCode AST to enerate a resulting string and markup dictionary.
	 *
	 * @param {object} ast The AST to be traversed.
	 * @param {object} [context] All context.
	 * @param {string} context.content The string result.
	 * @param {object[]} context.markup A list of markup to be applied to the string result.
	 * @returns {import('../types/DialogLineObject.js').DialogLineObject} The parsed body.
	 */
	traverseBBCodeAST(ast, context) {
		if (!context) {
			context = {
				content: '',
				markup: [],
			}
		}

		let markupData = null

		switch (ast.name) {
			case 'RootNode':
				break

			case 'TextNode':
				context.content += ast.text
				break

			default:
				if (this.validMarkup.includes(ast.name)) {
					markupData = {
						length: 0,
						position: context.content.length,
						type: ast.name,
					}
					context.markup.push(markupData)
				} else {
					console.log(`Unrecognised AST node: ${ast.name}`, ast)
				}
		}

		if (ast.children) {
			ast.children.forEach(childNode => {
				this.traverseBBCodeAST(childNode, context)
			})
		}

		if (ast.name === 'action') {
			markupData.length = context.content.length - markupData.position
		}

		return context
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/** @returns {import('bbcode-ast').Parser} The parser to use for this script. */
	get bbcodeParser() {
		return this.#bbcodeParser
	}

	/** @returns {import('xstate').StateMachine} The script's state machine. */
	get machine() {
		return this.#machine
	}

	/** @returns {string[]} A list of valid markup elements. */
	get validMarkup() {
		return this.#validMarkup
	}
}
