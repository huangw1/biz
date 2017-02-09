
// implement

var Dialog = require('./dialog'),
	template = require('./tpl/alert')

function Alert(options) {
	Dialog.call(this, options)
}

Alert.prototype = Object.create(Dialog.prototype)
Alert.constructor = Alert

Alert.prototype.render = function() {
	var html = template(this.options)
	this.$element = $(html).appendTo(this.$body)
	return this
}

module.exports = Alert