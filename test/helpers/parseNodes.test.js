// Module imports
import { expect } from 'chai'





// Local imports
import { parseNodes } from '../../src/index.js'





describe('parseNodes', function() {
	it('parses a node\'s content', async function() {
		const testScript = `
title: hello
---
This is a node line!
===

title: hi
---
This is a node line!
===

title: hai
---
This is a node line!
===

title: ohai
---
This is a node line!
===
`

		const parsedNodes = parseNodes(testScript)

		expect(parsedNodes).to.have.lengthOf(4)
	})
})
