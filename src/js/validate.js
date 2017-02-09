
var template = require('./tpl/tip')

var regexs = {
    // 匹配 max_length(12) => ["max_length",12]
    rule:/^(.+?)\((.+)\)$/,

    numericRegex:/^[0-9]+$/,

    email:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,

    ip:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,

    fax:/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,

    phone:/^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/,

    url:/[a-zA-z]+:\/\/[^\s]/
}

var _testHook = {
    is_email: function(field){return regexs.email.test( backVal(field) );},
    is_ip: function(field){return regexs.ip.test( backVal(field) );},
    is_fax:function(field){return regexs.fax.test( backVal(field) );},
    is_tel:function(field){return regexs.fax.test( backVal(field) );},
    is_phone:function(field){return regexs.phone.test( backVal(field) );},
    is_url:function(field){return regexs.url.test( backVal(field) );},
    required: function(field) {
        var value =  backVal(field) ;
        if ((field.type === 'checkbox') || (field.type === 'radio')) {
            return (field.checked === true);
        }
        return (value !== null && value !== '');
    },
    max_length: function(field, length){
        if (!regexs.numericRegex.test(length)) return false;
        return ( backVal(field) .length <= parseInt(length, 10));
    },
    min_length: function(field, length){
        if (!regexs.numericRegex.test(length)) return false;
        return ( backVal(field) .length >= parseInt(length, 10));
    }
}

var Validator = function(formelm, fields, callback){

    // 将验证方法绑到 Validator 对象上去
    for (var a in _testHook) this[camelCase(a)] = _testHook[a];

    this.isCallback = callback?true:false;
    this.callback = callback || function(){};
    this.form = _formElm(formelm) || {};
    this.errors = [];
    this.fields = {};
    this.handles = {};

    // 如果不存在 form 对象
    if(!formelm) return this;

    for (var i = 0, fieldLength = fields.length; i < fieldLength; i++) {
        var field = fields[i];
        // 如果通过不正确，我们需要跳过该领域。
        if ((!field.name && !field.names) || !field.rules) {
            console.warn(field);
            continue;
        }
        addField(this, field, field.name);
    }

    // 使用 submit 按钮拦截
    var _onsubmit = this.form.onsubmit;

    this.form.onsubmit = (function(that) {
        return function(evt) {
            try {
                return that.validate(evt) && (_onsubmit === undefined || _onsubmit());
            } catch(e) {}
        };
    })(this);
}

Validator.prototype = {

    validate:function(evt){

        this.handles["ok"] = true;
        this.handles["evt"] = evt;
        this.errors = [];

        for (var key in this.fields) {
            if(this.fields.hasOwnProperty(key)){
                var field = this.fields[key] || {},
                    element = this.form[field.name];

                // 验证以类型为准 不依据元素数
                if (element && element !== undefined) {
                    field.id = attributeValue(element, 'id');
                    field.element = element;
                    field.type = (element.length > 0) ? element[0].type : element.type;
                    field.value = attributeValue(element, 'value');
                    field.checked = attributeValue(element, 'checked');

                    this._validateField(field);
                }
            }
        }

        if (typeof this.callback === 'function') {
            this.callback(this, evt);
        }

        // 如果有错误，停止submit 提交
        if (this.errors.length > 0) {
            if (evt && evt.preventDefault) {
                evt.preventDefault();
            } else if (event) {
                // IE 使用的全局变量
                event.returnValue = false;
            }
        }

        return this;
    },
    _validateField:function(field){

        var rules = field.rules.split('|'),
            isEmpty = (!field.value || field.value === '' || field.value === undefined);

        for (var i = 0,ruleLength = rules.length; i < ruleLength; i++) {
            var method = rules[i];
            var parts = regexs.rule.exec(method);

            var param = null;
            var failed = false;

            // 解析带参数的验证如 max_length(12)
            if (parts) method = parts[1],param = parts[2];

            if (typeof _testHook[method] === 'function') {
                if (!_testHook[method].apply(this, [field, param])) {
                    failed = true;
                }
            }
            if(regexs[method] && /^regexp\_/.test(method)){
              if (!regexs[method].test(field.value)) {
                failed = true;
              }
            }
            if(failed){
                var message = (function(){
                    return field.display.split('|')[i] && field.display.split('|')[i].replace('{{'+field.name+'}}',field.value)
                })()

                var existingError;
                for (j = 0; j < this.errors.length; j += 1) {
                    if (field.element === this.errors[j].element) {
                        existingError = this.errors[j];
                    }
                }

                var errorObject = existingError || {
                    id: field.id,
                    display: field.display,
                    element: field.element,
                    name: field.name,
                    message: message,
                    messages: [],
                    rule: method
                };
                errorObject.messages.push(message);
                if (!existingError) this.errors.push(errorObject);
            }
        }
        return this;
    }
}

function camelCase(string){ 
    return string.replace( /\_([a-z])/g, function( all, letter ) {
        return letter.toUpperCase();
    });
}

 function attributeValue(element, attributeName) {
    var i;
    if ((element.length > 0) && (element[0].type === 'radio' || element[0].type === 'checkbox')) {
        for (i = 0, elementLength = element.length; i < elementLength; i++) {
            if (element[i].checked) {
                return element[i][attributeName];
            }
        }
        return;
    }
    return element[attributeName];
};

function addField(self,field, nameValue){
    self.fields[nameValue] = {
        name: nameValue,
        display: field.display || nameValue,
        rules: field.rules,
        id: null,
        element: null,
        type: null,
        value: null,
        checked: null
    }
    for (var a in field) {
      if (field.hasOwnProperty(a)&&/^regexp\_/.test(a)) {
        regexs[a] = field[a];
      }
    }
}


function _formElm(elm){
    return (typeof elm === 'object') ? elm : document.forms[elm];
}

function backVal(field){
    return (typeof field === 'string')?field:field.value;
}

function handleMes(result) {
	var body = $('body')
	body.find('.weui-validate__tip').length && body.find('.weui-validate__tip').remove()
	var temp = template(result.errors[0])
	body.append(temp)
	setTimeout(function() {
		body.find('.weui-validate__tip').addClass('weui-actionsheet_toggle')
	}, 20)
	setTimeout(function() {
		body.find('.weui-validate__tip').removeClass('weui-actionsheet_toggle')
		try {
			result.errors[0].element.focus()
		} catch(e) {
			result.errors[0].element[0].focus()
		}
	}, 1500)
}

function Validate(form_, callback) {
	var form = $('[name='+ form_ +']'),
		fields = form.find('[validate]'),
		element = null,
		reqs = []
	fields.each(function(i) {
		element = fields.eq(i)
		reqs.push({
			name: element.attr('name'),
			rules: element.attr('rules'),
			display: element.attr('display')
		})
	})
	return validator = new Validator(form_, reqs, function(result, evt) {
		var data = {}
		for(var prop in result.fields) {
			if(result.fields.hasOwnProperty(prop)) {
				data[prop] = result.fields[prop].value
			}
		}
		if(result.errors.length > 0){
			handleMes(result)
		} else {
			callback && callback(data, evt, result)
		}
	})
}

Validate.addRules = function(rule) {

	for (var a in rule) {
      	if (rule.hasOwnProperty(a)&&/^regexp\_/.test(a)) {
        	regexs[a] = rule[a];
      	}
    }
}

module.exports = Validate