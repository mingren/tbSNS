/*
 * 叽歪发表组件
 * @author bofei
 * @date 2010.8.8
 */

SNS("SNS.widget.MFeedEditor",function(){


    var Y=YAHOO,Dom=Y.util.Dom,Event=Y.util.Event,Helper=SNS.sys.Helper, text="有啥想说的...";
    if(Dom.get("J_SNSFeedEditorTxt"))text = Dom.get("J_SNSFeedEditorTxt").innerHTML;


    var limitLength = 140;
    var allowedExtends = 'JPG|GIF|PNG|JPEG|BMP';
    var url=Helper.getApiURI("http://t.{serverHost}/weibo/addWeiboResult.htm",true,true);
    var proxy=Helper.getApiURI("http://t.{serverHost}/proxy.htm",true,true);
    var topicList = '<div class="topiclist">'+
    '<div class="wrap-border">'+
    '<span class="arrow"></span>'+
    '<ul>'+
    '<li><a href="#" class="topic">#新品上架#</a></li>'+
    '<li><a href="#" class="topic">#折扣促销#</a></li>'+
    '<li><a href="#" class="topic">#秒杀#</a></li>'+
    '<li><a href="#" class="topic">#店铺抽奖#</a></li>'+
    '<li><a href="#" class="topic">#越转越开心#</a></li>'+
    '<li><a href="#" class="topic">#春季促销活动#</a></li>'+
    '<li class="newone"><a href="#" class="topic">#插入新话题#</a></li>'+
    '</ul>'+
    '</div>'+
    '</div>'
    var goodsList = '<div class="goodslink">'+

    '<div class="wrap-border">'+
    '<span class="arrow"></span>'+
    '<input class="link" placeholder="要分享的宝贝链接" type="text" />'+
    '<p class="act"><span class="onlyt">仅支持淘宝网的宝贝链接</span><a href="#" class="confirm">确定</a></p>'+
    '</div>'
    '</div>'

    var html= '<!--<div >你还可以输入<em class="num">140</em>个字</div>-->'+
    '<div class="wrap">'+
    '<div class="sub-tips"><i></i><p>Ctrl+Enter可以快速发表</p></div>'+

    '<div class="arr"></div>'+
    '<div   class="error-msg"><span class="arrow"></span><p class="error">同步更新只显示32个文字内容</p></div>'+
    '<form class="form" action="'+url+'"  enctype="multipart/form-data" method="post" target="hidden_frame">'+
    ' <div class="sns-nf"><div class="b"><textarea maxlength="140" name="content" class="f-area" resize="none">'+text+'</textarea></div></div>'+
    '<div class="act ">'+

    ' <span class="sns-icon icon-insert-face">表情</span>'+
    ' <span  class="sns-icon icon-insert-img">图片</span>'+
    ' <span  class="sns-icon icon-topic">话题</span>'+
    ' <span  class="sns-icon icon-goods">店铺宝贝</span>'+
    ' <span class="upload"><input name="fileData" class="input-upload"  type="file"/></span>'+
    ' <span class="file" style="display:none">[<em class="file-name"></em> <a class="imgdel" href="#">删除</a>]</span>'+
    ' <span class="rsync" style="display:none"><input id="rsyncBox" name="rsyncBox" class="rsync-box" type="checkbox"><label for="rsyncBox">设置为阿里旺旺签名</label></span>'+
    ' <span class="shownum"><em class="num">140</em></span>'+
    ' <span class="skin-red">'+
    '<input type="hidden" class="syncTag" name="syncTag" />'+
    '<input type="hidden" name="event_submit_do_publish_weibo" value="anything"/>'+
    '<input type="hidden" name="action" value="weibo/weiboAction"/>'+
    '<input type="hidden" class="from-type" name="type" value="2"/>'+
    '<input type="hidden"  name="isMS" value="true"/>'+
    '<div class="hiddentoken" style="display:none"></div>'+
    ' <a class="submit" href="#" >发 表</a>'+
    '<div class="hidden" ></div>'+
    ' </span>'+
    ' </div>'+
    ' </form>'+
    '<iframe name="hidden_frame" class="hidden-frame"  style="display: none;" src="'+proxy+'"></iframe>'+
    topicList+goodsList+

    ' </div>';

    // 处理跨域 重置domain
    var _domain = function() {
        var _hostname = window.location.hostname.toString();
        var _hosts = _hostname.split(".");
        var _len = _hosts.length;
        if(_len>2) {
            return _hosts[_len-2]+"."+_hosts[_len-1];
        }
        return _hostname;
    };

    document.domain = _domain();


    var  submitType =0; //1 叽歪 2，宝贝

    /*
     * @class
     */
    var MicroBlog=function(config){

        this.config={
            container:"J_FeedEditor"
        }
        this._config(config);
        this._init();
    }
    MicroBlog.prototype={
        _config:function(config){
            this.config=YAHOO.lang.merge(this.config,config||{});
        },
        _init:function(){


            this.container=Dom.get(this.config.container);
            if(!this.container)return;
            this._inject(this.container);
            this.content=Dom.get(this.config.container);
            this._createCallback();
            this._attach();

            /* 去掉点名
            new SNS.widget.MicroSuggest({
                autoHeight:false,
                root:this.container,
                className:"f-area"
            })
          */

            this.initTopic();
            this.addGoods();
        },

        // 渲染html
        _inject:function(id){
            var container=Dom.get(id);
            if(container)container.innerHTML=html;
            var type=Dom.getElementsByClassName("from-type","input",container)[0];

            type.value=this.config.type?this.config.type:2;
        },

        //重置token
        _setToken:function(){
            var token=Dom.get("Jianghu_tb_token");
            if(token){
                this._get("hiddentoken","div").innerHTML= token.innerHTML;
            }
        },

        _attach:function(){
            var self=this,uploadInput=Dom.getElementsByClassName("input-upload","input",this.container)[0],textarea=this._get("f-area", "textarea");
            textarea._value=textarea.value;
            if (this.config.defaultText) {
                textarea.value = this.config.defaultText;
            }
            var submit=this._get("submit","a");
            var subTips=this._get("sub-tips","div");
            var btn=this._get("skin-red","span");


            //侦听点击事件


              Event.on(this.content,"click",function(e){
                var self=this;
                var target=Event.getTarget(e);
                switch(target.className){
                    case  "imgdel":
                        Event.preventDefault(e);
                      /*  if(!confirm('确认删除图片吗?')){
                            return;
                        }
                        */

                       var panel = Helper.showConfirm("确认删除图片吗?",function(){
                           self._resetImage();
                       });

                        break;


                }
            },this,true);

            Event.on(btn,"click",function(e){
                Event.stopEvent(e);
                this.submitData();
            },this,true)






            Helper.addMaxLenSupport(this.content,140,"f-area",function(){
                self.showNum();
            })
            var timer=null
            /*
            Event.on(submit,"mouseover",function(e){
                if(!Dom.isAncestor(this,Event.getRelatedTarget(e))){
                    subTips.style.display="block";
                }

            },submit,true)
            Event.on(submit,"mouseout",function(e) {

                if(!Dom.isAncestor(this,Event.getRelatedTarget(e))){
                    subTips.style.display="none";
                }
            },this,true)
         */
            Event.on(textarea, "focus", function(e) {

                if(this.value == this._value) {
                    this.value="";

                }
                self.open(this)
            },textarea,true);
            Event.on(textarea, "blur", function(e) {
                if(this.value=="") {
                    this.value=this._value;
                }


            },textarea,true);

            Event.on(textarea, "keydown", function(e) {
                if(e.keyCode==9) return false;
            });

            Event.on(textarea, "keyup", function(e) {
                var event= Event.getEvent(e);

                var keycode=Event.getCharCode(e);
                if(keycode==13&&event.ctrlKey){
                    self.submitData();
                    return;
                }
                var desc=this.value;

                var rsync=Dom.getElementsByClassName("rsync-box","input")[0];
                if(desc.length > limitLength){
                    this.value=desc.substring(0,limitLength);
                }

                var desc =  KISSY.trim(this.value);

                // self._checkRsync();

                if(desc.length >= limitLength ) {
                    //  self._showTips("140字满");
                    return;
                }else if(desc.length < limitLength  ){
                //  self._hideTips();
                }

                if(desc.length >= 32 ) {
                    //  self._showTips("同步更新只显示32个文字内容");
                    return;
                }else if(desc.length < 32  ){
            //  self._hideTips();
            }


            },textarea,true);

            Event.on(uploadInput,"change",this._showUploadFileName,this,true);

            this._fillFace();

            /*关闭打开*/
            var except=[".feededitor"], t, f, i ;
            Event.on(document.body,"click",function(e){
                var isClose=true
                t=Event.getTarget(e);
                for(i=0; i<except.length; i++){
                    f=except[i];

                    if(KISSY.DOM.test(t, f)||KISSY.DOM.parent(t, f))isClose = false;
                }
                if(isClose) self.close(textarea);
            },this);

        },
        clearTxt:function(){
            var  textarea=this._get("f-area", "textarea");
            if(textarea.value == text) textarea.value="";
        },
        _showUploadFileName:function(){

            var   textarea=this._get("f-area", "textarea");
            var self=this, uploadInput=Dom.getElementsByClassName("input-upload","input",this.container)[0], file=this._get("file","span"),fileTag=this._get("file-name","em");
            if(fileTag){

                var path =  uploadInput.value;
                if(path == "") return true;
                var extendIndex = path.lastIndexOf('.');
                if(extendIndex < 0 || allowedExtends.indexOf( path.substring(extendIndex + 1).toUpperCase() ) < 0){

                    file.style.display="none";

                    self._resetImage();

                    SNS.sys.Helper.showMessage("<div >上传格式不正确,图片说它只支持jpg、bmp、png、gif、jpeg格式.</div>");



                    //提示成功
                 /*   var popupMsg = new SNS.sys.Popup({
                        title : "小提示",
                        type : "error",
                        content : '上传格式不正确,图片说它只支持jpg、bmp、png、gif、jpeg格式.',
                        autoShow : false,
                        hideMask : true,
                        buttons : [{
                            text: "确定",
                            func : function() {
                                this.hide();
                            }
                        }]
                    });



                    popupMsg.show();
*/
                    return false;
                }
                else{

                    //获得文件名字,先获得最后一个斜杠，通过斜杠取后面的值，ie下文件是带完整路径的。
                    var indexNew = uploadInput.value.lastIndexOf("\\") + 1;
                    var title = uploadInput.value;
                    if(indexNew > 0 ) {
                        title = uploadInput.value.substring(indexNew);
                    }

                    //对文件的名字进行截取，避免文字长度超过限制。
                    indexNew = title.lastIndexOf(".") + 1;
                    if(indexNew > 0 && title.length > 8) {
                        fileTag.innerHTML = '...' + title.substring(title.length - 8);
                    }
                    //如果没有超过限制，显示完整文件名称。
                    else{
                        fileTag.innerHTML = title;
                    }

                    fileTag.style.display="";
                    file.style.display="";
                    //  var rsync=Dom.getElementsByClassName("rsync-box","input")[0];

                    //  rsync.checked = false;

                    self._hasUpload=true;
                    submitType = 1;

                }
                self.clearTxt();
            //self._checkRsync();
            }
        },
        _resetText:function(){
            this._get("f-area", "textarea").value=text;
        },
        _resetImage:function(){
            var  result=Dom.getElementsByClassName("upload","span",this.container)[0];
            result.innerHTML='<input name="fileData" class="input-upload"  type="file"/>';
            var input=Dom.getElementsByClassName("input-upload","input",result)[0];

            this._get("file","span").style.display="none";
            Event.on(input,"change",this._showUploadFileName,this,true);
            this._hasUpload=false;
        // this._checkRsync();
        },
        _clearShopGood:function(){

            this._get("input-upload",'input').disabled=false;
            this._get("input-upload",'input').style.display=""
           if(this._get("link","input")) this._get("link","input").value=""
            this._get("file","span").style.display="none";
            var params=["title","type","linkurl","itempic","sign"]
            for(var i=0;i<params.length;i++){
                this.delParam(params[i]);
            }
        },
        _resetRsync:function(){
            this._get("rsync-box","input").checked=false;


        },
        _checkRsync:function(){
            var result=true;
            var text=this._get("f-area", "textarea");
            var check=this._get("rsync-box","input");

            if(this._hasUpload||this._checkFace()||text.value.length>32){
                result= false;
            }
            //alert(text.value.length);
            //alert(result)
            if(result==true&&check.disabled){
                check.disabled=false;
            }
            else if(result==false){
                check.disabled=true;

            }

        },
        _clearData:function(){
            this._resetText();
            this._resetImage();
            // this._resetRsync();
            this._hideTips();

            this._get("input-upload",'input').setAttribute("disabled",false);

                                this._get("input-upload",'input').style.display=""
            submitType =0;
             this._clearShopGood();

        },
        //获取并缓存节点
        _get:function(className,tag,root){
            if(!root)root=this.content
            var key="_"+className+"_"+tag;
            var result=this[key];
            if(!result){
                result=Dom.getElementsByClassName(className,tag,root)[0];
                this[key]=result;
            }
            return result;
        },
        _fillFace:function(){
            var self=this,textarea=this._get("f-area", "textarea"),faceHandle=this._get("icon-insert-face", "span");
            Helper.fixCursorPosition(textarea);
            /* Event.on(faceHandle, "click", function(e) {
            var el = Event.getTarget(e);
            SNS.app.Components.get("FaceSelector").showDialog({
                elTrigger : faceHandle,
                callback : function(data) {
                    if(textarea.value.length>=140)return;
                    Helper.recoverCursorPos(textarea);
                    self.clearTxt();
                    Helper.insertText(textarea, data.faceId);
                     Dom.setAttribute(textarea,"data-lastcursor","");


                    window.setTimeout(function(){
                        self.showNum();
                        self._checkRsync();
                    }, 100)
                }
            });
        },this,true);
             */
            this.facePanel=SNS.widget.faceSelector.init({
                elTrigger:faceHandle,
                container:self.config.container,
                insertBefore:function(){
                    if(textarea.value.length>=140)return false;
                    self.clearTxt();

                },
                insertAfter:function(data){

                    Dom.setAttribute(textarea,"data-lastcursor","");


                    window.setTimeout(function(){
                        self.showNum();
                    //self._checkRsync();
                    }, 100)
                }
            });


        },
        showNum:function(){
            var  num=this._get("num", "em");
            var   textarea=this._get("f-area", "textarea");
            var desc =  textarea.value;
            var n=140-desc.length;
            if(n<0)n=0;
            num.innerHTML=n;
        },
        _checkFace:function(){
            var result=false;
            var faces = SNS.widget.faceSelector.getAllFaces(),
            re = null;
            if (faces.length > 0) {
                var reStr = [];
                for (var i = 0; i < faces.length; ++i) {
                    reStr[reStr.length] = "\\" + faces[i].code.split("").join("\\");
                }
                re = new RegExp(reStr.join("|"), "g");
                var cannotSyncSign = re.test(this._get("f-area", "textarea").value);
                result= cannotSyncSign;
            }
            return result;
        },
        _showTips:function(msg){
            var c=this._get("error-msg","div");
            this._get("error","p").innerHTML=msg;
            c.style.display="block";
        },
        _hideTips:function(){
            var c=this._get("error-msg","div");
            this._get("error","p").innerHTML="";
            c.style.display="none";
        },
        _createCallback:function(){
            var self=this;
            SNS.app._Microblog_callback = function(data) {//捕捉后台操作的返回信息

                //D.get("loading").style.display="none";
                if(data.status==1){
                    self._clearData();

                    if(self.config.onSuccess) self.config.onSuccess(data);
                }
                else if(data.status==2){
                    Helper.showMessage(data.msg);
                }
				else if( data.status=="4" ){

					KISSY.use("",function(K){
						K.getScript('http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.css?t=' + new Date().getTime(), function(){}, 'GBK');
						K.getScript('http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.js?t=' + new Date().getTime(), function(){
							K.use("auth",function(K){
								K.sns.auth();
							});
						}, 'GBK');
					});

					return;

				}
                else {
                    if (!Helper.checkAndShowLogin()) {
                        return;
                    }
                }


            }

        },


        submitData:function(){
            this._get("f-area", "textarea").blur();
            var self=this;

            // 检查登录状态，没登录直接显示登录框
            if (!Helper.checkAndShowLogin({
                autoCallback:true
            })) {
                // 修正 IE6 下文本框有可能无法获取焦点的 bug

                return;
            }
            this.clearTxt();
            var desc = KISSY.trim(this._get("f-area", "textarea").value);

            var form= this._get("form", "form");

            var file =Dom.getElementsByClassName("input-upload","input",this.container)[0].value;

            if((desc =="" || desc==text) && file=="" ){
                SNS.sys.Helper.showMessage("请输入点内容呗.");
                this.value=text;
                return false;
            }
            else if(KISSY.trim(desc).length > limitLength){
                SNS.sys.Helper.showMessage("太长啦~叽歪的内容不能超过140个字.");
                return false;
            }
            if(this._get("rsync-box","input").checked){
                this._get("syncTag","input").value="true";
            }
            else{
                this._get("syncTag","input").value="false";
            }
            this._setToken();



            this._get("form", "form").submit();
            window.setTimeout(function(){
                self._get("num", "em").innerHTML="140";
            },500);

        },
        open:function(textarea){
            textarea.style.height="57px";

        },
        close:function(textarea){
            if( textarea.value==textarea._value){
                textarea.style.height="27px"

            }
        },
        initTopic:function(){
            var self=this;
            var topicBtn=this._get("sns-icon icon-topic","span");
            var topicList = self._get("topiclist","div");

            Event.on(topicBtn, "click", function(e){
                Event.stopEvent(e);
                topicList.style.display = "block";
            })

            Event.on(document,"click",function(e){
                var target = Event.getTarget(e);
                // KISSY.log("123"+this.config.blurHide);
                if(target!=topicList&&!KISSY.DOM.contains(topicList, target)) topicList.style.display = "none";
            },this,this);

            Event.on(topicList,"click",function(e){
                var target = Event.getTarget(e);
                Event.stopEvent(e);
                if(target.className=="topic"){
                    self.clearTxt();
                    self._get("f-area", "textarea").value+=target.innerHTML;
                }
                topicList.style.display = "none";
            })


        },
        addParam:function(name, value){
            var form= this._get("form", "form");
            var input =this._get('addparam-'+name,"input");
            if(!input){
                input = KISSY.DOM.create('<input type="hidden" class="addparam-'+name+'" name='+name+' />');
                input.value=value;
                form.appendChild(input);
            }
            else input.value=value;

        },
        delParam:function(name){
            var input = this._get('addparam-'+name,"input");
            if(input) input.value="";
        },

        addGoods:function(){
            var self=this;
            var goodslink = self._get("goodslink","div");
            var goodsBtn=this._get("sns-icon icon-goods","span");
            Event.on(goodsBtn, "click", function(e){

                if(submitType ==1)return;
                Event.stopEvent(e);
                goodslink.style.display = "block";
            })
            Event.on(document,"click",function(e){
                var target = Event.getTarget(e);
                // KISSY.log("123"+this.config.blurHide);
                if(target!=goodslink&&!KISSY.DOM.contains(goodslink, target)) goodslink.style.display = "none";
            },this,this);

            Event.on(goodslink,"click",function(e){

                var target = Event.getTarget(e);
                Event.stopEvent(e);

                if(target.className=="confirm"){

                    SNS.request(Helper.getApiURI("http://fx.{serverHost}/share/getElementByURL.htm"),{
                        dataType:"json",
                        data:{
                            url:self._get("link","input").value
                        },
                        success:function(data){
                            goodslink.style.display = "none";
                            if(data.status=="1"){
                                self._get("input-upload",'input').setAttribute("disabled",true);

                                self._get("input-upload",'input').style.display="none"
                                submitType =2;
                                self._get("file-name","em").innerHTML = data.result.title.substring(0,10)+"...";
                                self._get("file","span").style.display="";

                                for(var p in data.result){
                                    var parmavalue =data.result[p];
                                    if(p=="props")parmavalue= KISSY.JSON.stringify(data.result.props);
                                    self.addParam(p,parmavalue);
                                }

                            }
                            else Helper.showMessage(data.msg);
                        }

                    })
                }
            })




        }

    }


    SNS.widget.FeedEditor=MicroBlog;

},"SNS.util.Helper,SNS.widget.FeedSuggest,SNS.widget.Face");
