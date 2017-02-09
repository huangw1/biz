
// implement

var	template = require('./tpl/loadmore')

var CONTAINER_SELECTOR = '.J-loadmore'

function Loadmore(options) {
	this.options = $.extend(true, {}, this.defaults, options || {})
	this.init()
}

Loadmore.prototype.init = function() {
	this.$parent = $(this.options.target || document.body)
	this.render()
}
// override
Loadmore.prototype.render = function() {
	var html = template(this.options)
	this.$parent.append(html)
	return this
}

Loadmore.prototype.show = function() {
	this.$parent.find(CONTAINER_SELECTOR).show()
},

Loadmore.prototype.hide = function() {
	this.$parent.find(CONTAINER_SELECTOR).hide()
}
Loadmore.prototype.close = function() {
	this.$parent.find(CONTAINER_SELECTOR).remove()
}
// override
Loadmore.prototype.defaults = {
	type: 'loading',
	text: '正在加载',
	target: null
}

module.exports = Loadmore