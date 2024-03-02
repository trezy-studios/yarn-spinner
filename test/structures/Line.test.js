// Module imports
import { expect } from 'chai'





// Local imports
import {
	Character,
	Command,
	Dialog,
	Line,
	Tag,
	Variable,
} from '../../src/index.js'





describe('Line', function() {
	it('parses a simple line', function() {
		const line = new Line('Oh hi there!', 'nodeID')
		const segments = line.segments.values()

		expect(line.original).to.equal('Oh hi there!')
		expect(line.segments).to.have.lengthOf(1)
		expect(segments.next().value).to.be.instanceOf(Dialog)
	})

	it('parses a line with an character name', function() {
		const line = new Line('Bob Bergenstein: Oh hi there!', 'nodeID')
		const segments = line.segments.values()

		expect(line.segments).to.have.lengthOf(1)
		expect(segments.next().value).to.be.instanceOf(Dialog)
		expect(line.character).to.be.instanceOf(Character)
	})

	it('parses a line with a tag', function() {
		const line = new Line('Oh hi there!#tag', 'nodeID')
		const segments = line.segments.values()
		const tags = line.tags.values()

		expect(line.segments).to.have.lengthOf(1)
		expect(segments.next().value).to.be.instanceOf(Dialog)
		expect(tags.next().value).to.be.instanceOf(Tag)
	})

	it('parses a line with a tag that has a value', function() {
		const line = new Line('Oh hi there!#tag:value', 'nodeID')
		const segments = line.segments.values()
		const tags = line.tags.values()

		expect(line.segments).to.have.lengthOf(1)
		expect(segments.next().value).to.be.instanceOf(Dialog)
		expect(tags.next().value).to.be.instanceOf(Tag)
	})

	it('parses a line with a variable', function() {
		const line = new Line('Oh hi there, {$playerName}!', 'nodeID')
		const segments = line.segments.values()

		expect(line.segments).to.have.lengthOf(3)
		expect(segments.next().value).to.be.instanceOf(Dialog)
		expect(segments.next().value).to.be.instanceOf(Variable)
		expect(segments.next().value).to.be.instanceOf(Dialog)
	})

	it('parses a line with a command', function() {
		const line = new Line('Oh... <<wait 100>> Hi there!', 'nodeID')
		const segments = line.segments.values()

		expect(line.segments).to.have.lengthOf(3)
		expect(segments.next().value).to.be.instanceOf(Dialog)
		expect(segments.next().value).to.be.instanceOf(Command)
		expect(segments.next().value).to.be.instanceOf(Dialog)
	})

	it('parses a line with markup', function() {
		const line = new Line('Oh... [wave]Hi there[/wave]!', 'nodeID')
		const segments = line.segments.values()

		expect(line.segments).to.have.lengthOf(1)
		expect(segments.next().value).to.be.instanceOf(Dialog)
	})

	it('parses a complex line', function() {
		const line = new Line('Bob Bergenstein: Oh... <<wait 100>> Hi there, {$playerName}! I\'d [bold]love[/bold] to get your take on \\<< versus \\{$blep}.', 'nodeID')

		expect(line.character.name).to.equal('Bob Bergenstein')

		const segments = line.segments.values()

		expect(line.segments).to.have.lengthOf(5)
		expect(segments.next().value).to.be.instanceOf(Dialog)
		expect(segments.next().value).to.be.instanceOf(Command)
		expect(segments.next().value).to.be.instanceOf(Dialog)
		expect(segments.next().value).to.be.instanceOf(Variable)
		expect(segments.next().value).to.be.instanceOf(Dialog)
	})

	it('ignores escaped characters', function() {
		const line = new Line('Oh... \\<<wait 100>> Hi there, \\{$playerName}!', 'nodeID')
		const segments = line.segments.values()

		expect(line.segments).to.have.lengthOf(1)
		expect(segments.next().value).to.be.instanceOf(Dialog)
	})

	it('respects custom #line:[id] tags', function() {
		const line = new Line('Oh hi there! #line:12345', 'nodeID')

		expect(line).to.have.property('id', 12345)
	})
})
