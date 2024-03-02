// Module imports
import { expect } from 'chai'
import validate from 'uuid-validate'





// Local imports
import {
	Line,
	Node,
} from '../../src/index.js'





// Variables
const nodeString = `
	title: Node Title
	tone: sarcastic
	---
	NPC Name: Oh, hi!
	Player: Hello there!
		-> Option 1
			<<jump OtherNode>>
		-> Option 2
			<<jump OtherOtherNode>>
	Player: Goodbye!
	===`
	.replace(/^\t/gmu, '')





describe('Node', function() {
	describe('instance Node', function() {
		it('correctly parses the node\'s metadata', function() {
			const node = new Node(nodeString)

			expect(node.id).to.be.a('string')
			expect(node).to.have.property('original', nodeString)
			expect(node).to.have.property('meta')
			expect(node.meta.get('title')).to.equal('Node Title')
			expect(node.meta.get('title')).to.equal('Node Title')
			expect(node.meta.get('tone')).to.equal('sarcastic')

			for (const line of node.lines.values()) {
				expect(line.nodeID).to.equal(node.id)
			}
		})

		it('parses a node string into lines and segments', function() {
			const node = new Node(nodeString)
			const lines = node.lines.values()

			const firstLine = lines.next().value
			expect(firstLine).to.be.an.instanceOf(Line)
			expect(firstLine).to.have.property('segments')
				.and.to.be.a('Set')
				.and.to.have.length(1)

			const secondLine = lines.next().value
			expect(secondLine).to.have.property('character')
			expect(secondLine).to.have.property('segments')
				.and.to.be.a('Set')
				.and.to.have.length(1)
		})

		it('parses the node string into a tree', function() {
			const node = new Node(nodeString)

			const lines = Array.from(node.lines.values())

			expect(lines[0]).to.equal(node.firstLine)
			expect(lines[0]).to.have.property('nextSibling')
				.and.to.be.instanceOf(Line)

			expect(lines[1]).to.have.property('firstChild')
				.and.to.equal(lines[2])
			expect(lines[1]).to.have.property('nextSibling')
				.and.to.equal(lines[6])

			expect(lines[2]).to.have.property('firstChild')
				.and.to.equal(lines[3])
			expect(lines[2]).to.have.property('nextSibling')
				.and.to.equal(lines[4])

			expect(lines[3]).to.have.property('firstChild')
				.and.to.be.undefined
			expect(lines[3]).to.have.property('nextSibling')
				.and.to.be.undefined

			expect(lines[4]).to.have.property('firstChild')
				.and.to.equal(lines[5])
			expect(lines[4]).to.have.property('nextSibling')
				.and.to.be.undefined

			expect(lines[5]).to.have.property('firstChild')
				.and.to.be.undefined
			expect(lines[5]).to.have.property('nextSibling')
				.and.to.be.undefined

			expect(lines[6]).to.have.property('firstChild')
				.and.to.be.undefined
			expect(lines[6]).to.have.property('nextSibling')
				.and.to.be.undefined
		})

		it('adds the #lastline tag to the last line before a list of options', function() {
			const node = new Node(nodeString)

			const line = Array.from(node.lines.values())[1]
			const tags = Array.from(line.tags)

			expect(tags.some(tag => (tag.key === 'lastline'))).to.be.true
		})

		it('adds the #line:[id] tags to all lines', function() {
			const node = new Node(nodeString)

			for (const line of node.lines.values()) {
				const tags = Array.from(line.tags)

				expect(tags.some(tag => {
					return (tag.key === 'line') && (validate(/** @type {string} **/ (tag.value)))
				})).to.be.true
			}
		})
	})

	describe('static Node', function() {
		it('gets a node by ID', function() {
			const node = new Node(nodeString)
			expect(Node.getByID(node.id)).to.equal(node)
		})
	})
})
