SNS("SNS.widget.FeedSuggest",function(){var c=YAHOO.util.Dom,a=YAHOO.util.Event,b=SNS.sys.Helper;var d=function(e){this.config={url:"http://t.{serverHost}/weibo/searchRollcall.htm?_input_charset=utf-8",html:'<div class="microblog-suggest"><div class="title">\u4f60\u60f3\u7528@\u63d0\u5230\u8c01\uff1f</div><div class="content"><ul class="list"></ul></div></div>',root:document.body,className:"J_Suggest",autoHeight:true,minHeight:20,maxHeight:200,maxLength:210};this.init(e)};d.prototype={init:function(e){this.config=YAHOO.lang.merge(this.config,e||{});this.config.url=SNS.sys.Helper.getApiURI(this.config.url);this.on()},_setUp:function(f){var e=this;f.panel=SNS.sys.snsNearbyPanel(f,this.config.html,{width:"160px",showHandle:false,zIndex:99999});f.panel.friendList=c.getElementsByClassName("list","ul",f.panel.content)[0];f.panel.select=function(g){var h;if(!g){h=c.getFirstChild(this.friendList)}else{if(g.nodeType){h=g}else{if(g=="next"){h=c.getNextSibling(this._selectNode);if(!h){h=c.getFirstChild(this.friendList)}}else{if(g=="prev"){h=c.getPreviousSibling(this._selectNode);if(!h){h=c.getLastChild(this.friendList)}}}}}if(this._selectNode){c.removeClass(this._selectNode,"hover")}c.addClass(h,"hover");this._selectNode=h};f.panel.confirmSelect=function(h){if(!this._selectNode){this._selectNode=this.select()}if(h){b.recoverCursorPos(f)}var l=e._getCursortPosition(f);var j=f.value,i,k,g;j=j.replace(/\r\n/gi,"\n");k=j.lastIndexOf("@",l);if(k!=-1){i=j.substring(k+1,l);if(i.indexOf(" ")==-1&&i!=""){f.value=j.substring(0,k+1)+this._selectNode.getAttribute("data-value")+" "+j.substring(l,j.length);f.focus()}}this.hide();c.setAttribute(f,"data-lastcursor","");if(e.config.callback){e.config.callback()}};a.on(f.panel.content,"click",function(h){var g=a.getTarget(h);if(c.hasClass(g,"friend")){this.panel.confirmSelect(true)}this.panel.hide()},f,true);a.on(f.panel.content,"mouseover",function(h){var g=a.getTarget(h);if(c.hasClass(g,"friend")){this.panel.select(g)}},f,true);b.fixCursorPosition(f);a.on(document.body,"click",function(){f.panel.hide()})},_fgetCursortPosition:function(g){var f=0;if(document.selection){g.focus();var e=document.selection.createRange();e.moveStart("character",-g.value.length);f=e.text.length}else{if(g.selectionStart||g.selectionStart=="0"){f=g.selectionStart}}return(f)},_getCursortPosition:function(i){var h=0;if(document.selection){var j,e;var f=document.selection.createRange(),g;g=document.body.createTextRange();g.moveToElementText(i);for(j=0;g.compareEndPoints("StartToStart",f)<0;j++){g.moveStart("character",1)}h=j}else{if(i.selectionStart||i.selectionStart=="0"){h=i.selectionStart}}return(h)},on:function(){var e=this;a.on(this.config.root,"keyup",function(h){var g=a.getTarget(h);if(c.hasClass(g,e.config.className)){if(e.config.autoHeight){}if(!g.panel){this._setUp(g)}if(g.panel.config.state=="show"){var f=a.getCharCode(h);if(f==40||f==38||f==13){return}if(f==8){}}this._request(g)}},this,true);a.on(this.config.root,"paste",function(g){var f=a.getTarget(g);if(c.hasClass(f,e.config.className)){if(e.config.autoHeight){}}});a.on(this.config.root,"keydown",function(h){var g=a.getTarget(h);if(c.hasClass(g,e.config.className)){if(!g.panel){this._setUp(g)}if(g.panel.config.state=="show"){var f=a.getCharCode(h);if(f==40){a.stopEvent(h);g.panel.select("next")}else{if(f==38){a.stopEvent(h);g.panel.select("prev")}else{if(f==13){a.stopEvent(h);g.panel.confirmSelect()}}}}}},this,true);a.on(this.config.root,"click",function(g){var f=a.getTarget(g);if(c.hasClass(f,e.config.className)){a.stopEvent(g);if(!f.panel){this._setUp(f)}this._request(f)}},this,true)},_request:function(i){var j=this._getCursortPosition(i);var g=i.value,f,h,e;g=g.replace(/\r\n/gi,"\n");h=g.lastIndexOf("@",j);if(h!=-1){f=g.substring(h+1,j);if(f.indexOf(" ")==-1&&f!=""&&f.indexOf("\u3000")==-1&&f.indexOf(":")==-1&&f.indexOf("\uff1a")==-1){this._showData(f,i)}else{i.panel.hide()}}},_showData:function(f,g){var e=this;SNS.request(this.config.url,{data:{kw:f},use:"jsonp",success:function(h){var j="";for(var i=0;i<h.length;i++){j+='<li title="'+h[i].display+'" class="friend" data-value="'+h[i].nick+'">'+h[i].display+"</li>"}g.panel.friendList.innerHTML=j;if(h.length>0){g.panel.place();g.panel.autoHeight();g.panel.show();g.panel.select()}else{g.panel.hide()}}})}};SNS.widget.MicroSuggest=d},"SNS.util.Helper,SNS.util.Ajax");