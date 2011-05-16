// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk:
/**
 * SNS 弹出模态框
 *
 * @author mingcheng@taobao.com
 * @date   2009-08-10
 */
SNS("SNS.util.Popup", function(){

    (function(S) {
        var Event = YAHOO.util.Event, Dom = YAHOO.util.Dom, Lang = YAHOO.lang;

        var runCustomEvent = function(func, scope) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof func == 'function') {
                return func.apply(scope || this, args.slice(2));
            }
        };

        var TMPL = '<div class="sns-popup-mask"></div>' +
        '<div class="sns-popup">' + 
        '<div class="hd">' +
        '<h3>{title}</h3>' +
        '</div>' +
        '<div class="bd"><span class="icon"></span>{content}</div>' +
        '<div class="ft">' +
        '<div class="buttons"></div>' +
        '<a href="#" title="关闭此窗口" class="btn-close">x</a>' +
        '</div>' +
        '</div>';

        var defConfig = {
            title: '',           // 模态框标题
            type: '',           // 模块框额外样式
            extraWrapperClass: '',     // 模块框最外层 class
            content: '',         // 模态框文案，支持 HTML
            useAnim: false,      // 是否动画显示
            autoShow: true,      // 是否自动显示
            width: 350,          // 对话框宽度
            hideMask: false,     // 是否显示遮层
            focus: 0,            // 默认焦点对焦位置
            buttons: [
            {
                text: "确定",
                func: function() {
                    this.hide();
                }
            }
            ]
        };


        var Popup = function(config, context) {
            this.context = context || document.body;
            this.config  = Lang.merge(defConfig, config || {});
            this.init();
        };

        Popup.prototype = {
            /**
         * 初始化
         */
            init: function() {
                var wrapper = document.createElement('div'), config = this.config;
                Dom.setStyle(wrapper, 'display', 'none');

                if (YAHOO.lang.isString(config.content)) {
                    wrapper.innerHTML = KISSY.substitute (TMPL, config);
                } else {
                    wrapper.innerHTML = KISSY.substitute (TMPL, Lang.merge(config, {
                        content: ''
                    }));
                    (Dom.getElementsByClassName('bd', 'div', wrapper)[0]).appendChild(config.content);
                }

                if (config.hideMask) {
                    Dom.addClass(wrapper, 'sns-popup-hidemask');
                }
                Dom.addClass(wrapper, 'sns-popup-wrapper ' + config.extraWrapperClass);

                // 对话框
                var popup = Dom.getElementsByClassName('sns-popup', 'div', wrapper)[0];
                if (config.width) {
                    Dom.setStyle(popup, 'width', config.width + 'px');
                }

                if (config.type) {
                    Dom.addClass(popup, config.type);
                }

                // 添加按钮
                var buttonContent = Dom.getElementsByClassName('buttons', 'div', popup)[0],
                i = 0, buttons = config.buttons, len = buttons.length;
                if (len) {
                    for (; i < len; i++) {
                        var btn = document.createElement('button');
                        btn.innerHTML = "<span>" + buttons[i].text + "</span>";
                        Event.on(btn, 'click', buttons[i].func, this, true); // 绑定对应的回调
                        buttonContent.appendChild(btn);
                    }
                } else {
                    Dom.setStyle(buttonContent, 'display', 'none');
                }

                var closeButton = Dom.getElementsByClassName('btn-close', 'a', popup)[0];
                if (closeButton) {
                    Event.on(closeButton, 'click', function(e) {
                        Event.stopEvent(e);
                        this.hide();
                    }, this, true);
                }

                // 绑定 ESC 键，@TODO Fix Webkit
                Event.on(document, 'keypress', function(e) {
                    if (27 == Event.getCharCode(e)) this.hide();
                }, this, true);
                // 针对 IE6 的 Hack
                if (6 == YAHOO.env.ua.ie || config.iframeShim) {
                    var de = document.documentElement;
                    //Fix added by shiran 解决ie6下有滚动条时跳动问题 10.05.24
                    var _offset = de.scrollTop || document.body.scrollTop;

                    Dom.setStyle(wrapper, 'position', 'absolute');
                    Dom.setStyle(wrapper, 'z-index', '999999');
                    Dom.setStyle(wrapper, 'top', _offset + 'px');//Fix changed by shiran 解决ie6下有滚动条时跳动问题 10.05.24
                    var iframe = document.createElement('iframe');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('scrolling', 'no');
                    iframe.src = "about:blank";
                    iframe.style.cssText = 'position:absolute; top: 0px; left: 0px; z-index: -1; filter:alpha(opacity=0);';

                    Dom.setStyle(iframe, 'width',  (de.clientWidth  || document.body.clientWidth) - 20 + 'px');
                    Dom.setStyle(iframe, 'height', (de.clientHeight || document.body.clientHeight) + 'px');
                    Dom.setStyle(wrapper, 'height', (de.clientHeight || document.body.clientHeight) + 'px');
                    wrapper.appendChild(iframe);

                    var innerMask = Dom.getElementsByClassName('sns-popup-mask', 'div', wrapper)[0], resizeTimer;
                    var resizePopup = function(e) {
                        var resize = function () {
                            if (innerMask) {
                                Dom.setStyle(innerMask, 'width', Dom.getViewportWidth() + 'px');
                                Dom.setStyle(innerMask, 'height', Dom.getViewportHeight() + 'px');
                            }

                            var offset = de.scrollTop || document.body.scrollTop;
                            var totalHeight = de.scrollHeight || document.body.scrollHeight;
                            if (offset + (de.clientHeight || document.body.clientHeight) > totalHeight) {
                                return;
                            }

                            Dom.setStyle(wrapper, 'top', offset + 'px');
                            Dom.setStyle(wrapper, 'zoom', '1.2');
                            Dom.setStyle(wrapper, 'zoom', '');
                        };

                        if (resizeTimer) {
                            resizeTimer.cancel();
                        }
                        resizeTimer = YAHOO.lang.later(10, null, resize, null, false);
                    };

                    Event.on(window, 'scroll', resizePopup, this, true);
                    Event.on(window, 'resize', resizePopup, this, true);

                    // 重修修订 IE6 下滚动条的问题
                    resizePopup();
                }

                this.context.appendChild(wrapper);

                this.wrapper = wrapper;
                this.popup = popup;

                // 是否自动显示
                if (config.autoShow) this.show();
            },

            /**
         * 显示模态框
         */
            show: function() {
                var config = this.config;
                if (config.onShow) {
                    runCustomEvent(config.onShow, this);
                }

                Dom.setStyle(this.wrapper, 'display', '');

                if (config.useAnim) {
                    Dom.setStyle(this.popup, 'opacity', '0');
                    this.anim = new YAHOO.util.Anim(this.popup, {
                        opacity: {
                            to: 1
                        }
                    }, .5);
                    this.anim.animate();
                }

                YAHOO.lang.later(20, this, function() {
                    try {
                        (this.popup.getElementsByTagName('button')[config.focus]).focus();
                    } catch(e) {};
                }, null, false);
            },

            /**
         * 隐藏模态框
         */
            hide: function() {
                var config = this.config;
                if (config.useAnim && this.animate) this.animate.stop();
                Dom.setStyle(this.wrapper, 'display', 'none');
                //怪异，就加了这个就解决了问题，点取消后，不能重点的问题，待研究 by shiran 10.04.12
                //此问题待处理！！！ 10.04.14
                //this.wrapper && Dom.addClass(this.wrapper,'hidden');
                if (config.onHide) {
                    runCustomEvent(config.onHide, this);
                }
            }
        };

        // 耦合到 SNS 命名空间
        S.sys.Popup = Popup;
    })(SNS);



    /**
 * Class 实现
 * 使代码更容易实现继承和扩展
 * requires SNS
 * @author zhangquan
 * @date   2009-08-17
 */


    (function(){

        /**
     * Class的构造器
     * @param {Object} 构造新类所需的属性集合
     * @return {Function} 新类的构造器
     */
        function Class(parms){
            //如果参数是方法类型，把此方法当作构造器
            if(parms instanceof Function) parms=parms();

            var newClass=function(){
                var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
                return value;
            }

            Class._build(newClass,parms);
            var parentMethod=newClass.prototype["parent"];
            parentMethod=parentMethod?parentMethod:Object;
            newClass.constructor=Class;
            newClass.prototype.constructor=newClass;

            return newClass;

        }

        //混入
        Class.mixin=function(original, extended){
            if(original){
                for (var key in (extended || {})) if(extended[key]!=null)original[key] = extended[key];

                return original;
            }
        }
        //混入方法
        Class.mixinFun=function(original, extended,sope){

            var newFun=function(arguments){
                original(arguments);
                extended(arguments);
            }

            return function(){
                newFun.apply(sope,arguments);
            }


        }

        //复制
        Class.clone=function(object){
            var cloned;

            switch (typeof(object)){
                case 'object':
                    cloned = {};
                    for (var p in object) cloned[p] = Class.clone(object[p]);
                    break;
                case 'array':
                    cloned = [];
                    for (var i = 0, l = object.length; i < l; i++) cloned[i] = Class.clone(object[i]);
                    break;
                default:
                    return object;
            }

            return cloned;
        }



        /**
	 *构造新类
	 *@method Class.implement
	 *@origin {Object} 源始对象
	 *@parms {Object} 需要实现的属性
	 */
        Class._build=function(origin,key, value){
            //实现继承和扩展
            if (typeof(key) == 'object'){
                for (var p in key) Class._build(origin,p,key[p]);
                return origin;
            }


            var inheritance=Class.inheritance[key];
            if(inheritance){
                value=inheritance.call(origin,value);
                if(value==null)return origin;
            }

            var proto = origin.prototype;


            switch (typeof(value)){

                case 'object':
                    proto[key] = Class.clone(value);
                    break;
                case 'function':
                    value._name=key;
                    proto[key]=value;
                    break;
                case 'array':
                    proto[key] = Class.clone(value);
                    break;

                default:
                    proto[key] = value;
                    break;

            }

        }


        Class.inheritance={


            /**
		* 单继承
		* @super ｛Function｝超类
		*/
            extend:function(parent){

                //继承原型
                this.parent=parent;
                var F=function(){};
                F.prototype=parent.prototype;
                this.prototype=new F();

                //调用父类的构造器，只支持在构造函数中直接调用


                this.prototype.parent=function(){
                    this._sope=arguments.callee._owner;


                    var previous = this._sope.parent.prototype[arguments.callee.caller._name];
                    if (!previous) throw new Error('The method "' + method + '" has no parent.');
                    this._sope=arguments.callee._owner;

                    return previous.apply(this, arguments);
                }

                this.prototype.parent._owner=this;

            },

            /**
		* 多重扩展
		* 不支持instanceof操作
		* @parents {Array}
		*/
            implement:function(parents){
                var parentlist=[];
                if(typeof(parents)=="array")parentlist=parents;
                else parentlist.push(parents);


                for(var i=0;i<parentlist.length;i++){
                    var parent=parentlist[i];

                    if(typeof(parent)=="function")parentlist[i]=new parent();
                    Class.mixin(this.prototype,parentlist[i]);
                }
            },
            statics:function(methods){
                Class.mixin(this,methods);
            }
        //为生成的类加载常用工具方法



        }




        SNS.sys.Class=Class;




    })();



    /**
 * JsonHtm
 * 根据一定的Json格式，构造html，并可把元素绑定到当前作用域
 * 便于widget组件构造html代码，并获对元素的引用
 * requires SNS
 * @author zhangquan
 * @date   2009-08-19
 */


    (function(){

        /**
	* {ul:{className:"list",ref:"myList"},'>>':[
	*		{li:{className:["red","blue"]},num:2},
	*		{li:{className:"red"}},
	*		{li:{className:"red"}}
	*  ]}
	*/
        var JsonHtml={

            compose:function(config,attrIndex){

                var tag,attr,ref,childs=[];

                for(var key in config){
                    var value=config[key];
                    switch(key){
                        case "ref"://引用
                            ref=value;
                            break;
                        case '>>'://子元素
                            childs=value;
                            break;
                        default:
                            tag=key;
                            attr=value;
                            break;
                    }
                }

                if(!tag)return;

                //支持dom对象
                var root=config[tag].nodeName?config[tag]:document.createElement(tag);


                if(ref)this[ref]=root;


                //设置属性
                JsonHtml.setAttr(root,attr,attrIndex);

                //添加子类
                if(childs){

                    if(typeof childs=="string"){
                        root.innerHTML=childs;

                    }
                    else{
                        for(var i=0;i<childs.length;i++){
                            var num=childs[i].num||1;
                            for(var j=0;j<num;j++){
                                //递归
                                var childEl=arguments.callee.call(this,childs[i]);
                                if(childEl)root.appendChild(childEl);
                            }
                        }
                    }

                }

                return root;
            },
            //设置属性
            setAttr:function(target,attr,attrIndex){
                var index=attrIndex?attrIndex:0;
                for(var p in attr){
                    var value=attr[p];
                    switch(p){
                        case "style":
                            JsonHtml.setStyle(target,value);
                            break;
                        case "className":
                            target.className=value;
                            break;
                        default:
                            target.setAttribute?target.setAttribute(p,value):target[p]=value;
                            break;

                    }


                }

            },

            setStyle:function(target,style){

                for(var p in style){

                    target.style[p]=style[p];

                }
            }


        }

        SNS.sys.JsonHtml=JsonHtml;


    })();



    (function(){

        var Class=SNS.sys.Class,JsonHtml=SNS.sys.JsonHtml,Dom=YAHOO.util.Dom,Event=YAHOO.util.Event;
        var firstPanel;

        var Panel=new Class({

            initialize:function(html,config){
                this.config={
                    width:"350px",
                    height:"",
                    className:"panel",
                    zIndex:999,
                    top:"0px",
                    left:"0px",
                    offsetTop:0,
                    offsetLeft:0,
                    opacity:0,

                    state:"hide",

                    iframeShim:true,
                    alphaShim:false,

                    hideHandle:true,
                    blurHide:false,
                    hideHandleRight:"10px",
                    hideHandleTop:"14px",

                    container:document.body,
                    unit:"px",
                    autoHide:false,

                    onShow:function(){},
                    onHide:function(){},
                    onRemove:function(){}
                }

                this.build(html,config);

            },

            build:function(html,config){
                this.modifyConfig(config);
                this.createHtml(html);
                this.place();

                this.attach();

                this.matchCoor(this.iframeShim,this.container);
                this.matchCoor(this.alphaShim,this.container);

                if(this.config.state=="hide"){
                    this.container.style.display="none";
                }
            },

            modifyConfig:function(config){
                Class.mixin(this.config,config);
            },

            htmlConfig:function(html,style){
                var iframeShim={},alphaShim={}, hideHandle={};

                if (this.config.iframeShim) {
                    iframeShim={
                        iframe:{
                            className:"iframeShim",
                            frameborder:0,
                            style:style.iframeShim
                        },
                        ref:"iframeShim"
                    };
                }

                if (this.config.alphaShim) {
                    alphaShim={
                        div:{
                            className:"alphaShim",
                            style:style.alphaShim
                        },
                        ref:"alphaShim"
                    };
                }

                if(this.config.hideHandle){
                    hideHandle={
                        span:{
                            className:"hide-handle sns-icon icon-del-nob",
                            style:style.hide
                        },
                        ref:"hideHandle"
                    };
                }

                return	{
                    div:{
                        className:this.config.className,
                        style:style.container
                    },
                    ref:"container",
                    ">>":[
                    iframeShim,
                    alphaShim,
                    {
                        div:{
                            className:"panel-main-content",
                            style:style.mainContent
                        },
                        ref:"mainContent",
                        ">>":[

                        {
                            div:{
                                className:"panel-content",
                                style:style.content
                            },
                            ref:"content",
                            ">>":html
                        },
                        hideHandle
                        ]
                    }
                    ]
                };
            },

            styleConfig:function(){

                var style={
                    container:{
                        top:this.config.top,
                        left:this.config.left,
                        position:"absolute",
                        zIndex:this.config.zIndex,
                        width:this.config.width,
                        height:this.config.height,
                        display:"none"
                    },

                    mainContent:{
                        position:"relative",
                        zIndex:15
                    }
                }

                if(this.config.alphaShim){
                    style.alphaShim={
                        position:"absolute",
                        top:"0px",
                        left:"0px",
                        zIndex:5,
                        opacity:this.config.opacity,
                        filter:"alpha(opacity="+this.config.opacity*100+")",
                        backgroundColor:"#000"
                    }
                };

                if(this.config.iframeShim){
                    style.iframeShim={
                        position:"absolute",
                        top:"0px",
                        left:"0px",
                        zIndex:4,
                        opacity:0,
                        filter:"alpha(opacity=0)"
                    }
                };


                if(this.config.hideHandle){
                    style.hide={
                        display:"block",
                        width: "10px",
                        height: "10px",
                        position: "absolute",
                        top: this.config.hideHandleTop,
                        right: this.config.hideHandleRight,
                        cursor:"pointer",
                        zIndex:20
                    }
                }

                return style;

            },

            createHtml:function(html){
                var self=this;
                if(html.nodeType){
                    this.container=this;
                    return ;
                }

                var jsonHtml=this.htmlConfig(html,this.styleConfig());
               var htmlEl = JsonHtml.compose.call(this,jsonHtml);
               if(!firstPanel){
                  
                   document.body.insertBefore(htmlEl, document.body.childNodes[0]);
               }
               else{

                   KISSY.DOM.insertAfter(htmlEl, firstPanel);
                  
               }
                firstPanel = htmlEl;
             

                if(this.config.documentShim){
                    this.documentShim=new SNS.sys.DocumentShim({
                        opacity:this.config.opacity
                    });
                }

            },
            matchCoor:function(node,relNode){
                var state=this.container.style.display;
                this.container.style.visibility="hidden";
                this.container.style.display="block";
                if(node)node.style.height=relNode.offsetHeight+"px";
                if(node)node.style.width=relNode.offsetWidth+"px";
                this.container.style.display=state;
                this.container.style.visibility="";
            },
            place:function(){
                this.container.style.top=parseInt(this.config.top)+parseInt(this.config.offsetTop)+this.config.unit;
                this.container.style.left=parseInt(this.config.left)+parseInt(this.config.offsetLeft)+this.config.unit;
                return this;

            },

            attach:function(){
                var self=this;
                if(this.config.hideHandle)Event.on(this.hideHandle, 'click', this.hide, this, true);
               
                if(this.config.blurHide){
                    Event.on(this.mainContent,"click",function(){
                        this.eventPassBy=true;
                    },this,this);

                    Event.on(document,"click",function(){
                        // KISSY.log("123"+this.config.blurHide);
                        if(!this.eventPassBy)this.hide();
                        this.eventPassBy=null;
                    },this,this);
                }

            },

            show:function(){
                var self=this;
                this.config.state="show";
                this.container.style.display="block";
                if(this.config.documentShim){
                    this.documentShim.show();
                }
                this.config.onShow.apply(this,arguments);
                if(this.onShow)this.onShow.apply(this,arguments);


            },

            hide:function(){
                this.config.state="hide";
                this.container.style.display="none";
                if(this.config.documentShim){
                    this.documentShim.hide();
                }
                this.config.onHide.apply(this,arguments);
                if(this.onHide)this.onHide.apply(this,arguments);

            },

            remove:function(){
                this.container.parentNode.removeChild(this.container);
                if(this.config.documentShim){
                    this.documentShim.remove();
                }
                this.config.onRemove.apply(this,arguments);
            },


            addEvent:function(className,tag,type,fun){

                var childs=Dom.getElementsByClassName(className, tag,this.container);
                for(var i=0;i<childs.length;i++){
                    Event.on(childs[i], type,fun,childs[i],this);
                }
            }
        });


        var CenterPanel=new Class({

            extend:Panel,

            initialize:function(html,config){
                this.parent(html,config);
                var self=this;
                if(this.config.autoHide){
                    this._timer=window.setTimeout(function(){
                        self.hide();
                        if(self._timer){
                            window.clearTimeout(self._timer);
                        }
                    }, this.config.autoHide);
                }
            },

            modifyConfig:function(config){
                this.config.opacity=0;
                this.config.alphaShim=true;
                this.config.hideHandle=true;
                this.config.state="show";
                this.config.fixed=true;
                this.parent(config);
            },

            styleConfig:function(){
                var style=this.parent();
                style.container={
                    width: "100%",
                    height: "100%",
                    position: this.config.fixed?"fixed":"absolute",
                    top: "0px",
                    left: "0px",
                    zIndex:this.config.zIndex


                };
                Class.mixin(style.mainContent,{
                    margin:"auto",
                    width:this.config.width,
                    height:this.config.height
                })

                return style;

            },
            createHtml:function(html){

                this.parent(html);
                var self=this;
                Dom.setStyle(self.container, 'visibility', 'hidden');
                var resize = function(e) {

                    var offset = document.documentElement.scrollTop || document.body.scrollTop;

                    var totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

                    Dom.setStyle(self.container, 'width',  (document.documentElement.clientWidth  || document.body.clientWidth) + 'px');
                    Dom.setStyle(self.container, 'height', Dom.getViewportHeight() + 'px');
                    Dom.setStyle(self.container, 'top', offset + 'px');

                    Dom.setStyle(self.container, 'zoom', '1');
                    Dom.setStyle(self.container, 'zoom', '');

                    self.matchCoor(self.iframeShim,self.container);
                    self.matchCoor(self.alphaShim,self.container);
                }
                if(this.config.fixed){
                    if (6 == YAHOO.env.ua.ie) {

                        this.container.style.position="absolute";


                        resize();
                        Event.on(window, 'scroll', resize, this, true);
                        Event.on(window, 'resize', resize, this, true);
                    }
                } else{
                    resize();
                }
                this.mainContent.style.top=(this.container.offsetHeight-this.mainContent.offsetHeight)/2+"px";
                setTimeout(function() {
                    Dom.setStyle(self.container, 'visibility', 'visible');
                }, 50);
            },
            place:function(){
            }

        });

        var NearbyPanel=new Class({
            extend:Panel,

            initialize:function(el,html,config){

                this.el=el;
                this.parent(html,config);
            },
            modifyConfig:function(config){
                this.config.coordinate=[3,4];
                this.config.hideHandle=false;
                this.config.blurHide=true;
                this.config.showHandle=true;
                this.parent(config);
            },

            /*
		* 定位
		* @coordinate ｛array｝代表坐标位置 ,coordinate[0]：以relativeEl中心点为原点的coordinate[0]象限内的顶角
		*                                    coordinate[1]：以coordinate[0]所代表的顶角为中心点的coordinate[1]象限区域
		*/
            place:function(){



                var position=this.getCoordinate(this.el);
                this.container.style.left=position.x+parseInt(this.config.offsetLeft)+this.config.unit;
                this.container.style.top=position.y+parseInt(this.config.offsetTop)+this.config.unit;
                return this;


            },

            //计算坐标
            getCoordinate:function(){

                var coo=this.config.coordinate;
                var pointPosition=this.getPointPosition(this.el,coo[0]);
                this.container.style.visibility="hidden";
                this.container.style.display="block";


                var h=this.container.offsetHeight,w=this.container.offsetWidth;
                this.container.style.display="none";
                this.container.style.visibility="";
                var area=[[0,-h],[-w,-h],[-w,0],[0,0]];

                var y=pointPosition.y+area[coo[1]-1][1];
                var x=pointPosition.x+area[coo[1]-1][0];
                return {
                    x:x,
                    y:y
                };



            },
            //计算顶角坐标
            getPointPosition:function(el,point){

                var p =Dom.getXY(el);
                p={
                    x:p[0],
                    y:p[1]
                };

                switch(point){
                    case 1:
                        p.x+=el.offsetWidth;
                        break;
                    case 2:
                        break;
                    case 3:
                        p.y+=el.offsetHeight;
                        break;
                    case 4:
                        p.y+=el.offsetHeight;
                        p.x+=el.offsetWidth;
                        break;
                }
                return p;
            },
            attach:function(){
                this.parent();
                if(this.config.showHandle)Event.on(this.el, 'click', function(e){
                    Event.stopEvent(e);

                    //重新定位
                     
                    this.place();
                    this.show();
                    this.eventPassBy=true
                }, this, true);


            }
        });



        var snsPanel=function(html,config){
            var html='<div class="sns-panel-wrap"></div><div class="sns-panel"><div class="sns-panel-content">'+html+'</div></div>'
            var panel=new Panel(html,config);
            var wrap=Dom.getElementsByClassName("sns-panel-wrap","div",panel.content)[0];

            panel.matchCoor(wrap,panel.mainContent);
            return panel;
        }

        var snsNearbyPanel=function(el,html,config){
            var html='<div class="sns-panel-wrap"></div><div class="sns-panel"><div class="sns-panel-content">'+html+'</div></div>'
            var panel=new NearbyPanel(el,html,config);
            var wrap=Dom.getElementsByClassName("sns-panel-wrap","div",panel.content)[0];
            panel.autoHeight=function(){
                panel.matchCoor(wrap,panel.mainContent);
            }
            panel.autoHeight();
            return panel;
        }

        var snsCenterPanel=function(html,config){
            var html='<div class="sns-panel-wrap"></div><div class="sns-panel"><div class="sns-panel-content">'+html+'</div></div>'
            var panel=new CenterPanel(html,config);
            var wrap=Dom.getElementsByClassName("sns-panel-wrap","div",panel.content)[0];

            panel.autoHeight=function(){
                panel.matchCoor(wrap,panel.mainContent);
            }
            window.setTimeout(function(){
                panel.autoHeight();
            }, 10)   ;

            return panel;
        }

        var snsDialog=function(parms){
            var config={
                title:"小提示",
                content:"dialog",
                hideHandle:true,
                width:"350px",
                confirmBtn:function(){
                    this.hide();
                },
                cancelBtn:function(){
                    this.hide();
                }
            }
            SNS.sys.Class.mixin(config,parms);
            var btnHtml='<div class="buttons">';

            if(config.confirmBtn){
                btnHtml+='<button class="confirm"><span>确定</span></button>'
            }

            if(config.cancelBtn){
                btnHtml+='<button class="cancel"><span>取消</span></button>'
            }

            btnHtml+="</div>";
            var newHtml='<div class="hd"><h3>'+config.title+'</h3></div>'+
            '<div class="bd">'+config.content+'</div>'+
            '<div class="ft">'+btnHtml+'</div>'+
            '<a href="#" title="关闭此窗口" class="btn-close"></a></div>';
            var panel=SNS.sys.snsCenterPanel(newHtml,config);
            if(config.confirmBtn){
                panel.addEvent("confirm","button","click",config.confirmBtn);
            }
            if(config.cancelBtn){
                panel.addEvent("cancel","button","click",config.cancelBtn);
            }
            return panel;


        }

        var DocumentShim=new Class({
            initialize:function(config){
                this.config={
                    opacity:0,
                    zIndex:998
                }

                Class.mixin(this.config,config);
                this.build();


            },
            build:function(){
                var w=Dom.getDocumentWidth()+"px";
                var h=Dom.getDocumentHeight()+"px";
                this.mask=document.createElement("div");
                this.maskIframe=document.createElement("iframe");
                this.mask.className="document-shim";
                this.maskIframe.className="document-shim";
                //this.mask.innerHTML='<iframe height="'+h+'" frameborder="0" width="'+w+'" style="position: absolute; top: 0pt; left: 0pt; z-index: 1;"></iframe>';
                var  style=this.mask.style;
                var styleIframe=this.maskIframe.style;
                var newStyle={
                    top:"0",
                    left:"0",
                    position:"absolute",
                    zIndex:this.config.zIndex,
                    width:w,
                    height:h,
                    overflow:"hidden",
                    backgroundColor:"#000",
                    opacity:this.config.opacity,
                    filter:"alpha(opacity="+this.config.opacity*100+")"
                }
                Class.mixin(style,newStyle);
                Class.mixin(styleIframe,newStyle);
                document.body.insertBefore(this.mask, document.body.childNodes[0]);
                document.body.insertBefore(this.maskIframe, document.body.childNodes[0]);
                this.mask.style.display="none";
                this.maskIframe.style.display="none";

            },
            show:function(){
                this.mask.style.display="block";
                this.maskIframe.style.display="block";
            },
            hide:function(){
                this.mask.style.display="none";
                this.maskIframe.style.display="none";
            },
            remove:function(){
                this.mask.parentNode.removeChild(this.mask);
                this.maskIframe.parentNode.removeChild(this.maskIframe);
            }


        })




        SNS.sys.Panel=Panel;
        SNS.sys.CenterPanel=CenterPanel;
        SNS.sys.NearbyPanel=NearbyPanel;
        SNS.sys.snsPanel=snsPanel;
        SNS.sys.snsCenterPanel=snsCenterPanel;
        SNS.sys.snsNearbyPanel=snsNearbyPanel;
        SNS.sys.snsDialog=snsDialog;
        SNS.sys.DocumentShim=DocumentShim;




    })();




    (function(){
        var Y = YAHOO,
        U = Y.util,
        D = U.Dom,
        E = U.Event,
        L = Y.lang,
        Connect = U.Connect,
        Get = U.Get,
        Env = Y.env,
        UA = Env.ua,
        K = KISSY,
        doc = document;


        TB = TB || {};
        if (!TB.widget) {
            TB.widget = {};
        }
        TB.widget.SimplePopupPlus = {
            /**
         * 包装元素
         * @memberOf    TB.widget.SimplePopupPlus
         * @param   {HTMLElement}   trigger     触发弹出框的元素.
         * @param   {HTMLElement}   popup       弹出框元素.
         * @param   {Object}        config      弹出参数.
         */
            decorate: function() {
                var SimplePopupPlus = TB.widget.SimplePopupPlus;

                var mask = document.createElement('DIV');
                D.addClass(mask, 'sns-popup-mask-back');

                document.body.appendChild(mask);

                var onClickMaskEvent = new YAHOO.util.CustomEvent('onClickMask');

                E.on(mask, 'click', function(e) {
                    onClickMaskEvent.fire(e);
                });

                // 点击 Mask 时的动作
                var onClickMask = function(type, e) {
                    var el = E.getTarget(e);
                    if (D.isAncestor(this.popup, el)) {
                        return;
                    }

                    if (onClickMaskEvent.subscribers.length < 2) {
                        this.hide();
                    }
                };

                var currentPopup = null;

                // 处理 Tab 键
                var checkTabKeyDown = function(e) {
                    var el = E.getTarget(e),
                    charCode = E.getCharCode(e);

                    if (charCode !== 9 || (D.isAncestor(currentPopup, el) && !e.shiftKey)) {
                        return;
                    }

                    E.stopEvent(e);

                    if (!e.shiftKey) {
                        try {
                            var firstA = currentPopup.getElementsByTagName('A')[0];
                            firstA && firstA.focus();
                        } catch (e) {
                        }
                    }
                };

                // 添加检查 Tab 键的监听器
                var addCheckTabListener = function(elPopup) {
                    currentPopup = elPopup;
                    E.on(document, 'keydown', checkTabKeyDown);
                };

                // 删除检查 Tab 键的监听器
                var removeCheckTabListener = function() {
                    currentPopup = null;
                    E.removeListener(document, 'keydown', checkTabKeyDown);
                };

                // 自动将弹出层位置适应当前屏幕
                var autoFitPosition = function(popup) {
                    if (!popup.config.autoFit) {
                        return;
                    }

                    var viewWidth = D.getViewportWidth(),
                    viewHeight = D.getViewportHeight(),
                    scrollTop = D.getDocumentScrollTop(),
                    region = D.getRegion(popup.popup),
                    height = popup.config.height || region.height;

                    if (region.right > viewWidth) {
                        D.setStyle(popup.popup, 'left', region.left - (region.right - viewWidth) + 'px');
                    }

                    if (region.top + height > scrollTop + viewHeight) {
                        D.setStyle(popup.popup, 'top', region.top - (scrollTop + viewHeight - region.top - height));
                    }

                    if (region.top < scrollTop) {
                        D.setStyle(popup.popup, 'top', scrollTop + 'px');
                    }
                };

                SimplePopupPlus.decorate = function(trigger, popup, opts) {
                    if (YAHOO.env.ua.ie === 6) {
                        // TODO IE6 的 hack
                        var hack = 'TODO';
                    }

                    L.augmentObject(opts, {
                        onClickMask: onClickMask
                    });

                    var _onHide = opts.onHide,
                    _onShow = opts.onShow;

                    opts.onShow = function() {
                        var de = document.documentElement;

                        var self = this;
                        setTimeout(function() {
                            autoFitPosition(self);
                        }, 0);
                        addCheckTabListener(this.popup);

                        onClickMaskEvent.subscribe(this.config.onClickMask, this, true);
                        _onShow && _onShow.apply(this, arguments);

                        D.setStyle(mask, 'display', 'block');
                        D.setStyle(mask, 'width', de.scrollWidth + 'px');
                        D.setStyle(mask, 'height', de.scrollHeight + 'px');
                        D.setStyle(mask, 'zoom', '1');
                    };

                    opts.onHide = function() {
                        removeCheckTabListener();

                        onClickMaskEvent.unsubscribe(this.config.onClickMask, this);
                        _onHide && _onHide.apply(this, arguments);

                        // 因为 Mask 是共用的，所有需要检测是不是有其他弹出框弹出
                        if (onClickMaskEvent.subscribers.length < 1) {
                            D.setStyle(mask, 'display', 'none');
                        }
                    };

                    var SimplePopup = TB.widget.SimplePopup;

                    var handle = SimplePopup.decorate.apply(SimplePopup, arguments);
                    handle.mask = mask;
                    D.setStyle(handle.popup, 'z-index', '8901');

                    return handle;
                };

                return SimplePopupPlus.decorate.apply(SimplePopupPlus, arguments);
            }
        };

    })();






})

