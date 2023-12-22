// Local imports
import { log } from './log.js'





/**
 * Traverses a BBCode AST to enerate a resulting string and markup dictionary.
 *
 * @param {object} ast The AST to be traversed.
 * @param {array} validMarkup A list of valid markup tags.
 * @param {object} [context] All context.
 * @param {string} context.content The string result.
 * @param {object[]} context.markup A list of markup to be applied to the string result.
 * @returns {import('../types/DialogLineObject.js').DialogLineObject} The parsed body.
 */
export function traverseBBCodeAST(ast, validMarkup, context) {
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
			if (validMarkup.includes(ast.name)) {
				markupData = {
					length: 0,
					position: context.content.length,
					type: ast.name,
				}
				context.markup.push(markupData)
			} else {
				log('info', `Unrecognised AST node: ${ast.name}`, ast)
			}
	}

	if (ast.children) {
		ast.children.forEach(childNode => {
			traverseBBCodeAST(childNode, validMarkup, context)
		})
	}

	if (ast.name === 'action') {
		markupData.length = context.content.length - markupData.position
	}

	return context
}
