// Local imports
import { log } from './log.js'





/**
 * Breaks the script into nodes.
 *
 * @param {string} script The script as a string.
 * @returns {string[]} An array of nodes.
 */
export function parseNodes(script) {
	log('group', 'parseNodes')

	const nodes = []

	log('info', { script })

	const allLines = script
		.split(/\n/)
		.filter(Boolean)

	log('info', { allLines })

	let lineIndex = 0
	while (allLines.length) {
		log('group', `parsing node ${lineIndex}`)

		const endOfNodeIndex = allLines.findIndex(item => item === '===')
		const nodeLines = allLines.splice(0, endOfNodeIndex)
		nodes.push(nodeLines.join('\n'))

		// Remove the node separator
		allLines.shift()

		lineIndex += 1

		log('groupEnd')
	}

	log('info', { nodes })
	log('groupEnd')

	return nodes
}
