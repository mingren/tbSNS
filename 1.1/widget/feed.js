SNS("SNS.widget.Feed",function(){(function(){var g=SNS.sys.Class,m=YAHOO.util.Dom,l=SNS.sys.Helper,i=SNS.sys.BasicDataSource;var k=new g({implement:SNS.sys.DataSourceManager,initialize:function(n){this.config={saveMain:{url:"http://share.jianghu.{serverHost}/share/shareMyResource.htm",iframeProxy:"http://share.jianghu.{serverHost}/share/proxy.htm"},saveSub:{url:"http://share.jianghu.{serverHost}/share/shareOtherResource.htm",iframeProxy:"http://share.jianghu.{serverHost}/share/proxy.htm"},previewMainShare:{url:"http://share.jianghu.{serverHost}/share/fetchResource.htm?_input_charset=utf-8"},previewSubShare:{url:"http://share.jianghu.{serverHost}/share/find_feed.htm"},omit:{url:"http://share.jianghu.{serverHost}/share/omitShare.htm"}};for(var o in this.config){if(o==="omit"){this.config[o].url=l.getApiURI(this.config[o].url,false,false)}else{this.config[o].url=l.getApiURI(this.config[o].url,false,true)}if(this.config[o].iframeProxy){this.config[o].iframeProxy=l.getApiURI(this.config[o].iframeProxy,false,true)}}this.config=YAHOO.lang.merge(this.config,n||{});for(var o in this.config){this.registerDataSource(o,this.config[o],this.config.callBackContext)}},saveMainShare:function(n,o){this.getDataSource("saveMain").iframeProxy(n,o)},saveSubShare:function(n,o){this.getDataSource("saveSub").iframeProxy(n,o)},previewMainShare:function(n,o){this.getDataSource("previewMainShare").jsonp(n,o)},previewSubShare:function(n,o){this.getDataSource("previewSubShare").jsonp(n,o)},omitShare:function(n,o){this.getDataSource("omit").jsonp(n,o)}});SNS.sys.ShareDataSource=k;var j=new g({initialize:function(o,n){if(!SNS.sys.Helper.checkAndShowLogin({callback:function(){location.replace(location.href)}})){return}this.dataSource=new k({callBackContext:this});this.parms=o;this.config={zIndex:99,width:"440px",opacity:0.5,success:null,failure:null,hideHandle:true};g.mixin(this.config,n)},getHtml:function(n){return'<div class="share-popup"><div class="logo"></div><div class="sns-tab tab-app"><ul><li class="selected"><a href="#"><span>\u6211\u8981\u8f6c\u5e16</span></a></li></ul></div><div class="content sns-nf"><div class="subject">'+n+'</div><p class="reason"><label>\u8f6c\u5e16\u7406\u7531\uff1a</label><textarea class="share-comment" style="vertical-align:top" ></textarea></p><p class="act skin-blue"><span class="btn n-btn"><a href="#url" >\u7acb\u5373\u8f6c\u5e16</a></span><span style="margin-left:100px;"><a href="http://fx.taobao.com/view/share_look.htm?tracelog=tfxindex004" target="_blank">\u770b\u770b\u5927\u5bb6\u5206\u4eab\u4e86\u4ec0\u4e48\u5b9d\u8d1d</a></span></p></div></div>'},getShareUrlHtml:function(n){return'<div class="share-url"><p class="title"><input class="share-title f-txt" value="" type="text"/></p><p class="url" title="'+n.uri+'">'+n.uri+"</p> </div>"},getShareBlogHtml:function(n){return'<div class="share-url"><p class="title"><input class="share-title f-txt" value="" type="text"/></p><p >'+n.other+"</p> </div>"},getShareVideoHtml:function(n){return' <div class="share-video"><div class="pic"><img  src="'+n.coverPath+'"  width="120px" height="80px"/><div class="play-btn"> </div></div><div class="share-txt"><p class="title"><input class="f-txt" value="" type="text"/></p><p class="url" title="'+n.uri+'">'+n.uri+"</p></div>"},getShareAudioHtml:function(n){return'<div class="share-audio"><div class="share-txt"><input type="text" class="f-txt" value=""/></div><embed class="audio"  flashvars="loadMusicFile='+n.uri+'&autoplay=0" wmode="transparent" pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+SNS.sys.Helper.getServerURI("assets")+'/img/player.swf" type="application/x-shockwave-flash" width="220" height="50"></embed></div>'},getShareAlbumHtml:function(n){return'<div class="share-album"><div class="pic"><span class="album-bg"><span class="lbg"></span><span class="rbg"></span><span class="img"><img  src="'+n.coverPath+'"/> </span></span></div> <div class="share-txt "><p class="title"><input class=" f-txt" value="" type="text"/></p> <p class="url"></p></div>  </div>'},getShareShopHtml:function(o){var n=o.coverPath||"http://img08.taobaocdn.com/tps/i8/T1RP4vXjxbXXXXXXXX-80-80.png";return'<div class="share-shop"> <div class="pic"><div class="bg"></div> <img class="cover"  src="'+n+'"  width="80px" height="80px"> <div class="intro"> <p>\u638c\u67dc:<a target="_blank" href="'+o.uri+'">'+o.ownerNick+"</a></p> <p>\u4fe1\u7528:"+o.sellerNumPic+'</p></div> </div> <div class="share-txt"> <p class="title"><input class="f-txt" value="" type="text"/> </p><p class="url" title="'+o.uri+'">'+o.uri+"</p>  </div> </div>"},getShareGoodsHtml:function(o){var n=o.coverPath||"http://img06.taobaocdn.com/tps/i6/T1ajNvXcteXXXXXXXX-80-80.png";return'<div class="share-goods"><div class="pic"><img  src="'+n+'"  width="80px" height="80px"/></div><div class="share-txt"> <p class="title"><input class="f-txt" value="" type="text"/></p><p>\uffe5 <span class="price">'+o.price+'</span>\u5143</p><p class="url" title="'+o.uri+'">'+o.uri+"</p></div></div>"},showMain:function(){if(this.dataSource){this.dataSource.previewMainShare(this.parms,this.showPopup);return this}},showSub:function(){if(this.dataSource){this.dataSource.previewSubShare(this.parms,this.showPopup);return this}},showPopup:function(n){if(!n){SNS.sys.Helper.showMessage('\u94fe\u63a5\u4e0d\u53ef\u7528,<a href="http://im.robot.aliapp.com/all/aliqzg/index.jsp?id=2&page=ljbky&ask=%E4%B8%BA%E4%BB%80%E4%B9%88%E8%BD%AC%E5%B8%96%E6%97%B6%EF%BC%8C%E6%8F%90%E7%A4%BA%E9%93%BE%E6%8E%A5%E4%B8%8D%E5%8F%AF%E7%94%A8%EF%BC%9F" target="_blank">\u67e5\u770b\u5e2e\u52a9</a>');return}if(n.isBlack){SNS.sys.Helper.showMessage('\u94fe\u63a5\u4e0d\u53ef\u7528,\u8bf7\u91cd\u65b0\u8f93\u5165!<a href="http://im.robot.aliapp.com/all/aliqzg/index.jsp?id=2&page=ljbky&ask=%E4%B8%BA%E4%BB%80%E4%B9%88%E8%BD%AC%E5%B8%96%E6%97%B6%EF%BC%8C%E6%8F%90%E7%A4%BA%E9%93%BE%E6%8E%A5%E4%B8%8D%E5%8F%AF%E7%94%A8%EF%BC%9F" target="_blank">\u67e5\u770b\u5e2e\u52a9</a>');return}switch(n.resourceType){case"0":this.url(n);break;case"1":this.video(n);break;case"2":this.audio(n);break;case"4":this.album(n);break;case"6":this.blog(n);break;case"7":this.url(n);break;case"9":this.goods(n);break;case"10":this.shop(n);break;case"12":this.goods(n);break;case"13":this.url(n);break}},createPopup:function(o,p){var n=this;this.panel=new SNS.sys.snsCenterPanel(o,this.config);var q=m.getElementsByClassName("f-txt","input",this.panel.content)[0];q.value=p.title;this.panel.addEvent("btn n-btn","span","click",function(){n.saveShare(p,this)});return this.panel},url:function(o){var n=this.getHtml(this.getShareUrlHtml(o));this.createPopup(n,o)},blog:function(o){var n=this.getHtml(this.getShareBlogHtml(o));this.createPopup(n,o)},audio:function(o){var n=this.getHtml(this.getShareAudioHtml(o));this.config.onHide=function(){var p=m.getElementsByClassName("subject","div",this.content)[0];p.innerHTML=""};this.createPopup(n,o)},video:function(o){var n=this.getHtml(this.getShareVideoHtml(o));this.createPopup(n,o)},album:function(o){var n=this.getHtml(this.getShareAlbumHtml(o));this.createPopup(n,o)},goods:function(o){var n=this.getHtml(this.getShareGoodsHtml(o));this.createPopup(n,o)},shop:function(o){var n=this.getHtml(this.getShareShopHtml(o));this.createPopup(n,o)},saveShare:function(p,n){var o=this;var r=n.container.getElementsByTagName("input")[0].value;if(!r){SNS.sys.Helper.showMessage("\u5199\u4e2a\u6807\u9898\u5427\uff0c\u670b\u53cb\u4eec\u4e0d\u77e5\u9053\u662f\u4ec0\u4e48\u4e1c\u4e1c");return}if(r.length>120){SNS.sys.Helper.showMessage("\u6807\u9898\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e120\u4e2a\u5b57\u7b26");return}if(r.replace(/\s/g,"")==""){SNS.sys.Helper.showMessage("\u6807\u9898\u4e0d\u80fd\u4e3a\u7a7a");return}var s=n.container.getElementsByTagName("textarea")[0].value;if(s.length>210){SNS.sys.Helper.showMessage("\u8f6c\u5e16\u7406\u7531\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e210\u4e2a\u5b57\u7b26");return}if(this._lock){return}this._lock=true;var q=function(t){this._lock=false;if(!o.config.success&&!o.config.failure){n.hide()}switch(t){case 1:SNS.sys.Helper.showMessage("\u8f6c\u5e16\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5");if(o.config.failure){o.config.failure()}break;case 2:SNS.sys.Helper.showMessage("\u8f6c\u5e16\u6210\u529f");if(o.config.success){o.config.success.apply(this,arguments)}break;case 3:SNS.sys.Helper.showMessage("\u60a8\u8fd8\u6ca1\u6709\u767b\u5f55\uff0c\u8bf7\u5148\u767b\u5f55");if(o.config.failure){o.config.failure()}break;case 4:SNS.sys.Helper.showMessage("\u94fe\u63a5\u4e0d\u53ef\u7528\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165!");if(o.config.failure){o.config.failure()}break;case 5:SNS.sys.Helper.showMessage("\u8f6c\u5e16\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5");if(o.config.failure){o.config.failure()}break;default:SNS.sys.Helper.showMessage("\u8f6c\u5e16\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5");if(o.config.failure){o.config.failure()}break}};g.mixin(p,{title:r,comment:s});switch(p.isMain){case true:this.dataSource.saveMainShare(p,q);break;case false:this.dataSource.saveSubShare(p,q);break}}});var h=false;SNS.widget.Share={shareMain:function(r,p){var o=function(){h=false};var q;if(p){p.onHide=o;q=p}else{q={onHide:o}}if(!h){var n=new j(r,q).showMain()}h=true;if(!n){h=false}return n},shareSub:function(r,p){var o=function(){h=false};var q;if(p){p.onHide=o;q=p}else{q={onHide:o}}if(!h){var n=new j(r,q).showSub()}h=true;if(!n){h=false}return n},omitShare:function(n,p){var o=new k();o.omitShare(n,p)}}})();var a=KISSY,e=a.DOM,d=a.Event,f=a.JSON,c=SNS.sys.Helper;var b=function(g){b.superclass.constructor.call(this,g)};b.ATTRS={rootNode:{value:"#J_FeedsContainer"},paramGetFeed:{value:{page:1}}};b.EVENTS={click:{".icon-del-simple":"delFeedEvent",".J_DeleteMB":"delJiwaiFeedEvent",".icon-filter-simple":"filterFeedEvent",".J_viewMoreFresh":"loadMoreFeedEvent",".small-img":"zoomOutEvent",".J_ZoomInImg":"zoomInEvent",".big-img":"zoomInEvent",".J_FeedTab,.J_MoreTab":"feedTabEvent",".J_Share":"shareEvent",".J_Reply":"cmtEvent",".J_Forward":"forwardEvent",".sns-linkcheck":"checkLinkEvent",".more-share":"showMoreShareEvent",".J_ShowMoreFeed":"showMoreFeedEvent",".subscribe-cancle":"subscribeCancle"},mouseenter:{".short-url":function(h,g){SNS.widget.ShortLink.show(h,g)}},mouseleave:{".short-url":function(h,g){SNS.widget.ShortLink.hide(h,g)}}};b.DOMS={item:{parent:".item"}};b.AOPS={before:{"*Event":"preventDefault",delJiwaiFeedEvent:"checkLogin"}};SNS.Base.extend(b,SNS.data.Feed,{init:function(){this.fixedHover(this.get("rootNode"));return this},scrollLoadFeed:function(g){var h=this,l="getFeed",i=this.getData(l);g=g||{};var k=a.merge(this.get("paramGetFeed"),g.param||{});var j=new SNS.util.ScrollLoad({url:g.url||i.url,param:k,el:g.el||e.get(h.get("rootNode")),success:function(m,o,n){if(g.success){g.success(m,o,n)}h.fixedHover(n)}}).init();return j},loadFeed:function(g){a.log("load feed");var h=this,l="getFeed",k=this.getData(l);var n={};var j=g.el||e.get(h.get("rootNode"));var i=g.url||k.url;var m=document.createElement("div");m.innerHTML="<img src='http://img06.taobaocdn.com/tps/i6/T13l0vXhRrXXXXXXXX-24-24.gif' alt='loading ...' /><br /><br />";j.appendChild(m);n.data=a.merge(this.get("paramGetFeed"),g.param||{page:1});n.success=function(o){m.style.display="none";e.remove(m);j.innerHTML=o.responseText;if(g.success){g.success(o.responseText)}};SNS.request(i,n)},loadMoreFeedEvent:function(k,i){var l=e.attr(i,"data-param");if(!l){return}var h=this;var j=e.get(h.get("rootNode"));var m=document.createElement("div");m.innerHTML="<img src='http://img06.taobaocdn.com/tps/i6/T13l0vXhRrXXXXXXXX-24-24.gif' alt='loading ...' /><br /><br />";j.appendChild(m);l=a.JSON.parse(l);var g={data:l,success:function(n){m.style.display="none";e.remove(m);j.innerHTML+=n.responseText}};e.remove(i);SNS.request(i.href,g)},delFeedEvent:function(i,g){var h=this.getDOM("item",g);this.simpleLoadData("delFeed",function(){var k=e.get(".show-more",h);if(!k){e.remove(h)}else{var j='<div style="border:0;margin-top:0;padding-top:0;" class="show-more">'+k.innerHTML+"</div>";h.innerHTML=j}},h,g)},delJiwaiFeedEvent:function(m,k){var n="delJiwaiFeed",i=this,h,l=this.getDOM("item",k),j,g;j=function(){if(h){h.hide()}i.simpleLoadData(n,function(){var p=e.get(".show-more",l);if(!p){e.remove(l)}else{var o='<div style="border:0;margin-top:0;padding-top:0;" class="show-more">'+p.innerHTML+"</div>";l.innerHTML=o}},l,k)},g=e.attr("data-txt",k)||"\u60a8\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u6761\u53fd\u6b6a\u5417?";h=c.showConfirm(g,j)},filterFeedEvent:function(m,k){m.preventDefault();var n="filterFeed",i=this,h,l=this.getDOM("item",k),j=function(){if(h){h.hide()}i.simpleLoadData(n,function(){var p=e.get(".show-more",l);if(!p){e.remove(l)}else{var o='<div style="border:0;margin-top:0;padding-top:0;" class="show-more">'+p.innerHTML+"</div>";l.innerHTML=o}},k)},g=e.attr("data-txt",k)||"\u4ee5\u540e\u4e0d\u518d\u63a5\u6536<span>\u8fd9\u4e2a\u597d\u53cb\u7684\u8be5\u7c7b\u578b</span>\u52a8\u6001\uff0c\u4f60\u786e\u8ba4\u5417?(\u4f60\u53ef\u4ee5\u5728\u9690\u79c1\u8bbe\u7f6e\u91cc\u89e3\u9664\u6b64\u5c4f\u853d)?";h=c.showConfirm(g,j)},shareEvent:function(i,h){var g=e.parent(h),j=f.parse(e.attr("data-param",g));SNS.widget.Share.shareSub(j)},zoomOutEvent:function(k,n){k.preventDefault();var o=this,m=e.parent(n,".item"),h=e.get("img.small-img",m),j=e.get("img.big-img",m),g=e.get("a.toggle",m);e.addClass(g,"J_ZoomInImg");g.innerHTML="\u6536\u8d77";var l=g.parentNode;var i=function(){setTimeout(function(){h.style.display="none";j.style.display="block";o.resize(j,430,1500);e.removeClass(l,"hidden");var p=YAHOO.util.Dom.getNextSibling(m);p&&c.doReflow(p)},50)};if(j.src!=h.getAttribute("data-src")){j.onload=function(){i()};j.src=h.getAttribute("data-src")}else{i()}},zoomInEvent:function(k,n){k.preventDefault();var o=this,m=e.parent(n,".item"),h=e.get("img.small-img",m),j=e.get("img.big-img",m),g=e.get("a.toggle",m);var l=g.parentNode;h.style.display="block";j.style.display="none";e.addClass(l,"hidden");var i=YAHOO.util.Dom.getNextSibling(m);i&&c.doReflow(i)},cmtEvent:function(l,i){l.preventDefault();var k=e.parent(i,".item"),j=e.get(".fd-reply",k),h=this,g;if(i._status==1){j.innerHTML="";e.addClass(j,"hidden");i._status=0;return}i._status=1;e.removeClass(j,"hidden");if(i._c){i._c.init()}else{g=f.parse(e.attr(i,"data-cfg"));g.rootNode=j;g.initCmtCallback=function(){i._c.focus()};a.mix(g,h.get("commentCallback"));i._c=new SNS.widget.Comment(g);i._c.init()}return i._c},forwardEvent:function(j,i){j.preventDefault();var h=this,g;g=f.parse(e.attr(i,"data-cfg"));return new SNS.widget.Forward(g).init()},resize:function(i,g,j){var l=g/j;var k=i.width/i.height;if(k>=l&&i.width>g){i.width=g;i.height=i.width/k}else{if(k<l&&i.height>j){i.height=j;i.width=i.height*k}}},checkLogin:function(h){var g=function(){};if(!c.checkAndShowLogin({callback:g})){h.halt()}},checkLinkEvent:function(h,g){new SNS.sys.LinkCheck(g).check()},toggleClass:function(h,g){e.toggleClass(g,"hover")},preventDefault:function(g){KISSY.log("preventDefault");KISSY.log(g&&g.arguments&&g.arguments[0]);KISSY.log(g.arguments[0].preventDefault);if(g&&g.arguments&&g.arguments[0]){g.arguments[0].preventDefault()}},fixedHover:function(g){var h=e.query(".item",g);d.on(h,"mouseenter",function(i){e.addClass(i.currentTarget,"hover")});d.on(h,"mouseleave",function(i){e.removeClass(i.currentTarget,"hover")})},showMoreShareEvent:function(h,g){if(g._status==1){return}g._status=1;var i=e.attr(g,"data-param");if(i){i=a.JSON.parse(i)}this.loadData("moreShare",function(k){var j=SNS.sys.snsNearbyPanel(g,k.result.html,{width:"400px",offsetTop:"-50px",offsetLeft:"80px",hideHandle:true,onShow:function(){if(a.get("span",g)){a.get("span",g).className="fd-open"}},onHide:function(){if(a.get("span",g)){a.get("span",g).className="fd-close"}}}).show()},i)},showMoreFeedEvent:function(k,i){var l=e.attr(i,"data-param");var g=e.attr(i,"data-url");var h=e.parent(i,".show-more");var j=e.parent(i,".item");if(l){l=a.JSON.parse(l)}SNS.request(g,{data:l,dataType:"html",success:function(n){e.remove(h);var m=e.create("<div>");m.innerHTML=n;e.insertAfter(m,j)}})},subscribeCancle:function(i,h){var g=e.attr(h,"data-url");SNS.request(c.getApiURI(g),{dataType:"json",success:function(j){if(j.state=="1"){c.showMessage(j.message)}else{c.showMessage(j.message)}}})}});SNS.widget.Feed=b},"SNS.util.Ajax,SNS.data.Feed,SNS.widget.ShortLink,SNS.util.ScrollLoad,SNS.widget.Comment,SNS.widget.Forward");