/**
 * Compiles a meta string to an object.
 *
 * @param {string} metaString The meta string.
 * @returns {object} The parsed meta data.
 */
export function parseMeta(metaString) {
	const lines = metaString
		.split(/\n/)
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
