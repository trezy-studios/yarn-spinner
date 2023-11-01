/**
 * Breaks the script into nodes.
 *
 * @param {string} script The script as a string.
 * @returns {string[]} An array of nodes.
 */
export function parseNodes(script) {
	const nodes = []

	const allLines = script
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
