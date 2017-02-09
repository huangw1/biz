module.exports = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<div class="js_dialog" id="iosDialog" style="display: none"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__hd"><strong class="weui-dialog__title">'+
((__t=( data.text ))==null?'':__t)+
'</strong></div><div class="weui-dialog__bd">'+
((__t=( data.content ))==null?'':__t)+
'</div><div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default J-button" data-index="0">'+
((__t=( data.buttons[0].text ))==null?'':__t)+
'</a><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary J-button" data-index="1">'+
((__t=( data.buttons[1].text ))==null?'':__t)+
'</a></div></div></div>';
return __p;
};