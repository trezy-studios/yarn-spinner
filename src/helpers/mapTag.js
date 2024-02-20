// Local imports
import { Tag } from '../structures/Tag.js'





/**
 * Maps a tag string into a tag object.
 *
 * @param {string} tagString The original tag string.
 * @returns {Tag} The parsed tag.
 */
export function mapTag(tagString) {
	return new Tag(tagString)
}
