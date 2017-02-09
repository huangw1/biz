
// implement

var Dialog = require('./dialog'),
	template = require('./tpl/status')

function Status(options) {
	
	Dialog.call(this, options)
}

Status.prototype = Object.create(Dialog.prototype)
Status.constructor = Status

// override
Status.prototype.render = function() {
	var html = template(this.options)
	this.$element = $(html).appendTo(this.$body)
	return this
}

Status.prototype.show = function(during) {
	this.$element.show()
	if(this.options.type == 'loading') {
		return
	} else {
		if(!during) {
			setTimeout(this.close.bind(this), 1500)
		}
	}
	return this
},
// override
Status.prototype.defaults = {
	type: 'loading',
	text: '数据加载中'
}

module.exports = Status