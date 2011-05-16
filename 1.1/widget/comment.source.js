SNS("SNS.widget.Comment", function(){

    var K = KISSY, D = K.DOM, E = K.Event, Helper = SNS.sys.Helper;

    var Comment = function(cfg) {
        Comment.superclass.constructor.call(this,cfg);
    }

    //属性配置
    Comment.ATTRS = {

        //各种参数
        param : {
            value : null
        },
        paramList:{
            value:null
        },
        paramReply:{
            value:{}
        },
        paramFwd:{
            value:{}
        },
        //
        rootNode : {
            value:"#J_CmtWidget"
        },
        txt:{
            value:"我也插句话..."
        },
        content:{
            value:"12345"
        },
        maxLength:{
            value:140
        },
        isAutoHeight:{
            value:true
        },

        isSynMB:{
            value:false
        },
        isSuggest:{
            value: false
        },
        isOpen :{
            value:false
        },

        isReply :{
            value:false
        },
        moreurl:{
            varlue:""
        },

        checkcode:{
            value:""
        },
        postCmtReturn:{
            value:function(){}
        },
        addCallback:{
            value:function(){}
        },
        delCallback:{
            value:function(){}
        },
        initCmtCallback:{
            value:function(){}
        }

    }


    // dom 配置
    Comment.DOMS = {
        content:{
            selector:".f-txt",
            attr:"value",
            to:"content"
        },
        checkcode:{
            selector:".f-checkcode",
            attr:"value",
            to:"checkcode"
        },
        checkcodeContainer:{
            selector:".checkcode"
        },
        sycMB:{
            selector:".J_SycMB",
            attr:"checked",
            to:"isSynMB"
        },


        face:{
            selector:".face"
        },
        txt:{
            selector:".f-txt"
        },

        list:{
            selector:"ul.comment-list"
        },
        cmt:{
            parent:"li"
        },
        form:{
            selector:".new-r"
        },
        count:{
            selector: ".J_LetterCount"
        }

    }

    //事件配置
    Comment.EVENTS = {
        click:{
            ".J_PostComment" : "postCmtEvent",
            ".J_UnfoldMoreComment":"unfoldMoreComment",
            ".J_FoldMoreComment":"foldMoreComment",
            ".J_DelR" : "delCmtEvent",
            ".J_ReR" : "replyCmtEvent",
            ".J_CreateReply":"createReplyEvent",
            ".page,.page-up,.page-down" : "getCmtListEvent",
            ".page-up" : "getCmtListEvent",
            ".page-down" : "getCmtListEvent"

        },
        focus:{
            ".f-txt" : "requireCheckCode"
        },
        keyup:{
            ".f-txt":"showLength"
        }
    }

    //aop 配置
    Comment.AOPS = {
        before: {
            "postCmtEvent" : ["checkLogin","DOMToAttrs","valid"],
            "*Event":"preventDefault",
            "delCmt" : "checkLogin"
        }
    }

    //原形方法
    SNS.Base.extend(Comment,SNS.data.Comment,{
				
        destroy : function(){
            var root=this.get("rootNode");
            D.get(root).innerHTML = "";//现在root下的全部html代码去掉
            E.remove(root);//去掉root下所有的绑定事件
        },
        stopEvent:function(){
            var root=this.get("rootNode");
            E.on(root,"click",function(e){
                e.halt();
            })
        },
        init: function() {
            var that = this;
            //防止 ie6 下产生网页错误
            K.ready(function() {
                that.renderCmtBox();
            });
            return that;
        },
        renderCmtBox : function(){
            var d = "getCmtBox" ,success, root=this.get("rootNode"), txt, self=this;
            success = function(data){
                if(!data)return
                D.get(root).innerHTML = data.result.html;
                txt = self.getDOM("txt");
                if(txt){
                    Helper.addMaxLenSupport(D.get(root), self.get("maxLength"), 'f-txt');
                    //显示还可以输入多少字
                    self.showLength(null,txt);
                    //初始化表情？
                    self.initFace();
                    //初始化验证码
                    self.initCheckCode();
                    //设置更多评论链接
                    self.setMoreUrl();
                    //初始化点名
                    self.initSuggest();
                    SNS.sys.form.setPlaceHolder(txt);

               
                //  txt.value=self.get("txt");
                   
                }
                var cb=self.get("initCmtCallback");
                cb(data);
            }
            this.simpleLoadData(d, success, this.get("param"), this.get("paramList"));
        },

        requireCheckCode:function(){
            if(this.checkCode){
               
                if(!this.checkCode.isShow())  this.checkCode.require();
            }
        },

        postCmtEvent:function(e, t){
            var d = "postCmt",  self = this, success, list ,content = self.get("content"), checkcode = this.get("checkcode"),param={};
             content = self.getDOM("txt").value;
            success=function(data){
                var s = data.status, r = data.result, m = data.msg
                if(s=="0"){
                    list = self.getDOM("list");
                    self.forward();

                    self.checkCode.hide();


                    self.reset();

                    var result =  self.get("postCmtReturn")(param, data);
                    if(result == false)return;
                    list.innerHTML=data.result.html+list.innerHTML;
                   

                }
                else if(s =="12"||s == "13"){
                    Helper.showMessage(m);
                    self.checkCode.show(data.result.checkCodeUrl);

                } else if( s == '16' ){

					KISSY.use("",function(K){
						K.getScript('http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.css?t=' + new Date().getTime(), function(){}, 'GBK');
						K.getScript('http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.js?t=' + new Date().getTime(), function(){
							K.use("auth",function(K){
								K.sns.auth();
							});
						}, 'GBK');
					});

					return;

                } else {
                    Helper.showMessage(m);
                }
                if(self.get("addCallback")){
                    self.get("addCallback")(param, data);
                }
                if(window.commentAfterCallback){
                    commentAfterCallback(param, data);
                }

            }
            param = K.merge(param,this.get("param"),this.get("paramReply"),D.attr(t,"data-param"));
            param.content = content;
            param.TPL_checkcode=checkcode;
            if(this.get("isSynMB")){
                param.isForward=this.get("isSynMB");
            }
            this.loadData(d, success, param);

        // this.simpleLoadData("forward",function(){}, this.get("param"), this.get("paramForward"),{content:content})
        },


        delCmtEvent:function(e){
            e.preventDefault();
            var d = "delCmt", t = e.target, base, del,  self = this, success,param={};
            ;
            success=function(data){
                D.remove(self.getDOM("cmt", t));
                if(self.get("delCallback"))self.get("delCallback")(param, data);
                if(window.delCommentAfterCallback)delCommentAfterCallback(param, data);
            }
            param=K.merge(param,this.get("param"));
            this.simpleLoadData(d, success,this.get("param"), t);
        },


        getCmtListEvent: function(e, t){
            e.preventDefault();
            var d = "getCmtList",  base, list,  self = this, success;
            list = D.attr(t, "data-param");
            if(!list)return;
            success=function(data){

                self.getDOM("list").innerHTML=data.result.html;
                var  txt = self.getDOM("txt");
                if(txt) txt.focus();
            }
            this.simpleLoadData(d, success,this.get("param"),this.get("paramList"), t);
        },
        getCmtList:function(){
           
        },


        showMoreComment: function(){

        },

        replyCmtEvent:function(e, t){
            this.set("paramReply",K.JSON.parse(D.attr(t, "data-param")));
            this.getDOM("txt").value=D.attr(t, "data-txt");
            this.getDOM("txt").focus();
        },
        setDefaultValue:function(value){
            this.getDOM("txt").value = value;
        },
        createReplyEvent:function(e, t){
            e.preventDefault();
            var el = D.parent(t,"li"),  reply = D.get(".fd-reply",el), self = this,  cfg;
        
            reply.style.display="block"



            cfg = JSON.parse(D.attr(t,"data-cfg"));
            cfg.rootNode=reply;
            //添加评论回调
            K.mix(cfg, self.get('commentCallback'));
            cfg.postCmtReturn=function(param, data){
                var list = self.getDOM("list");
                var tempUl = D.create("<ul>");
                tempUl.innerHTML=data.result.html;
                var templi = D.get("li", tempUl);
                var first =D.get("li", list);
                Helper.showMessage("评论成功")
                D.insertBefore(templi,first);
                reply.style.display="none";
                if( t._c)t._c.destroy();

                return false;
            };
            cfg.initCmtCallback=function(){
                t._c.setDefaultValue( D.attr(t, "data-txt"));
            }

              
            t._c= new SNS.widget.Comment(cfg);
            t._c.stopEvent();
            t._c.init();
               
            return t._c;
        },
        focus:function(){
        var  txt = this.getDOM("txt");
         if(txt)txt.focus();
        },
        forward:function(){
            //同步发微博
            var self = this, param;
            if(!this.get("isSynMB"))return;
            K.log(this.get("paramFwd"));
            param = K.mix(this.get("paramFwd"),{
                content:self.get("content")
            })
            var cfg={
                paramFwd:param
            };
            new SNS.widget.Forward(cfg).forward();
        },

        reset:function(){

            this.setDOM("content","");
            this.getDOM("txt").value=""
            this.getDOM("count").innerHTML=this.get("maxLength");
            var root=this.get("rootNode")
            var sycMB=D.get(".J_SycMB" ,root);
            if(sycMB){
                sycMB.checked=false;
            }
            this.set("paramReply",{});

        },

        initFace: function(){
            var self=this, rootNode = D.get(this.get("rootNode"));
            var face= this.getDOM("face");
            var txt=this.getDOM("txt");
            var max= this.get("maxLength")
            SNS.widget.faceSelector.init({
                elTrigger:face,
                container:rootNode,
                insertBefore:function(){
                    if (txt.value.length >= max)return false;

                },
                insertAfter:function(){
                    if (max - txt.value.length< 0)var n = 0;
                    self.showLength(null,txt,n);
                }
            });

        },
        initCheckCode: function(){
            var self=this, root=D.get(self.get("rootNode")), checkCode = self.getDOM("checkcodeContainer");

            this.checkCode=new SNS.widget.CheckCode({
                rootNode:checkCode
            });

        // this.checkCode.require();
        },
        initSuggest: function(){
            var self=this;
            // 初始化点名功能
            new SNS.widget.MicroSuggest({
                root: D.get(self.get("rootNode")),
                className:"f-txt",
                autoHeight:false
            });
        },
        showLength:function(e, t, n){
            var count = this.getDOM('count');
            n=n?n:this.get("maxLength")- t.value.length
            if (count)count.innerHTML =n;
        },


        valid: function(e){
            var c=this.get("content"), txt=D.attr(this.getDOM("txt"),"placeholder"), msg=SNS.sys.Helper.showMessage;


            if (c === "" || c === txt) {
                msg("内容不能为空或者全是空格.");
                e.halt();
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

        preventDefault:function(e){

            if(e&&e.arguments&&e.arguments[0])e.arguments[0].preventDefault();

        },
        setMoreUrl:function(){
            var list = this.getDOM("list"), moreurl=D.get(".more-comment", list);
            if(moreurl)moreurl.href=this.get("moreurl");
        }
    });
    SNS.widget.Comment=Comment;

},"SNS.data.Comment,SNS.data.Forward,SNS.widget.CheckCode,SNS.widget.Face,SNS.widget.FeedSuggest")




