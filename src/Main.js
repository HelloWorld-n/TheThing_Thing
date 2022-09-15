#!/bin/node

const fs = require('fs');
const Combinator = require('./Combinator.js')
const AppUtil = require('./AppUtil.js')
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


function displayData(arg, applyTerminalColors = false) {
	const termColor_basicText = (
		(applyTerminalColors) ?
			AppUtil.applyBackgroundColor(0, 0, 0) + AppUtil.applyForegroundColor(127, 189, 189) :
			""
	)
	const termColor_key = (
		(applyTerminalColors) ?
			AppUtil.applyBackgroundColor(0, 0, 0) + AppUtil.applyForegroundColor(235, 189, 64) :
			""
	)
	const termColor_value = (
		(applyTerminalColors) ?
			AppUtil.applyBackgroundColor(0, 0, 0) + AppUtil.applyForegroundColor(189, 64, 235) :
			""
	)
	const termColor_end = (
		(applyTerminalColors) ?
			AppUtil.resetTermColor() :
			""
	)
	let result = `${termColor_basicText}{\n`
	for (let key in arg) {
		result += (
			(
				`\t${termColor_key}${key}${termColor_basicText}: `
			) + (
				`${termColor_value}${arg[key]}${termColor_basicText}, \n`
			)
		)
	}
	result += `}${termColor_end}\n`
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
	console.log(displayData(data, true))
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
		let iterNo = 1
		while (Math.random() < CHANCE_AVERAGE * Math.sqrt(data.CLICK) * (1 / iterNo)) {
			data.CLICK += 1
			iterNo += 1
		}
	}
})
process.stdin.setRawMode(true)
process.stdin.resume()
