function Router () {
	this.routers = []
	this.defaultHander = null
}

/*-------------------------- 拓展开始 --------------------------------*/
// 配置
Router.prototype.config = function(options) {
	this.mode = options && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash'
}
// 支持正则路由
Router.prototype._compire = function(router) {
	var route = {}
	var paramReg = /:(\w+)/g
	var paramNames = router.match(paramReg)
	if(paramNames) {
		route.paramNames = paramNames.map(function(paramName) {
			return paramName.replace(':', '')
		})
	}
	router = router.replace(/:(\w+)/g, '(\\w+)')
	route.re = new RegExp('^' +router+ '$')
	return route
}
// 路由回调
Router.prototype._check = function(path) {
	var routers = this.routers
	for(var i = 0; i < routers.length; i++) {
		var params = {}
		var match = path.match(routers[i].re)
		if(match) {
			routers[i].paramNames && routers[i].paramNames
				.forEach(function(name, index) {
					params[name] = match[index +1]
				})
			routers[i].hander.call({}, {
				params: params
			})
			return true
		}
	}
},
	// 添加路由
	Router.prototype.add = function(path, hander) {
		var route = this._compire(path)
		this.routers.push({
			reg: route.reg,
			paramsName: route.paramsName,
			hander: hander
		})
		return this
	}
// 监听
Router.prototype.listen = function() {
	var that = this
	if(this.mode == 'history') {
		window.addEventListener('popstate', function() {
			var path = location.pathname
			that._check(path)
		})
	} else {
		window.addEventListener('hashchange', function() {
			var path = location.hash.replace(/^#/, '')
			that._check(path)
		})
	}
	return this
}
// 跳转路由
Router.prototype.go = function(path) {
	if(this.mode == 'history') {
		window.history.pushState({
			path: path
		}, '', path)
		this._check(path)
	} else {
		window.location.hash = path
	}
}
/*---------------------------- 拓展结束 ------------------------------*/

Router.prototype.compare = function(url) {
	for(var i = 0; i < this.routers.length; i++) {
		if(this.routers[i].url == url) {
			this.routers[i].callback()
			return
		}
	}
	this.defaultHander && this.defaultHander()
}

Router.prototype.route = function ( path, callback ) {

	this.routers.push({
		url: path,
		callback: callback
	})
	return this
}

Router.prototype.default = function(defaultHander) {
	this.defaultHander = defaultHander
	return this
}

Router.prototype.refresh = function() {
	this.compare(location.hash.slice(1) || '/')
}

Router.prototype.start = function() {
	// get hash value -> location.href.replace(/^[^#]*#?(.*)$/, '$1')
	this.refresh()
	window.addEventListener('hashchange', this.refresh.bind(this), false)
}

module.exports = Router
