#!/bin/node

module.exports = {
	combine: (...args) => {
		let result = {}
		for (let arg of args) {
			for (let key in arg) {
				if (result[key] === undefined) {
					result[key] = arg[key]
				}
			}
		}
		return result
	}
}

if (require.main === module) {
	console.log(module.exports.combine({ "year": 2022, "month": 9, "day": 12, }))
	let temp = module.exports.combine({ "a": 0, "b": 0 }, { "a": 1, "c": 1 })
	result = `{`
	for (let key in temp) {
		result += `\t${key}: ${temp[key]},\n`
	}
	console.log(result + `}`)
}
