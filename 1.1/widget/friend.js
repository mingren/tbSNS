SNS("SNS.widget.Friend",function(){var K=KISSY,D=K.DOM,E=K.Event;(function(){var addFriend=function(param,callback){var popup,popupEl;var init=function(){if(SNS.widget.showLogin(arguments.callee)==0){return}D.create('<img src="http://www.atpanel.com/jsclick?cache='+Math.ceil(Math.random()*Math.pow(10,7))+'&profriend=add" alt=" " />');K.getScript(SNS.sys.Helper.getApiURI("http://assets.{serverHost}/p/sns/1.1/widget/css/add-friends.css"),function(){},"GBK");K.jsonp(SNS.sys.Helper.getApiURI("http://jianghu.{serverHost}/json/inviteSetting.htm"),param,function(data){setTimeout(function(){if(data.auth==false){KISSY.use("",function(K){K.getScript("http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.css?t="+new Date().getTime(),function(){},"GBK");K.getScript("http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.js?t="+new Date().getTime(),function(){K.use("auth",function(K){K.sns.auth()})},"GBK")});return}K.use("overlay",function(){popup=new K.Overlay({width:430,elCls:"add-friend-popup",content:data.html,mask:true,align:{node:null,points:["cc","cc"],offset:[0,0]}});popup.show();popupEl=popup.get("contentEl").getDOMNode();_bindEvent()})},100)})};var _bindEvent=function(){E.on(popupEl,"click",function(e){if(D.hasClass(e.target,"J_Request1")){var reqParam=eval("("+D.attr(e.target,"data-param")+")");e.preventDefault();K.jsonp(SNS.sys.Helper.getApiURI("http://jianghu.{serverHost}/json/applyFriend.htm"),K.mix(reqParam,{type:0,groupId:1,question:encodeURIComponent(encodeURIComponent(D.get(".J_Question").value)),answer:encodeURIComponent(encodeURIComponent(D.get(".J_Answer",popupEl).value))}),function(data){popup.set("content",data.html);if((data.success==1)&&callback){callback()}})}else{if(D.hasClass(e.target,"J_Request2")){var reqParam=eval("("+D.attr(e.target,"data-param")+")");e.preventDefault();K.jsonp(SNS.sys.Helper.getApiURI("http://jianghu.{serverHost}/json/applyFriend.htm"),K.mix(reqParam,{type:0,groupId:1,message:encodeURIComponent(encodeURIComponent(D.get(".J_ReqTxt",popupEl).value))}),function(data){popup.set("content",data.html);if((data.success==1)&&callback){callback()}})}else{if(D.hasClass(e.target,"J_CommonFriend")){e.preventDefault();SNS.widget.Friend.showCommonFriends(D.attr(e.target,"data-userId"),e.target)}else{if(D.hasClass(e.target,"J_AddFriend")){e.preventDefault();popup.hide();SNS.widget.Friend.addFriend({friendId:D.attr(e.target,"data-userid"),isFork:1},function(){})}else{if(D.hasClass(e.target,"J_Recommend")){e.preventDefault();var checkboxs=D.query("#J_UserList input");var ids="";for(var i in checkboxs){if(checkboxs[i].checked==true){ids=ids+","+checkboxs[i].value}}ids=ids.substr(1);if(ids==""){popup.hide()}K.jsonp(SNS.sys.Helper.getApiURI("http://jianghu.{serverHost}/json/commendMyFriend.htm"),{toUserId:D.attr(e.target,"data-userid"),recommendIds:ids},function(data){popup.set("content",data.html)})}else{if(D.hasClass(e.target,"J_SendCheckCode")){e.preventDefault();var param=eval("("+D.attr(e.target,"data-param")+")");K.mix(param,{TPL_checkcode:D.get(".J_CheckCode").value});K.jsonp(SNS.sys.Helper.getApiURI("http://jianghu.{serverHost}/json/applyFriend.htm"),param,function(data){popup.set("content",data.html)})}else{if(D.hasClass(e.target,"J_CheckCodeChange")){e.preventDefault();e.halt();img=D.get("#J_CheckCodeImg");img.src=img.src+"&t="+new Date().getTime()}else{if(D.hasClass(e.target,"J_Close")){e.preventDefault();popup.hide()}}}}}}}}})};init()};SNS.namespace("SNS.widget.Friend").addFriend=addFriend})();(function(){var loadCommonFriends=function(id,callback){K.jsonp(SNS.sys.Helper.getApiURI("http://jianghu.daily.taobao.net/recommend/common_friends.htm?userId="+id),function(data){callback(data)})};var showCommonFriends=function(id,triggerEl,align){D.create('<img src="http://www.atpanel.com/jsclick?cache='+Math.ceil(Math.random()*Math.pow(10,7))+'&profriend=add" alt=" " />');var popup;var combineTemp=function(data){var listTemp='<a href="{href}" class="pic" title="{name}"><img width="40" height="40" src="{img}"></a>';var list="";for(var i=0;i<data.list.length;i++){list=list+K.substitute(listTemp,data.list[i])}var temp='<div class="friends-list">'+list+"</div>";var content=K.substitute('<div class="hd naked"><h3>\u4f60\u4eec\u6709&nbsp;{num}\u4e2a\u5171\u540c\u597d\u53cb.&nbsp;'+((data.num>7)?'<a href="{friendsHref}">\u67e5\u770b\u66f4\u591a</a>':"")+'</p></div><div class="bd">'+temp+'</div><div class="ft"><a href="#" title="\u5173\u95ed\u6b64\u7a97\u53e3" class="btn-close J_Close">x</a></div>',data);return content};var render=function(data){var content=combineTemp(data);if(!align){var align={node:triggerEl,points:["tc","bc"],offset:[0,0]}}K.use("overlay",function(){popup=new K.Overlay({width:236,elCls:"common-friends J_CommonFriendsBox",content:content,zIndex:10000,align:align});popup.show();bindEvent()})};var bindEvent=function(){E.on(popup.get("contentEl").getDOMNode(),"click",function(e){if(D.hasClass(e.target,"J_Close")){e.preventDefault();popup.hide()}});E.on(document.body,"click",function(e){if(!D.contains(popup.get("contentEl").getDOMNode(),e.target)){e.preventDefault();popup.hide()}})};var init=function(){K.getScript(SNS.sys.Helper.getApiURI("http://assets.{serverHost}/p/sns/1.1/widget/css/common-friends.css"),function(){},"GBK");loadCommonFriends(id,render)};init()};SNS.namespace("SNS.widget.Friend").loadCommonFriends=loadCommonFriends;SNS.namespace("SNS.widget.Friend").showCommonFriends=showCommonFriends})()},"SNS.util.Helper,SNS.widget.showLogin");
