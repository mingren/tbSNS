
SNS("SNS.widget.Feed", function(){

          /**
 * 发布转帖
 * author zhangquan
 * time 2009.10.14
 */

(function(){


    var Class=SNS.sys.Class,Dom=YAHOO.util.Dom,Helper=SNS.sys.Helper,BasicDataSource=SNS.sys.BasicDataSource;

    var ShareDataSource=new Class({
        implement:SNS.sys.DataSourceManager,

        initialize:function(config){

            this.config={
                saveMain:{
                    url:'http://share.jianghu.{serverHost}/share/shareMyResource.htm',
                    iframeProxy:'http://share.jianghu.{serverHost}/share/proxy.htm'
                },
                saveSub:{
                    url:'http://share.jianghu.{serverHost}/share/shareOtherResource.htm',
                    iframeProxy:'http://share.jianghu.{serverHost}/share/proxy.htm'
                },
                previewMainShare:{
                    url:'http://share.jianghu.{serverHost}/share/fetchResource.htm?_input_charset=utf-8'
                },
                previewSubShare:{
                    url:'http://share.jianghu.{serverHost}/share/find_feed.htm'
                },
                omit:{
                    url:'http://share.jianghu.{serverHost}/share/omitShare.htm'
                }

            }
             for(var p in this.config){

                    if(p==="omit"){
                          this.config[p].url=Helper.getApiURI(this.config[p].url,false,false);
                    }
                    else{
                        this.config[p].url=Helper.getApiURI(this.config[p].url,false,true);

                    }
                if(this.config[p].iframeProxy)this.config[p].iframeProxy=Helper.getApiURI(this.config[p].iframeProxy,false,true);

            }
            this.config=YAHOO.lang.merge(this.config,config||{});




            for(var p in this.config){
                this.registerDataSource(p,this.config[p],this.config.callBackContext);
            }
        },

        saveMainShare:function(parms,callBack){
            this.getDataSource("saveMain").iframeProxy(parms,callBack);
        },

        saveSubShare:function(parms,callBack){
            this.getDataSource("saveSub").iframeProxy(parms,callBack);
        },

        previewMainShare:function(parms, callBack){
            this.getDataSource("previewMainShare").jsonp(parms,callBack);
        },

        previewSubShare:function(parms,callBack){
            this.getDataSource("previewSubShare").jsonp(parms,callBack);
        },

        omitShare:function(parms,callBack){
            this.getDataSource("omit").jsonp(parms,callBack);
        }

    });

SNS.sys.ShareDataSource=ShareDataSource;
    var SharePopup=new Class({

        initialize:function(parms,config){
            // 检查登录状态，没登录直接显示登录框

            if (!SNS.sys.Helper.checkAndShowLogin({
                callback:function() {
					location.replace(location.href);
				}
            })) {
                return;
            }

            this.dataSource=new ShareDataSource({
                callBackContext:this
            });

            this.parms=parms;
            this.config={
                zIndex:99,
                width:"440px",
                opacity:0.5,
                success:null,
                failure:null,
                hideHandle:true
            };
            Class.mixin(this.config, config);


        },
        getHtml:function(html){
            return '<div class="share-popup">'+
            '<div class="logo"></div>'+
            '<div class="sns-tab tab-app">'+
            '<ul>'+
            '<li class="selected"><a href="#"><span>我要转帖</span></a></li>'+
            '</ul>'+
            '</div>'+
            '<div class="content sns-nf">'+
            '<div class="subject">'+html+'</div>'+
            '<p class="reason"><label>转帖理由：</label>'+
            '<textarea class="share-comment" style="vertical-align:top" ></textarea>'+
            '</p>'+
            '<p class="act skin-blue"><span class="btn n-btn"><a href="#url" >立即转帖</a></span><span style="margin-left:100px;"><a href="http://fx.taobao.com/view/share_look.htm?tracelog=tfxindex004" target="_blank">看看大家分享了什么宝贝</a></span></p>'+
            '</div>'+
            '</div>';

        },
        getShareUrlHtml:function(data){
            return   '<div class="share-url">'+
            '<p class="title"><input class="share-title f-txt" value="" type="text"/></p>'+
            '<p class="url" title="'+data.uri+'">'+data.uri+'</p>'+
            ' </div>';
        },
        getShareBlogHtml:function(data){
            return   '<div class="share-url">'+
            '<p class="title"><input class="share-title f-txt" value="" type="text"/></p>'+
            '<p >'+data.other+'</p>'+
            ' </div>';
        },

        getShareVideoHtml:function(data){
            return	 ' <div class="share-video">'+
            '<div class="pic"><img  src="'+data.coverPath+'"  width="120px" height="80px"/><div class="play-btn"> </div></div>'+
            '<div class="share-txt">'+
            '<p class="title"><input class="f-txt" value="" type="text"/></p>'+
            '<p class="url" title="'+data.uri+'">'+data.uri+'</p>'+
            '</div>';
        },

        getShareAudioHtml:function(data){
            return '<div class="share-audio">'+
            '<div class="share-txt"><input type="text" class="f-txt" value=""/></div>'+
            '<embed class="audio"  flashvars="loadMusicFile='+data.uri+'&autoplay=0" wmode="transparent" pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+SNS.sys.Helper.getServerURI("assets")+'/img/player.swf" type="application/x-shockwave-flash" width="220" height="50"></embed>'+
            '</div>';

        },
        getShareAlbumHtml:function(data){
            return  '<div class="share-album">'+

            '<div class="pic">'+
            '<span class="album-bg">'+
            '<span class="lbg"></span><span class="rbg"></span><span class="img">'+
            '<img  src="'+data.coverPath+'"/>'+
            ' </span></span></div>'+
            ' <div class="share-txt ">'+
            '<p class="title"><input class=" f-txt" value="" type="text"/></p>'+
            ' <p class="url"></p>'+
            '</div>'+
            '  </div>';

        },
        getShareShopHtml:function(data){
            var newCoverPath=data.coverPath||"http://img08.taobaocdn.com/tps/i8/T1RP4vXjxbXXXXXXXX-80-80.png";
            return  '<div class="share-shop">'+
            ' <div class="pic">'+
            '<div class="bg"></div>'+
            ' <img class="cover"  src="'+newCoverPath+'"  width="80px" height="80px">'+
            ' <div class="intro">'+
            ' <p>掌柜:<a target="_blank" href="'+data.uri+'">'+data.ownerNick+'</a></p>'+
            ' <p>信用:'+data.sellerNumPic+'</p>'+
            '</div>'+
            ' </div>'+
            ' <div class="share-txt"> <p class="title"><input class="f-txt" value="" type="text"/> </p>'+
            '<p class="url" title="'+data.uri+'">'+data.uri+'</p>'+
            '  </div>'+
            ' </div>';

        },
        getShareGoodsHtml:function(data){
			 var newCoverPath=data.coverPath||"http://img06.taobaocdn.com/tps/i6/T1ajNvXcteXXXXXXXX-80-80.png";
            return  '<div class="share-goods">'+
            '<div class="pic">'+
            '<img  src="'+newCoverPath+'"  width="80px" height="80px"/>'+
            '</div>'+
            '<div class="share-txt"> <p class="title"><input class="f-txt" value="" type="text"/></p>'+
            '<p>￥ <span class="price">'+data.price+'</span>元</p><p class="url" title="'+data.uri+'">'+data.uri+'</p></div>'+
            '</div>';
        },

        showMain:function(){
            if(this.dataSource)  {
                this.dataSource.previewMainShare(this.parms,this.showPopup);
                return this;
            }

        },
        showSub:function(){

            if(this.dataSource) {this.dataSource.previewSubShare(this.parms,this.showPopup);
            return this;
            }
        },


        showPopup:function(data){
            if(!data){
                SNS.sys.Helper.showMessage('链接不可用,<a href="http://im.robot.aliapp.com/all/aliqzg/index.jsp?id=2&page=ljbky&ask=%E4%B8%BA%E4%BB%80%E4%B9%88%E8%BD%AC%E5%B8%96%E6%97%B6%EF%BC%8C%E6%8F%90%E7%A4%BA%E9%93%BE%E6%8E%A5%E4%B8%8D%E5%8F%AF%E7%94%A8%EF%BC%9F" target="_blank">查看帮助</a>');
                return;
            }
            //判断黑名单
            if(data.isBlack){
                SNS.sys.Helper.showMessage('链接不可用,请重新输入!<a href="http://im.robot.aliapp.com/all/aliqzg/index.jsp?id=2&page=ljbky&ask=%E4%B8%BA%E4%BB%80%E4%B9%88%E8%BD%AC%E5%B8%96%E6%97%B6%EF%BC%8C%E6%8F%90%E7%A4%BA%E9%93%BE%E6%8E%A5%E4%B8%8D%E5%8F%AF%E7%94%A8%EF%BC%9F" target="_blank">查看帮助</a>');
                return;
            }
            switch(data.resourceType){
                //url
                case "0":
                    this.url(data);
                    break;

                //视频
                case "1":
                    this.video(data);
                    break;
                //音频
                case "2":
                    this.audio(data);
                    break;
                //相册
                case "4":
                    this.album(data);
                    break;
                //日志
                case "6":
                    this.blog(data);
                    break;
                //资讯
                case "7":
                    this.url(data);
                    break;
                //淘宝商品
                case "9":
                    this.goods(data);
                    break;

                // 淘宝网店
                case "10":
                    this.shop(data);
                    break;
                //商品
                case "12":
                    this.goods(data);
                    break;
                //贴子
                case "13":
                    this.url(data);
                    break;

            }
        },
        createPopup:function(html,data){
            var self=this;
            this.panel=new SNS.sys.snsCenterPanel(html,this.config);
            var titleNode=Dom.getElementsByClassName("f-txt","input",this.panel.content)[0];

            titleNode.value=data.title;
            this.panel.addEvent("btn n-btn","span","click",function(){
                self.saveShare(data,this);
            })
            return this.panel;
        },
        url:function(data){
            var html=this.getHtml(this.getShareUrlHtml(data));
            this.createPopup(html,data);
        },
        blog:function(data){
            var html=this.getHtml(this.getShareBlogHtml(data));
            this.createPopup(html,data);
        },

        audio:function(data){

            var html=this.getHtml(this.getShareAudioHtml(data));
            this.config.onHide=function(){
                var subject=Dom.getElementsByClassName("subject","div",this.content)[0];
                subject.innerHTML="";
            }
            this.createPopup(html,data);

        },

        video:function(data){
            var html=this.getHtml(this.getShareVideoHtml(data));
            this.createPopup(html,data);
        },
        album:function(data){

            var html=this.getHtml(this.getShareAlbumHtml(data));
            this.createPopup(html,data);

        },
        goods:function(data){

            var html=this.getHtml(this.getShareGoodsHtml(data));
            this.createPopup(html,data);

        },
        shop:function(data){
            var html=this.getHtml(this.getShareShopHtml(data));
            this.createPopup(html,data);

        },

        saveShare:function(parms,panel){
            var self=this;
            var title=panel.container.getElementsByTagName("input")[0].value;



            if(!title){
                SNS.sys.Helper.showMessage("写个标题吧，朋友们不知道是什么东东")
                return;
            }
            if(title.length>120){
                SNS.sys.Helper.showMessage("标题长度不能大于120个字符")
                return;
            }

            if(title.replace(/\s/g,"")==""){
                SNS.sys.Helper.showMessage("标题不能为空")
                return;
            }


            var comment=panel.container.getElementsByTagName("textarea")[0].value;

            if(comment.length>210){
                SNS.sys.Helper.showMessage("转帖理由长度不能大于210个字符")
                return;
            }
            if(this._lock)return;
            this._lock=true;

            var callBack=function(data){
                this._lock=false;

                if(!self.config.success&&!self.config.failure)panel.hide();
                switch(data){
                    case 1:
                        SNS.sys.Helper.showMessage("转帖失败，请重试");
                        if(self.config.failure)self.config.failure();
                        break;
                    case 2:
                        SNS.sys.Helper.showMessage("转帖成功");

                        if(self.config.success)self.config.success.apply(this,arguments);
                        break;
                    case 3:
                        SNS.sys.Helper.showMessage("您还没有登录，请先登录");
                        if(self.config.failure)self.config.failure();
                        break;
                    case 4:
                        SNS.sys.Helper.showMessage("链接不可用，请重新输入!");
                        if(self.config.failure)self.config.failure();
                        break;
                    case 5:
                        SNS.sys.Helper.showMessage("转帖失败，请重试");
                        if(self.config.failure)self.config.failure();
                        break;
                    default:
                        SNS.sys.Helper.showMessage("转帖失败，请重试");
                        if(self.config.failure)self.config.failure();
                        break;
                }
            }

            //验证
            Class.mixin(parms,{
                title:title,
                comment:comment
            })
            switch(parms.isMain){
                case true:
                    this.dataSource.saveMainShare(parms,callBack);
                    break;
                case false:
                    this.dataSource.saveSubShare(parms,callBack);
                    break;
            }
        }

    })

    var shareLock=false;

    SNS.widget.Share={

        shareMain:function(parms,config){
            var onHide=function(){
                shareLock=false;
            }

            var newConfig;
            if(config){
                config.onHide=onHide;
                newConfig=config;
            }
            else{
                newConfig={
                    onHide:onHide
                };
            }

            if(!shareLock)var popup= new SharePopup(parms,newConfig).showMain();
            shareLock=true;
            if(!popup)shareLock=false;
            return popup;
        },
        shareSub:function(parms,config){

            var onHide=function(){
                shareLock=false;

            }
            var newConfig;
            if(config){
                config.onHide=onHide;
                newConfig=config;
            }
            else{
                newConfig={
                    onHide:onHide
                };
            }
            if(!shareLock)var popup= new SharePopup(parms,newConfig).showSub();
            shareLock=true;
             if(!popup)shareLock=false;
            return popup;
        },
        omitShare:function(parms,callback){
            var dataSource=new ShareDataSource();
            dataSource.omitShare(parms,callback);
        }

    }

})();





    var K = KISSY, D = K.DOM, E = K.Event,JSON = K.JSON, Helper = SNS.sys.Helper;

    var Feed=function(cfg){
     
        Feed.superclass.constructor.call(this, cfg);
    }

    Feed.ATTRS = {
        rootNode: {
            value:"#J_FeedsContainer"
        },
        paramGetFeed:{
            value:{
                page:1
            }
        }
    }

    Feed.EVENTS = {
        "click":{
            ".icon-del-simple": "delFeedEvent",
            ".J_DeleteMB": "delJiwaiFeedEvent",
            ".icon-filter-simple": "filterFeedEvent",
            ".J_viewMoreFresh": "loadMoreFeedEvent",
            ".small-img": "zoomOutEvent",
            ".J_ZoomInImg": "zoomInEvent",
            ".big-img": "zoomInEvent",
            ".J_FeedTab,.J_MoreTab": "feedTabEvent",
            ".J_Share": "shareEvent",
            ".J_Reply": "cmtEvent",
            ".J_Forward": "forwardEvent",
            ".sns-linkcheck":"checkLinkEvent",
            ".more-share":"showMoreShareEvent",
            ".J_ShowMoreFeed":"showMoreFeedEvent",
            ".subscribe-cancle":"subscribeCancle"
        },
        "mouseenter":{

            ".short-url":function(e,target){
                 K.log(SNS.widget.ShortLink.show)
                SNS.widget.ShortLink.show(e,target);
            }
        },
        "mouseleave":{
            ".short-url":function(e,target){
                
                SNS.widget.ShortLink.hide(e,target);
            }
        }

    }

    Feed.DOMS = {
        item:{
            parent:".item"
        }
    }

    Feed.AOPS = {
        before :{
            "*Event":"preventDefault",
            "delJiwaiFeedEvent":"checkLogin"
        }
    }

    SNS.Base.extend(Feed, SNS.data.Feed,{
        init:function(){

            this.fixedHover(this.get("rootNode"));
            return this;
        },
        scrollLoadFeed:function(cfg){
   
            var self = this, d = "getFeed", data = this.getData(d);
            cfg = cfg || {};
            var  param = K.merge(this.get("paramGetFeed"), cfg.param||{});
           
            var  scrollLoad= new SNS.util.ScrollLoad({
                url:cfg.url||data.url,
                param:param,
                el: cfg.el||D.get(self.get("rootNode")),
                success:function(txt, param, el){
                     
                    if(cfg.success) cfg.success(txt, param, el);

                    self.fixedHover(el);
                }
            }).init();
            return scrollLoad;
        },

        loadFeed:function(cfg){
            K.log("load feed")
            var self = this, d = "getFeed", data = this.getData(d);
            var  newcfg =  {};
            var  el = cfg.el || D.get(self.get("rootNode"));
            var url = cfg.url|| data.url;
            var loading = document.createElement('div');
            loading.innerHTML = "<img src='http://img06.taobaocdn.com/tps/i6/T13l0vXhRrXXXXXXXX-24-24.gif' alt='loading ...' /><br /><br />";
            el.appendChild(loading);
            newcfg.data = K.merge(this.get("paramGetFeed"), cfg.param||{
                page:1
            })
            newcfg.success=function(data){
                loading.style.display="none"
                D.remove(loading);
                el.innerHTML=data.responseText;
                if(cfg.success)cfg.success(data.responseText);

            }


            SNS.request(url, newcfg);
        },
        // 个人主页仍然使用原来的加载方式

        loadMoreFeedEvent:function(e, t){
            var param=D.attr(t, "data-param");
            if(!param)return;
            var self=this;

            var  el = D.get(self.get("rootNode"));

            var loading = document.createElement('div');
            loading.innerHTML = "<img src='http://img06.taobaocdn.com/tps/i6/T13l0vXhRrXXXXXXXX-24-24.gif' alt='loading ...' /><br /><br />";
            el.appendChild(loading);
            param=K.JSON.parse(param);
            var cfg={
                data:param,
                success:function(data){

                    loading.style.display="none"
                    D.remove(loading);

                    el.innerHTML+=data.responseText;
                }
            }

            D.remove(t);
            SNS.request(t.href, cfg);

        },
        delFeedEvent:function(e, t){

            var item=this.getDOM("item",t);
            this.simpleLoadData("delFeed",function(){
                var showMore =    D.get(".show-more", item);
                    if(!showMore){
                        D.remove(item);
                    }
                    else{


                         var html ='<div style="border:0;margin-top:0;padding-top:0;" class="show-more">'+showMore.innerHTML+'</div>'
                        item.innerHTML = html;
                    }
               
            },item, t);
        },

        delJiwaiFeedEvent: function(e, t){
            var d="delJiwaiFeed", self= this, panel,item=this.getDOM("item",t), confirm, txt;

            confirm = function(){
                if(panel)panel.hide();
                self.simpleLoadData(d, function(){
                  
                  var showMore  =   D.get(".show-more", item);
                    if(!showMore){
                        D.remove(item);
                    }
                    else{
                       
                         var html ='<div style="border:0;margin-top:0;padding-top:0;" class="show-more">'+showMore.innerHTML+'</div>'
                        item.innerHTML = html;

                    }
                },item, t);
            },
            //开发加文案
            txt = D.attr("data-txt", t)||"您确定要删除这条叽歪吗?";
            panel= Helper.showConfirm(txt,confirm);
        },

        filterFeedEvent : function(e, t){
            e.preventDefault();
            var d="filterFeed", self= this, panel, item=this.getDOM("item",t),
            confirm = function(){

                if(panel)panel.hide();
                self.simpleLoadData(d, function(){
                   var showMore =    D.get(".show-more", item);
                    if(!showMore){
                        D.remove(item);
                    }
                    else{


                         var html ='<div style="border:0;margin-top:0;padding-top:0;" class="show-more">'+showMore.innerHTML+'</div>'
                        item.innerHTML = html;
                    }

                }, t);
            },
            //开发加文案 并判断类型
            txt = D.attr("data-txt", t)||"以后不再接收<span>这个好友的该类型</span>动态，你确认吗?(你可以在隐私设置里解除此屏蔽)?";
            panel= Helper.showConfirm(txt,confirm);
        },




        shareEvent : function(e, t){
            var li= D.parent(t),
            param =JSON.parse(D.attr("data-param",li)) ;
            SNS.widget.Share.shareSub(param);
        },

        zoomOutEvent : function(e, t){

            e.preventDefault();
            var self = this,
            item = D.parent(t ,".item"),
            smallImg = D.get('img.small-img',  item),
            bigImg = D.get('img.big-img',  item),
            childNode = D.get('a.toggle',  item);
             
            D.addClass(childNode, "J_ZoomInImg");
            childNode.innerHTML = "收起"
            var  toggleContainer = childNode.parentNode;
            var f = function(){
                setTimeout(function() {
                  
                    smallImg.style.display = 'none';
                    bigImg.style.display = 'block';

                    self.resize(bigImg, 430, 1500);

                    D.removeClass(toggleContainer, 'hidden');
                    //ie6触发reflow
                    var sib = YAHOO.util.Dom.getNextSibling(item)
                    sib && Helper.doReflow(sib);
                }, 50);
            }
            if( bigImg.src != smallImg.getAttribute('data-src')){
                bigImg.onload = function() {
                  
                    f();
                }


                bigImg.src = smallImg.getAttribute('data-src');
                

            } else {
                f();
            }
           
        },
        zoomInEvent : function(e, t){
            e.preventDefault();

            var self = this,
            item = D.parent(t ,".item"),
            smallImg = D.get('img.small-img',  item),
            bigImg = D.get('img.big-img',  item),
            childNode = D.get('a.toggle',  item);
            var  toggleContainer = childNode.parentNode;

            //   bigImg.src = smallImg.getAttribute('data-src');
            smallImg.style.display = 'block';
            bigImg.style.display = 'none';

            D.addClass(toggleContainer, 'hidden');

            var sib = YAHOO.util.Dom.getNextSibling(item)
            sib && Helper.doReflow(sib);


        },
        cmtEvent : function(e, t){
            e.preventDefault();
            var el = D.parent(t,".item"),  reply = D.get(".fd-reply",el), self = this,  cfg;
            if(t._status==1){
                reply.innerHTML="";
                D.addClass(reply,"hidden")
                t._status=0;
                return;
            }
            t._status=1;
            D.removeClass(reply,"hidden")
            if(t._c)t._c.init();
            else{
               
                cfg =JSON.parse(D.attr(t,"data-cfg"));
                cfg.rootNode=reply;
                cfg.initCmtCallback=function(){
                    t._c.focus();
                }
                //添加评论回调
                K.mix(cfg, self.get('commentCallback'));
                t._c= new SNS.widget.Comment(cfg);
                t._c.init();

            }
            return t._c;
        },


        forwardEvent: function(e, t){
            // 所有参数放在el上
            e.preventDefault();
            var self = this,  cfg;
            cfg =  JSON.parse(D.attr(t, "data-cfg"));

            return new SNS.widget.Forward(cfg).init();

        },

        resize:function(img, w, h){
            var p1=w/h;
            var p2=img.width/img.height;
            if(p2>=p1&&img.width>w){
                img.width=w;
                img.height=img.width/p2;
            }
            else if(p2<p1&&img.height>h){
                img.height=h;
                img.width=img.height*p2;
            }
        },

        checkLogin: function(e){
            var afterLogin=function(){}
            if (!Helper.checkAndShowLogin({
                callback:afterLogin
            })){
                e.halt();
            }
        },
        checkLinkEvent: function(e, t) {
            new SNS.sys.LinkCheck(t).check();
        },
        toggleClass:function(e, t){
            D.toggleClass(t, "hover")
        },
        preventDefault:function(e){

            KISSY.log("preventDefault")
            KISSY.log(e&&e.arguments&&e.arguments[0])
            KISSY.log(e.arguments[0].preventDefault)
            if(e&&e.arguments&&e.arguments[0])e.arguments[0].preventDefault();
        },
        fixedHover :function(root) {
            var list = D.query('.item', root);
            E.on(list, 'mouseenter', function(e) {
                D.addClass(e.currentTarget, 'hover');
            });

            E.on(list, 'mouseleave', function(e) {
                D.removeClass(e.currentTarget, 'hover');
            });

        },
        showMoreShareEvent:function(e, t){
           
            if(t._status==1)return;
            t._status=1;
            var param=D.attr(t,"data-param");
            if(param) param = K.JSON.parse(param);
            this.loadData("moreShare",function(data){
               
                var panel=SNS.sys.snsNearbyPanel(t,data.result.html,{
                    width:"400px",
                    offsetTop:"-50px",
                    offsetLeft:"80px",
                    hideHandle:true,
                    onShow:function(){
                        if(K.get("span",t))K.get("span",t).className="fd-open";
                    },
                    
                    onHide:function(){
                  
                        if(K.get("span",t)) K.get("span",t).className="fd-close";
                    }
                }).show();
     
            }, param);
        },
        showMoreFeedEvent:function(e, t){

          
            var param=D.attr(t,"data-param");
            var url = D.attr(t,"data-url");
            var more = D.parent(t, ".show-more");
            var feed = D.parent(t, ".item");
            if(param) param = K.JSON.parse(param);
      
            SNS.request(url,{
                data:param,
                dataType:"html",
                success:function(data){
                    D.remove(more);
                    var morefeed =  D.create("<div>");
                    morefeed.innerHTML= data;
                    D.insertAfter(morefeed, feed);
                }
            })

        },
        subscribeCancle:function(e, t){


            var url=D.attr(t,"data-url");
            SNS.request(Helper.getApiURI(url),{
                dataType:"json",
                success:function(data){
                    if(data.state == "1") Helper.showMessage(data.message);
                    else Helper.showMessage(data.message)
                }
            }
            )

        }
    });
    
    SNS.widget.Feed=Feed;





},"SNS.util.Ajax,SNS.data.Feed,SNS.widget.ShortLink,SNS.util.ScrollLoad,SNS.widget.Comment,SNS.widget.Forward")

