#!/bin/node

const fs = require('fs');
const Combinator = require('./Combinator.js')
const TM_GOAL = 3

const baseData = require('./data.js')
let data = {}

try {
	data = require('./.data.js')
} catch (err) { }

data = Combinator.combine(data, baseData)


function displayData(arg) {
	let result = `{\n`
	for (let key in arg) {
		result += `\t${key}: ${arg[key]},\n`
	}
	result += `}\n`
	return result
}

function goal(level) {
	return 16 * (data.LEVEL ** TM_GOAL) + (8 ** TM_GOAL)
}

function improve() {
	data.XP += data.CLICK
	while (true) {
		data.GOAL = 16 * (data.LEVEL ** TM_GOAL) + (8 ** TM_GOAL)
		if (data.XP < data.GOAL) {
			break
		}
		data.XP -= data.GOAL
		data.LEVEL += 1
	}

	fs.writeFile('./.data.js', `#!/bin/node\n\nmodule.exports = ${displayData(data)}\n`, () => { })
}

setInterval(improve, 1000)
