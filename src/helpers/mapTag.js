/**
 * Maps a tag string into a tag object.
 *
 * @param {string} tagString The original tag string.
 * @returns {import('../types/DialogLineTag.js').DialogLineTag} The parsed tag data.
 */
export function mapTag(tagString) {
	const [key, value] = tagString.split(':')

	return {
		key,
		value,
		original: `#${tagString}`,
	}
}
