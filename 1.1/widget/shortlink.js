SNS("SNS.widget.ShortLink",function(){var e=YAHOO.lang,a=YAHOO.util.Event,d=YAHOO.util.Dom,c=SNS.sys.Helper,f=YAHOO.util.Get,b=YAHOO.util.Anim;SNS.widget.ShortLink={setpos:function(j,h,i){var g=d.getXY(h);d.setStyle(j,"display","block");d.setStyle(j,"top",g[1]+24+"px");d.setStyle(j,"left",g[0]+(h.offsetWidth/8)+"px");d.getFirstChild(d.getElementsByClassName("native-url","span",j)[0]).innerHTML="\u6e90\u94fe\u63a5:"+i},show:function(k,l){var h=a.getRelatedTarget(k),n=window.document,i=n.body;if(h!=l&&!d.isAncestor(l,h)){var o=d.getXY(l);var g=l.innerHTML,m=d.getAttribute(l.parentNode,"data-sr"),j=d.getAttribute(l.parentNode,"data-url");if(m){var p=d.get("J_urlPop");SNS.widget.ShortLink.setpos(p,l,m)}else{new SNS.sys.BasicDataSource({url:j,parms:{shorturl:g},success:function(u){if(u.errorcode==="0"&&u.sourceurl!==""){var q=d.get("J_urlPop"),s;if(u.sourceurl.split("").length>40){s=u.sourceurl.substring(0,40)+"..."}else{s=u.sourceurl}if(!q){var w,v,r,t,s;w=n.createElement("DIV");w.id="J_urlPop";w.className="url-wrapper";v=n.createElement("SPAN");v.className="native-url";r=n.createElement("B");t=n.createElement("S");r.appendChild(n.createTextNode("\u6e90\u94fe\u63a5:"+s));v.appendChild(r);v.appendChild(t);w.appendChild(v);i.appendChild(w);d.setStyle(w,"display","block");d.setStyle(w,"top",o[1]+24+"px");d.setStyle(w,"left",o[0]+(l.offsetWidth/8)+"px");d.setAttribute(l.parentNode,"data-sr",s)}else{SNS.widget.ShortLink.setpos(q,l,s);d.setAttribute(l.parentNode,"data-sr",s)}}else{return}}}).jsonp()}}},hide:function(j,i){var g=d.get("J_urlPop"),h=a.getRelatedTarget(j);if(h!=i&&!d.isAncestor(i,h)){d.setStyle(g,"display","none")}}}});SNS("SNS.widget.LinkCheck",function(b){var a=function(){};SNS.widget.LinkCheck=a});SNS("SNS.widget.LinkCheck",function(b){function c(g){var j=KISSY,k=j.DOM,n,f,m,l;n=k.get("#openTempForm");if(n==null){var n=k.create("<form>",{target:"_blank",name:"openTempForm",id:"openTempForm"});k.append(n,document.body)}if(g.indexOf("?")!=-1){m=g.substr(g.indexOf("?")+1,g.length);l=m.split("&");for(var h=0;h<l.length;h++){f=k.create("<input>",{type:"hidden",value:decodeURIComponent(l[h].split("=")[1]),name:l[h].split("=")[0]});k.append(f,n);input=null;f=null}}m=null;l=null;k.attr(n,"action",g);n.submit()}var e=YAHOO.util.Dom,d=YAHOO.util.Event,a=function(f){this.linkarr=f;this.link=""};a.link="";a.linktitle="";a.open=function(f){if(f==0){var g=c(a.link);if(g==null){SNS.sys.LinkCheck.open(1)}}else{a.linkid=e.generateId(null,"J_linkcheck");popupDialog=new SNS.sys.Popup({title:a.linktitle+"<p id="+a.linkid+">"+a.link+"</p>",width:290,height:127,hideMask:false,content:"\u8bbf\u95ee\u5185\u5bb9\u8d85\u51fa\u672c\u7ad9\u8303\u56f4,\u4e0d\u80fd\u786e\u5b9a\u662f\u5426\u5b89\u5168\u3002",type:"linkCheck",onShow:function(){var i=this;var k=e.getAncestorByClassName(a.linkid,"linkCheck");var h=k.getElementsByTagName("button")[0].parentNode;k.getElementsByTagName("button")[0].style.display="none";var j=document.createElement("a");j.href=a.link;j.target="_blank";j.innerHTML="<span>\u7ee7\u7eed\u8bbf\u95ee</span>";var l=document.createElement("a");e.setStyle(j,"cuscor","pointer");l.innerHTML="<span>\u53d6\u6d88\u8bbf\u95ee</span>";h.appendChild(j);h.appendChild(l);d.on([j,l],"click",function(m){i.hide()})}})}};YAHOO.lang.augmentObject(a.prototype,{_init:function(){var f=this;d.on(this.linkarr,"click",function(h){d.stopEvent(h);var g=d.getTarget(h);f.check(g)})},check:function(){var g=this.linkarr;if(g.tagName!=="A"){return false}SNS.sys.LinkCheck.link=g.href;SNS.sys.LinkCheck.linktitle=g.getAttribute("data-linktitle");var f=SNS.sys.Helper.getApiURI("http://share.jianghu.{serverHost}/security/site_security.htm?callback=SNS.sys.LinkCheck.open&url="+g.href+"&_input_charset=utf-8");YAHOO.util.Get.script(f,{timeout:1000,onTimeout:function(){SNS.sys.LinkCheck.open(1)}})}});SNS.widget.LinkCheck=b.sys.LinkCheck=a});