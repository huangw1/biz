module.exports = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<div style="display:none"><div class="weui-mask_transparent"></div> ';
 if(data.type == 'tip'){ 
__p+=' <div class="weui-tip"> ';
 }else{ 
__p+=' <div class="weui-toast"> ';
 } 
__p+=' ';
 if(data.type == 'loading'){ 
__p+=' <i class="weui-loading weui-icon_toast"></i><p class="weui-toast__content">'+
((__t=( data.text || '数据加载中' ))==null?'':__t)+
'</p> ';
 }else if(data.type == 'checked'){ 
__p+=' <i class="weui-icon-success-no-circle weui-icon_toast"></i><p class="weui-toast__content">'+
((__t=( data.text || '操作成功' ))==null?'':__t)+
'</p> ';
 }else if(data.type == 'tip'){ 
__p+=' <p class="weui-tip__content">'+
((__t=( data.text || '操作成功' ))==null?'':__t)+
'</p> ';
 } 
__p+=' </div></div></div>';
return __p;
};