SNS("SNS.widget.Forward",function(){var c=SNS.sys.Helper,b=KISSY,e=b.DOM,d=b.Event;var a=function(f){this.cfg={param:{},paramCmt:{},paramFwd:{},maxlength:"140",txt:"\u987a\u4fbf\u8bf4\u70b9\u4ec0\u4e48\u5427...",tplURL:"http://t.{serverHost}/weibo/ajax/forward.htm?_input_charset=utf-8",fowardURL:"http://t.{serverHost}/weibo/addWeiboResult.htm?event_submit_do_publish_weibo=1&action=weibo/weiboAction",postMBCommentURL:"http://comment.jianghu.{serverHost}/json/publish_comment.htm?action=comment/commentAction&event_submit_do_publish_comment_batch=true",refresh:false};this._cfg(f)};a.prototype={init:function(f){this._setup()},_cfg:function(f){this.cfg=b.merge(this.cfg,f||{})},_setup:function(){if(!c.checkAndShowLogin({callback:function(){}})){return}var g=this;var f=function(h){g.panel=SNS.sys.snsCenterPanel(h,{width:"398px",hideHandleTop:"10px",hideHandleRight:"10px",fixed:false});new SNS.widget.MicroSuggest({root:g.panel.content,autoHeight:false,callback:function(){g.showNum()}});c.addMaxLenSupport(g.panel.content,140,"f-txt");g.recoverTxt();g._on();g.showNum()};SNS.request(c.getApiURI(g.cfg.tplURL),{data:g.cfg.param,dataType:"json",success:function(h){if(h.status=="0"){f(h.result.html);g.cfg.paramFwd=h.result.param;g.cfg.paramCmt=h.result.paramCmt}else{if(h.status=="4"){KISSY.use("",function(i){i.getScript("http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.css?t="+new Date().getTime(),function(){},"GBK");i.getScript("http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.js?t="+new Date().getTime(),function(){i.use("auth",function(j){j.sns.auth()})},"GBK")});return}else{c.showMessage(h.msg)}}}})},_on:function(){var g=this,k=g.panel.content,i=e.get(".num-value",k),f=e.get(".f-txt",k),j=e.get(".cancle",k),h=e.get(".confirm",k),m=e.get(".icon-insert-face",k),l=f.value;c.fixCursorPosition(f);SNS.sys.form.setPlaceHolder(f);f.style.overflow="hidden";if(e.attr(f,"placeholder")==l){f.value="";f.focus()}else{if(0===b.trim(l).indexOf("//")){this.setCaretPosition(f,0)}f.focus()}d.on(f,"keyup",function(){g.showNum()});d.on(j,"click",function(n){n.preventDefault();g.panel.hide()},this,true);d.on(h,"click",function(n){n.preventDefault();this.clearTxt();g.forwardEvent()},this,true);SNS.widget.faceSelector.init({elTrigger:m,container:k,insertBefore:function(){if(f.value.length>=140){return false}},insertAfter:function(){g.clearTxt();var o=140-f.value.length;if(o<0){o=0}i.innerHTML=o}})},clearTxt:function(){var g=this,h=g.panel.content,f=e.get(".f-txt",h);if(f.value==this.cfg.txt){f.value=""}},showNum:function(){var g=this,i=g.panel.content,h=e.get(".num-value",i),f=e.get(".f-txt",i);var j=140-f.value.length;if(j<0){j=0}h.innerHTML=j},recoverTxt:function(){var g=this,h=g.panel.content,f=e.get(".f-txt",h);if(b.trim(f.value)==""){f.value=this.cfg.txt}},setCaretPosition:function(f,g){setTimeout(function(){if(f.setSelectionRange){f.focus();f.setSelectionRange(g,g)}else{if(f.createTextRange){var h=f.createTextRange();h.collapse(true);h.moveEnd("character",g);h.moveStart("character",g);h.select()}}f.focus()},50)},forwardEvent:function(){if(!c.checkAndShowLogin({callback:function(){}})){return}var o=this,k=o.panel.content,j=e.get(".num-value".content),l=e.get(".f-txt",k),m=e.get(".sendmsg",k),f=e.get(".osendmsg",k),h=b.mix(this.cfg.paramFwd,{content:l.value}),g=b.mix(this.cfg.paramCmt,{batch:0,content:l.value});if(m.checked&&f&&f.checked){g.batch="2"}if(!m.checked&&f&&f.checked){g.batch="1"}var p=function(s){var r="<div>\u8f6c\u53d1\u6210\u529f.</div>";var q=SNS.sys.snsDialog({content:r,cancelBtn:false});setTimeout(function(){q.hide()},2000)};var i=function(q){SNS.sys.snsDialog({content:q})};var n=function(q){if(q.status==1){o.panel.hide();if((m&&m.checked)||(f&&f.checked)){o.comment(g,p)}else{p()}}else{if(q.status==2){i(q.msg)}else{if(!c.checkAndShowLogin()){return}}}};this.forward(h,n)},forward:function(g,f){g=b.mix(this.cfg.paramFwd,g||{});new SNS.sys.BasicDataSource({url:c.getApiURI(this.cfg.fowardURL),parms:g,success:f}).iframeProxy()},comment:function(i,h){var g=this;var j=function(o){if(!o.msg){o.msg=""}if(o&&o.status&&o.status==12){var n='<div class="sns-nf"><span>\u9a8c\u8bc1\u7801\uff1a</span><input type="text" maxlength="4" id="J_FollowCheckCode" class="f-txt" style="width:50px"/><img id="J_FollowCheckCodeImg" style="vertical-align:middle" width="100" src="'+SNS.sys.Helper.getApiURI(o.result.checkCodeUrl)+'"/>(\u4e0d\u533a\u5206\u5927\u5c0f\u5199) &nbsp;<a href="#" id="J_FollowCheckCodeChange">\u6362\u4e00\u5f20</a></div>';var k,p,l;var m=SNS.sys.snsDialog({width:"410px",className:"checkCode",title:"\u8bf7\u8f93\u5165\u8bc4\u8bba\u9a8c\u8bc1\u7801:",content:n,confirmBtn:function(){var q=e.get("#J_FollowCheckCode");var s=e.get("#J_FollowCheckCodeMsg");var r=i;r.TPL_checkcode=q.value;g.comment(r,h);m.hide()}});k=e.get("#J_FollowCheckCode");p=e.get("#J_FollowCheckCodeChange");l=e.get("#J_FollowCheckCodeImg");d.on(p,"click",function(q){q.halt();l.src=SNS.sys.Helper.getApiURI(o.result.checkCodeUrl)})}else{if(h){h()}}};var f=new SNS.data.Comment();f.loadData("postCmt",j,i)}};SNS.widget.Forward=a},"SNS.util.Helper,SNS.util.Popup,SNS.util.Ajax");
