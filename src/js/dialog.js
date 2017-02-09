

// base 


function Dialog(options) {
	this.options = $.extend(true, {}, this.defaults, options || {})
    this.init()
}

var DIALOG_SELECTOR = '.J-button',
    EVENT_NAME = 'click'


Dialog.prototype = {
	init: function() {
		this.$body = $(document.body)
		this.jq = $({})
		this.render()
		this.show()
		this.bindEvents()
	},
	// child implement
	render: function() {console.log('child implement...')},
	bindEvents: function() {
		var that = this
		console.log(that.$element.find(DIALOG_SELECTOR).html())
		that.$element.find(DIALOG_SELECTOR).on(EVENT_NAME, function(e) {
			var index = parseInt($(this).attr('data-index')),
            	button = that.options.buttons[index]
        		button.handler && button.handler.call(this, e, that)
        		that.close()
		})

	},
	show: function() {
		this.$element.show()
		this.trigger('dialog:open')
		return this
	},
	hide: function() {
		this.$element.hide()
		this.trigger('dialog:hide')
		return this
	},
	close: function() {
		this.$element.hide()
		this.$element.remove()
		this.trigger('dialog:hide')
		return this
	},
	// publish subscibe
	on: function() {
		$.fn.on.apply(this.jq, arguments)
	},
	trigger: function() {
		$.fn.trigger.apply(this.jq, arguments)
	}

}

Dialog.prototype.defaults = {
	text: '确认操作',
	content: '',
	buttons: [
		{
			text: '取消',
			handler: function() {}
		},
		{
			text: '确定',
			handler: function() {}
		}
	]
}

module.exports = Dialog