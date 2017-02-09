module.exports = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='';
 if(data.type == 'loading'){ 
__p+=' <div class="J-loadmore"><div class="weui-loadmore"><i class="weui-loading"></i> <span class="weui-loadmore__tips">'+
((__t=( data.text || '加载中...' ))==null?'':__t)+
'</span></div><br></div> ';
 }else{ 
__p+=' <div class="J-loadmore"><div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips">'+
((__t=( data.text || '暂无数据' ))==null?'':__t)+
'</span></div><br></div> ';
 } 
__p+='';
return __p;
};