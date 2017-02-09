// biz

Biz = {}

Biz.version = '1.0.0'

var Confirm = require('./confirm'),
	Alert = require('./alert'),
	Status = require('./status'),
	Loadmore = require('./loadmore'),
	Validate = require('./validate'),
	node = require('./node'),
	Route = require('./route')

Biz.Confirm = function(data) {
	return new Confirm(data)
}

Biz.Alert = function(data) {
	return new Alert(data)
}

Biz.Status = function(data) {
	return new Status(data)
}

Biz.Loadmore = function(data) {
	return new Loadmore(data)
}

Biz.node = node

Biz.Validate = Validate

Biz.Route = new Route()

// 拓展工具函数
Biz.utils = {}

Biz.utils.throttle = function(fn, delay) {
	var timer = null
	return function() {
		var that = this, args = arguments
		if(timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(function() {
			fn.apply(that, args)
		}, delay)
	}
}

module.exports = Biz