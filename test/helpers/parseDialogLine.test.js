// Module imports
import { expect } from 'chai'
import { Parser as BBCodeParser } from 'bbcode-ast'





// Local imports
import { parseDialogLine } from '../../src/index.js'





// Variables
const bbcodeParser = new BBCodeParser(
	[
		'bold',
		'italic',
	],
	false,
	true,
)





describe('parseDialogLine', function() {
	it('parses a line of dialog', function() {
		const author = 'Bob Borgenstein'
		const body = 'Why hello there! Nice day, isn\'t it?'

		const parsedDialogLine = parseDialogLine(`${author}: ${body}`, {
			bbcodeParser,
			context: {},
			validMarkup: [],
		})

		expect(parsedDialogLine).to.have.own.property('ast')
		expect(parsedDialogLine.author).to.equal(author)
		expect(parsedDialogLine.body).to.equal(body)
		expect(parsedDialogLine.markup).to.deep.equal([])
		expect(parsedDialogLine.tags).to.deep.equal([])
	})

	it('parses a line of dialog without an author', function() {
		const body = 'Why hello there! Nice day, isn\'t it?'

		const parsedDialogLine = parseDialogLine(body, {
			bbcodeParser,
			context: {},
			validMarkup: [],
		})

		expect(parsedDialogLine).to.have.own.property('ast')
		expect(parsedDialogLine.author).to.be.undefined
		expect(parsedDialogLine.body).to.equal(body)
		expect(parsedDialogLine.markup).to.deep.equal([])
		expect(parsedDialogLine.tags).to.deep.equal([])
	})

	it('parses a line of dialog with markup', function() {
		const author = 'Bob Borgenstein'
		const body = 'Why hello there! [bold]Nice[/bold] day, isn\'t it?'
		const bodyWithoutMarkup = 'Why hello there! Nice day, isn\'t it?'

		const parsedDialogLine = parseDialogLine(`${author}: ${body}`, {
			bbcodeParser,
			context: {},
			validMarkup: ['bold'],
		})

		expect(parsedDialogLine).to.have.own.property('ast')
		expect(parsedDialogLine.author).to.equal(author)
		expect(parsedDialogLine.body).to.equal(bodyWithoutMarkup)
		expect(parsedDialogLine.markup).to.deep.equal([
			{
				length: 4,
				position: 17,
				type: 'bold',
			},
		])
		expect(parsedDialogLine.tags).to.deep.equal([])
	})

	it('parses a line of dialog with multiple markup instances', function() {
		const author = 'Bob Borgenstein'
		const body = 'Why hello there! [bold]Nice[/bold] [italic]day[/italic], isn\'t it?'
		const bodyWithoutMarkup = 'Why hello there! Nice day, isn\'t it?'

		const parsedDialogLine = parseDialogLine(`${author}: ${body}`, {
			bbcodeParser,
			context: {},
			validMarkup: [
				'bold',
				'italic',
			],
		})

		expect(parsedDialogLine).to.have.own.property('ast')
		expect(parsedDialogLine.author).to.equal(author)
		expect(parsedDialogLine.body).to.equal(bodyWithoutMarkup)
		expect(parsedDialogLine.markup).to.deep.equal([
			{
				length: 4,
				position: 17,
				type: 'bold',
			},
			{
				length: 3,
				position: 22,
				type: 'italic',
			},
		])
		expect(parsedDialogLine.tags).to.deep.equal([])
	})

	it('parses a line of dialog with tags', function() {
		const author = 'Bob Borgenstein'
		const body = 'Why hello there! Nice day, isn\'t it?'
		const tags = [
			{
				key: 'duplicate',
				value: undefined,
			},
			{
				key: 'tone',
				value: 'sarcastic',
			},
		]

		tags.forEach(tag => {
			tag.original = `#${[tag.key]}`

			if (tag.value) {
				tag.original += `:${tag.value}`
			}
		})

		const serialisedTags = tags
			.map(tag => tag.original)
			.join(' ')

		const parsedDialogLine = parseDialogLine(`${author}: ${body} ${serialisedTags}`, {
			bbcodeParser,
			context: {},
			validMarkup: [],
		})

		expect(parsedDialogLine).to.have.own.property('ast')
		expect(parsedDialogLine.author).to.equal(author)
		expect(parsedDialogLine.body).to.equal(body)
		expect(parsedDialogLine.markup).to.deep.equal([])
		expect(parsedDialogLine.tags).to.deep.equal(tags)
	})
})
