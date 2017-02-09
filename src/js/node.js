
// usage: 
// node('div', {'class': 'message'}, node('p', 'hello'))
// returns
// '<div class="message"><p>hello</p></div>'
// 
// node('ul', node.each(['luobo', 'tang', 'mickey'], function (p, i) { return node('li', {id: function() { return i }}, p) }))
// returns
// '<ul><li>luobo</li><li>tang</li><li>mickey</li></ul>'

// util 
function attrs2str(attrs) {
	var result = []
	for(var prop in attrs) {
		if(attrs.hasOwnProperty(prop)) {
			var value = attrs[prop]
			if(typeof value == 'function') {
				value = value.call(attrs)
			}
			result.push(prop +'="'+ value +'"')
		}
	}
	return result.join(' ')
}

function isArray(array) {
	if(Array.isArray) {
		return Array.isArray(array)
	}
	return Object.prototype.toString.call(array) == '[object Array]'
}

var VoidElements = ' area base br col embed hr img input keygen link meta param source track wbr ';
function isVoidElment(tag) {
	return VoidElements.indexOf(' ' + tag + ' ') > -1
}

function node(tag, attrs, children) {
	var isVoidTag = isVoidElment(tag),
		start = 2
	if(attrs && typeof attrs == 'object') {
		attrs = attrs2str(attrs)
	} else {
		start = 1
	}
	var openTag = '<'+ tag + (start == 1 ? '' : ' ' + attrs + ' ') +'>'

	if(isVoidTag) {
		return openTag
	}

	var content = ''
	if(arguments.length > start) {
		content += [].slice.call(arguments, start).join('')
	}

	var closeTag = '<'+ tag +'/>'
	return openTag + content + closeTag
}

node.each = function(items, callback, separator) {
	separator = separator || ' '
	var result = []
	for(var i = 0; i < items.length; i++) {
		result.push(callback(items[i], i, items))
	}
	return result.join(separator)
}

module.exports = node