#!/bin/node

const fs = require('fs');
const Combinator = require('./Combinator.js')
const TM_GOAL = 3
const KEYPRESS_WAIT = 250
const CHANCE_SMALL = 0.001
const CHANCE_AVERAGE = 0.015
const CHANCE_BIG = 0.225

const baseData = require('./data.js')
let data = {}

let debug = false
process.argv.forEach((val, index) => {
	if (index > 1) {
		if (val === "--debug") {
			debug = true
		}
	}
})

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
	return 16 * (level ** TM_GOAL) + (8 ** TM_GOAL)
}

function improve() {
	data.XP += data.CLICK
	while (true) {
		data.GOAL = goal(data.LEVEL)
		if (data.XP < data.GOAL) {
			break
		}
		data.XP -= data.GOAL
		data.LEVEL += 1
	}

	fs.writeFile('./.data.js', `#!/bin/node\n\nmodule.exports = ${displayData(data)}\n`, () => { })
}

setInterval(() => {
	improve()
	console.log("\u001Bc")
	console.log(displayData(data))
}, 1000)


let actions = {
	clickBoost: false,
}

let readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (ch, key) => {
	if (debug) {
		console.log('got "keypress" | ', ch, ' | ', key);
	}

	if (key && key.ctrl && !key.shift && key.name === 'c') {
		process.exit()
	}

	if (key && !key.ctrl && !key.shift && key.name === 'i' && !actions.clickBoost) {
		actions.clickBoost = true
		setTimeout(() => { actions.clickBoost = false }, KEYPRESS_WAIT)
		if (debug) {
			console.log('action "clickBoost"')
		}
		if (Math.random() < CHANCE_AVERAGE) {
			data.CLICK += 1
		}
	}
})
process.stdin.setRawMode(true)
process.stdin.resume()
