module.exports = {
	applyBackgroundColor: (red, green, blue) => {
		return `\u001B[48;2;${red};${green};${blue}m`
	},
	applyForegroundColor: (red, green, blue) => {
		return `\u001B[38;2;${red};${green};${blue}m`
	},
	resetTermColor: () => {
		return `\u001B[00m`
	}
}
