#!/bin/node

const fs = require('fs');
const Combinator = require('./Combinator.js')
const TM_GOAL = 3

const baseData = require('./data.js')
let data = {}

let debug = 0
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

setInterval(() => {
	improve()
	console.log("\u001Bc")
	console.log(displayData(data))
}, 1000)

let readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (ch, key) => {
	if (debug) {
		console.log('got "keypress"', ch, key);
	}
	if (key && key.ctrl && !key.shift && key.name === 'c') {
		process.exit()
	}
	if (key && !key.ctrl && !key.shift && key.name === 'i') {
		if (Math.random() > 0.999) {
			data.CLICK += 1
			if (debug) {
				console.log("INCREASED")
			}
		}
	}
});
process.stdin.setRawMode(true);
process.stdin.resume();
