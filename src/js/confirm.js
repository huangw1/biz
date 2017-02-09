
// implement

var Dialog = require('./dialog'),
	template = require('./tpl/dialog')

function Confirm(options) {
	Dialog.call(this, options)
}

Confirm.prototype = Object.create(Dialog.prototype)
Confirm.constructor = Confirm

Confirm.prototype.render = function() {
	var html = template(this.options)
	this.$element = $(html).appendTo(this.$body)
	return this
}

module.exports = Confirm