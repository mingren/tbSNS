SNS("SNS.util.Helper",function(g){var c=YAHOO,d=c.util,o=d.Dom,l=d.Event,i=c.lang,s=d.Connect,e=d.Get,b=c.env,n=b.ua,j=KISSY,A=document,x,a={},m={},h={},y={},u={},w={apiToken:"comment:/json/token.htm"},r={portal:"http://jianghu.{serverHost}",assets:"http://assets.{cdnHost}/app/sns",assetsV:"http://assets.{cdnHost}/apps",app:"http://app.jianghu.{serverHost}",comment:"http://comment.jianghu.{serverHost}",poke:"http://poke.jianghu.{serverHost}",share:"http://share.jianghu.{serverHost}",blog:"http://blog.jianghu.{serverHost}",fx:"http://fx.{serverHost}",checkCode:"http://comment.jianghu.{serverHost}/json/get_comment_check_code.htm",feedCheckCode:"http://jianghu.{serverHost}/json/get_feed_comment_check_code.htm"};function f(D,B){B=B||location.hostname;D=D||2;var C=B.split("."),p=[];while(C.length>0&&D>0){p.unshift(C.pop());D--}return p.join(".")}function t(B){var C=B||"",E=C.split("="),D=o.get("Jianghu_tb_token"),p;if(!D){D=A.createElement("div");D.id="Jianghu_tb_token";D.innerHTML='<input type="hidden" />';A.body.appendChild(D)}if(C&&E.length===2){p=o.getFirstChild(D);p.name=E[0];p.value=E[1]}}var k=location.hostname,v="taobao.com",z="taobaocdn.com";if(f(2)!=="taobao.com"){v=z="daily.taobao.net"}for(var q in r){if(typeof r[q]==="string"){r[q]=KISSY.substitute(r[q],{serverHost:v,cdnHost:z})}}r.serverHost=v;r.cdnHost=z;a={checkDaren:function(){return Boolean(o.get("J_darenStyle"))},checkLogin:function(){var B=function(D){var E=A.cookie.match("(?:^|;)\\s*"+D+"=([^;]*)");if(E&&E[1]){if(E[1].indexOf("&")!=-1){var M=E[1].split("&"),H=M.length,G=0,F={};for(;G<H;G++){var L=M[G],J=L.indexOf("="),K=L.slice(0,J),I=L.slice(J+1);F[K]=I}return F}else{return decodeURIComponent(E[1])}}else{return""}};if(location.href.indexOf("taobao")==-1){return true}var p=B("_nk_");var C=((B("_l_g_")||B("uc1")["cookie15"])&&p)||B("ck1");return !!C},checkAndShowLogin:function(F){var E=this;if(E.checkLogin()){return true}F=F||{};var I=null;if(F.callback){I=F.callback}else{if(F.autoCallback&&arguments.callee.caller){try{var p=arguments.callee.caller,H=p.arguments||[],J=F.callbackScope||{},B=[],D;for(var C=0;C<H.length;++C){D=H[C];if(i.isObject(D)&&D.srcElement){D=i.merge({},D)}B.push(D)}I=p?function(){try{p&&p.apply(J,B)}catch(K){}}:null}catch(G){I=null}}}if(window.UserCheck&&window.UserCheck.init){window.UserCheck.init({width:354,height:285,isLogin:true,extraWrapperClass:"",callback:function(){I&&I();E.getToken()}})}else{location.href=E.buildURI(E.getApiURI("portal:/admin/login.htm"),"redirect_url="+encodeURIComponent(location.href))}return false},getCheckCodeURI:function(p,E,B){var C=this,D=new SNS.sys.BasicDataSource({url:C.getServerURI(B||"checkCode")});D.jsonp(E,p);return g},getToken:function(){var p=this;e.script(p.buildURI(p.getApiURI(w.apiToken),"callback=SNS.sys.Helper.setToken"),{charset:"gbk"});return g},setToken:function(p,B){p&&t(p);B&&B();return g}};m={addMaxLenSupport:function(p,H,B,G){var K=function(){};var E=function(N){return H||parseInt(N.getAttribute("maxlength")||"0",10)};var F=function(Q){var O=l.getTarget(Q),P=O.value,N=E(O);if(N>0&&P.length>N){O.value=P.substr(0,N)}};var M=function(P){var O=l.getTarget(P),N=E(O);if(O.value.length===N){l.preventDefault(P)}};var D=function(R){var P=l.getTarget(R),O=l.getCharCode(R),N=E(P);if(N<1||O===8||O===46||R.ctrlKey||R.altKey){return}var Q=P.value;if(Q.length>=N){l.preventDefault(R)}};function C(O,N,P){return function(Q){var R=l.getTarget(Q);if(o.hasClass(R,O)){N(Q);if(P){P(R)}}}}if(B){if(!p){p=A.body}var I=C(B,D,G);var J=C(B,F,G);var L=C(B,M,G);l.on(p,"keydown",I);l.on(p,"keyup",J);l.on(p,"change",J);l.on(p,"blur",J);l.on(p,"paste",L)}else{l.on(p,"keydown",D);l.on(p,"keyup",F);l.on(p,"change",F);l.on(p,"blur",F);l.on(p,"paste",M)}return g},doReflow:function(p){if(n.ie>0&&n.ie<8){p=p||A.body;var B="fix-ie-layout-problem-hack";o.addClass(p,B);o.removeClass(p,B)}return g},fixCursorPosition:function(B){if(n.ie){function C(G){var H,D,E=A.selection.createRange(),F;if(E.parentElement().id==G.id){F=A.body.createTextRange();F.moveToElementText(G);for(H=0;F.compareEndPoints("StartToStart",E)<0;H++){F.moveStart("character",1)}F=A.body.createTextRange();F.moveToElementText(G);for(D=0;F.compareEndPoints("StartToEnd",E)<0;D++){F.moveStart("character",1)}}return[H,D]}B=o.get(B);if(!B.getAttribute("data-cursorfixed")){B.setAttribute("data-cursorfixed","true");var p=null;l.on(B,"beforedeactivate",function(){p=C(B);B.setAttribute("data-lastcursor",p.join(","))})}}return g},fixHover:function(B){if(6===n.ie&&B){var E=i.merge({hoverClass:"hover",checkPopuped:false},B),C=E.container,D=E.tagName,H=E.hoverClass,K=E.itemClass,J=E.elements,I=E.checkPopuped,G=E.onMouseEnter,L=E.onMouseLeave;if(!J&&i.isString(C)&&D){C=o.get(C);J=C.getElementsByTagName(D)}else{if(!J){J=[]}}var p=function(M){o.addClass(l.getTarget(M),H);G&&G(M)};var F=function(M){if(I&&l.getTarget(M).getAttribute("popuped")){return}o.removeClass(l.getTarget(M),H);L&&L(M)};o.batch(J,function(M){if(K&&!o.hasClass(M,K)){return}l.on(M,"mouseenter",p);l.on(M,"mouseleave",F)})}return g},fixTextAreaFocus:function(C){var B=this;if(n.ie>0&&n.ie<8){function p(E){var D=l.getTarget(E);l.removeListener(D,"click",arguments.callee);setTimeout(function(){var F=document.body.createTextRange();F.moveToElementText(D);F.select();D.focus();D.select();B.recoverCursorPos(D)},0)}l.on(C,"click",p)}return g}};h={insertText:function(D,F){D=o.get(D);var C=D.value;D.focus();if(typeof document.selection!=="undefined"){var B=document.selection.createRange();B.text=F;B.setEndPoint("StartToEnd",B);B.select()}else{var E=D.selectionStart,p=D.selectionEnd;D.value=C.substr(0,E)+F+C.substr(E);D.selectionStart=E+F.length;D.selectionEnd=D.selectionStart;D.setSelectionRange&&D.setSelectionRange(D.selectionEnd,D.selectionEnd)}o.setAttribute(D,"data-lastcursor","");return g},recoverCursorPos:function(D){if(n.ie){var p=D.getAttribute("data-lastcursor");if(!p){return}if(D.value===""){p="0,0"}p=p.split(",");D.focus();var B=document.selection.createRange(),C;if(B.parentElement().id==D.id){C=document.body.createTextRange();C.moveToElementText(D);B.setEndPoint("StartToStart",C);B.setEndPoint("EndToStart",B);B.moveStart("character",p[0]*1);B.moveEnd("character",p[1]*1-p[0]*1);B.select()}}return g}};u={addStamp:function(p){return this.buildURI(p,"t="+new Date().getTime())},buildURI:function(){var p=Array.prototype.slice.call(arguments);if(p.length<2){return p[0]||""}var B=p.shift();B+=B.indexOf("?")>0?"&":"?";return B+p.join("&").replace(/&+/g,"&")},getApiURI:function(H,E,C){var G=this;if(!(H.substr(0,7)==="http://"||H.substr(0,8)==="https://")&&H.indexOf(":")>0){var J=H.indexOf(":");var B=r[H.substr(0,H.indexOf(":"))]||"";if(B!==""){H=(B+H.substr(J+1)).replace(/assets\.taobaocdn\.com/,"a.tbcdn.cn")}}if(typeof E=="undefined"?true:E){H=G.addStamp(H)}if(!C){var p=o.get("Jianghu_tb_token");if(p){var I=p.getElementsByTagName("INPUT");for(var D=0;D<I.length;D++){if(I[D].value){H=G.buildURI(H,[I[D].name,encodeURIComponent(I[D].value)].join("="))}}}}var F=KISSY.substitute(H,{serverHost:v,cdnHost:z});return F},getAssetsURI:function(B,p,C){return this.getApiURI((C?"assetsV:":"assets:")+B,p,true)},getServerURI:function(p){return r[p]},regApiServer:function(B,p){i.augmentObject(r,B,!!p);return g}};y={addModuleSupport:(function(){var B=function(){this._names=[];this._stroe={}};i.augmentObject(B.prototype,{_names:[],_store:{},add:function(C,D){if(C&&D){this[C]=D;this._names.push(C);this._store[C]=D}},get:function(C){return this._store[C]||null},initAll:function(F){var H=this._names,D=this._store,E,C;for(var G=0;G<H.length;++G){E=H[G];if(D[E]&&D[E].init){C=F[E]||F[E.substr(0,1).toLowerCase()+E.substr(1)]||F[E.toLowerCase()]||null;C&&D[E].init(C,F)}}}});var p=function(F,E,D,C){return function(){if(E.apply(F,arguments)!==false){C.apply(D,arguments)}}};return function(D){var C=new B();D.Modules=C;if(D.init){D.init=p(D,D.init,C,C.initAll)}return C}})(),createCallback:(function(){var p=new Date().getTime();return function(C){var B="json"+p++;window[B]=C;return B}})(),cutStr:function(D,p,C){if(p&&p>0){var B=D.replace(/[^\x00-\xFF]/g,"\xFF\xFF");if(B.length>p){D=D.substr(0,p-(B.substr(0,p).match(/[\xFF]/g)||[]).length/2);if(C||typeof C==="undefined"){D+="..."}}}return D},getParmsByAttr:function(F){var G={},B,E,p,D;for(var C=0,p=F.attributes.length;C<p;C++){D=F.attributes[C];B=D.nodeName;E=D.nodeValue;if(B.substring(0,5)=="data-"){G[B.substring(5)]=E}}return G},lightww:function(B){var C=this,p;if(B&&B.container){p=B.container}else{p=o.get(B)}if(p){if(i.isArray(p)){o.batch(p,function(E){arguments.callee.call(C,{container:E})})}else{if(typeof Light!="undefined"&&Light){try{Light.light(p)}catch(D){}}}}return g},pickDocumentDomain:f,showMessage:function(C,p){var D={content:C,cancelBtn:false,zIndex:9999},B=YAHOO.lang.merge(D,p||{});return g.sys.snsDialog(B)},showConfirm:function(D,F,B){var p;var E={content:D,confirmBtn:function(){var G=F();if(G!==false){if(p){p.hide()}}}},C=i.merge(E,B||{});p=g.sys.snsDialog(C);return p}};g.sys.Helper=x=i.merge(a,m,h,u,y);SNS.add("form",function(F){var B=YAHOO,C=B.util,p=C.Dom,P=C.Event,M=B.lang,O=document,K=window,H=F.sys,N=F.app,G=H.Helper,J=function(L){var E,D,R,Q,S;E=O.createElement("input");S=Boolean("placeholder" in E);E=null;J=function(T){if(S){return}if(M.isArray(T)||T.length){p.batch(T,arguments.callee);return}D=T.getAttribute("placeholder");if(KISSY.trim(T.value)==""){T.value=D}P.on(T,"focus",function(){R=this;D=T.getAttribute("placeholder");if(R.value==D){R.value="";6==YAHOO.env.ua.ie&&p.addClass(R,"focus")&&G.doReflow()}});P.on(T,"blur",function(){R=this;D=T.getAttribute("placeholder");if(KISSY.trim(R.value)==""){R.value=D;6==YAHOO.env.ua.ie&&p.removeClass(R,"focus")&&G.doReflow()}})};J(L)},I;I={setPlaceHolder:J};return(H.form=I)})},"SNS.util.Popup");