/**
 * sns.js
 * @author         bofei
 * @changelog      ver 1.0 @ 2010-9-25    Initialize release
 */

SNS("SNS.util.Ajax",function(S){
    
    var K = KISSY, Helper= SNS.sys.Helper;
    var rurl = /^(\w+:)?\/\/([^\/?#]+)/;
    var PROXYNAME="crossdomain.htm",PROXYID="J_Crossdomain";

    var iframeProxys={};//存放代理iframe，防止再次请求
    var requestState={};//记录请求并并状态，防止多次请求

    var getPath = function(url){
        var path,index = url.indexOf("?");
        if(index == -1){
            path = url;
        }
        else {
            path = url.substring(0, index);
        }
         return  path;
    }

    var isRequesting = function(url){
            var path = getPath(url),result;
            if(requestState[path]){
                KISSY.log(path+" is buzy")
                result = true;
            }
            else{
                result = false;
                requestState[path]=path;
            }
            return result;
    }
    var clearRequest = function(url){
          var path = getPath(url),result;
           if(requestState[path])requestState[path]=null;
    }
    /**
     * <ul>
     * <li>在同域的情况下Connect直接调用YAHOO.util.YAHOO.util.Connect请求资源;</li>
     * <li>在子域的情况下Connect 首先通一个id 为“J_StaticIframeProxy”的iframe获取请求域根目录下的代理文件
     * static_iframe_proxy.html。并将domain设成一致，再用iframe中的YAHOO.util.YAHOO.util.Connect
     * 发送请求；<li>
     * <li>当上述情况都不符合的情况使用jsonp发送请求</li>
     * </ul>
     * @name Ajax
     * @memberOf SNS
     * @class Connect类对YAHOO.util.YAHOO.util.Connect进行了封装，并增加了跨域处理的能力。
     * @param url {String} 要请求资源的url地址
     * @param c {Object} 配置信息
     *  <ul>
     *     <li>method: ｛string｝请求方法:"GET"和"POST",当使用JSONP时只能使用“GET”方法</li>
     *     <li>use: {string}发送请求的方式，Connect支持三种，分别是原生的XHR（xhr）,通过iframe代理(iframe),和JSONP(jsonp)</li>
     *     <li>success:{function}请求成功时的回调方法</li>
     *     <li>failure:{function} 请求失败时的回调方法，注意jsonp不存在这个回调</li>
     *     <li>data:{string}输送的数据</li>
     *  </ul>
     *  @example <p>new SNS.Ajax(u,c).send()</p><p>SNS.request(u,c)</p> <a href="../../examples/util/ajax.html">demo</a>
     */
    var Ajax=function(url,c){
        if(isRequesting(url))return;
        this._apply({
            method:"post",
            url:url
        },c);
        this.c= KISSY.merge(c,{
            url:url
        });
        this.c.method=this.c.method?this.c.method:"post";
      

    }

    Ajax.prototype=
    /**
         * @lends SNS.Ajax.prototype
         */
    {

        /**
         * 自动判断跨域，发送请求
         *
         * @function
         * @param url {String} 要请求资源的url地址
         * @param c {Object} 配置信息
         */
        send:function(url,c){
            this._apply(c,{
                url:url
            });
            if(!this.c.url) return this;
            if(!this.c.use)  this.c.use=this._autoCheck(this.c.url);



            switch(this.c.use){
                case "xhr" :
                    this._YUIRequest();
                    break;
                case "iframe":
                    this._iframeRequest();
                    break;
                case "jsonp":
                    this._JSONPRequest();
                    break;
            }

            return this;
        },
       
        /**
         * 根据跨域情况，选择请求方式
         */
        _autoCheck:function(url){
            var use="xhr",p,l=location,pa,ha,ps,hs;
            p = rurl.exec(url);
            if(p){
                if( p[1] !== l.protocol || p[2] !== l.host){
                    use="jsonp";
                    if( p[1] === l.protocol){
                        pa=p[2].split(".");
                        ha=l.host.split(".");
                        ps=pa[pa.length-2]+pa[pa.length-1];
                        hs=ha[ha.length-2]+ha[ha.length-1];
                        if(ps==hs)use="iframe";
                    }
                }else use="xhr";
            }
            return use;
        },

        _apply:function(){
            var a=arguments, l=a.length;
            this.c=this.c?this.c:{}
            for(var i=0;i<l;i++){
                for(var p in a[i]){
                    if(a[i][p])this.c[p]=a[i][p];
                }
            }
        },

        _YUIRequest:function(){
            var self=this;
            var callback={
                success:function(data){
                  clearRequest(self.c.url)
                    if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);
                    if(self.c.dataType=="html")data=data.responseText;

                    if(self.c.success)  self.c.success(data, self.c)
                },
                failure:function(data){
                    clearRequest(self.c.url)
                    if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);
                    if(self.c.dataType=="html")data=data.responseText;
                    if(self.c.failure) self.c.failure(data, self.c)
                }
            };
            var data=K.param(this.c.data);
            //  YAHOO.util.Connect.asyncRequest(this.c.method,this.c.url,callback,data);
            KISSY.ajax({
                type: this.c.method,
                url: this.c.url,
                data: this.c.data,
                success: function(data, textStatus, xhr) {
     
                    callback.success(xhr);
                },
                error:function(data, textStatus, xhr){

                    callback.failure(xhr);
                }
               
            });


        },

        _dataToString:function(data){
            var s="";
            for(var p in data){
                if(data[p]!=null)s+=p+"="+encodeURIComponent(data[p])+"&";
                if(s.length>0)s=s.substring(0,s.length-1);
                return s;
            }
        },
        _iframeRequest:function(){
            Ajax.setDomain();
            var self=this, iframe ;
            var send=function(){

                K.log("ready send"+iframe)
                var callback={
                    success:function(data){
                        K.log("request successs:"+self.c.url);
                        clearRequest(self.c.url)
                        /*  if(iframe){
                            K.DOM.remove(iframe);
                           K.log("delde iframe")
                        }
                         */
                        if(self.c.dataType=="html")data=data.responseText;
                        if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);

                        if(self.c.success)self.c.success(data, self.c)
                    },
                    failure:function(data){
                        K.log("request failuree :"+self.c.url);
                        clearRequest(self.c.url)
                        //  if(iframe)   K.DOM.remove(iframe)
                        if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);
                        if(self.c.failure)self.c.failure(data, self.c)

                    }
                };


                var data=K.param(self.c.data);


                if(iframe&&iframe.contentWindow&& iframe.contentWindow.YAHOO) iframe.contentWindow.YAHOO.util.Connect.asyncRequest(self.c.method,self.c.url,callback,data);
            }
         

   
     
            var parts = rurl.exec(this.c.url);
          
            var src = parts[0]+"/"+PROXYNAME;
            iframe = iframeProxys[src];
            if(iframe&&iframe._loaded == true){
                
                send();
            }
            else if(iframe&&iframe._loaded == false){
                if (iframe.attachEvent){
                    iframe.attachEvent("onload", function(){
                         iframe._loaded=true;
                        send();
                    });
                } else {
                    iframe.addEventListener("load",function(){
                         iframe._loaded=true;
                        send();
                    },false);
                }
            }
            else {
                iframe = K.DOM.create('<iframe class="crossdomain" frameborder="0" width="0" height="0"  ></iframe>');
                // 当iframe加载完成后发送请求
                //参考：http://www.planabc.net/2009/09/22/iframe_onload/
                if (iframe.attachEvent){
                    iframe.attachEvent("onload", function(){
                         iframe._loaded=true;
                        send();
                    });
                } else {
                    iframe.addEventListener("load",function(){
                         iframe._loaded=true;
                        send();

                    },false);
                }
                //获取请求资源的iframe代理文件
                iframe.src=src;
                iframe._loaded=false;
                K.DOM.append(iframe, document.body);

               
            }
           
        },
        _JSONPRequest:function(){

            var script,timer,self=this;
            var index=++SNS._JSONP.counter;
            SNS._JSONP['c' + index] = function(json){
                if(timer){
                    window.clearTimeout(timer);
                    timer=null;
                }
                self.c.success.call(self,json, self.c);
                if(script&&script.parentNode)script.parentNode.removeChild(script);
            }

            var parms=KISSY.param(this.c.data);
            KISSY.log("_JSONPRequest before"+this.c.url);
            var src = this._buildUrl(this.c.url,parms+"&callback=SNS._JSONP.c"+ index);
            KISSY.log("_JSONPRequest after"+src);

            script=document.createElement("script");
            document.body.insertBefore(script,document.body.firstChild);
            window.setTimeout(function(){
                script.setAttribute("type","text/javascript");
                script.src=src;
            },1);
            timer=this._timeOut(script,this.c.timeout);
            return script;

        },

        _timeOut:function(requestObject,timeout,callback){

            var time=timeout?timeout:5000;
            var timer=window.setTimeout(function(){
                if(requestObject&&requestObject.parentNode)  requestObject.parentNode.removeChild(requestObject);
                if(callback)callback();
            },time);
            return timer;
        },

        _buildUrl:function(url,parms){
            url += url.indexOf("?") > 0 ? "&" : "?";
            return url+parms;

        }

    
    };

    if (!SNS._JSONP) {
        SNS._JSONP = {};
        SNS._JSONP.counter=0;
    }

    Ajax.setDomain= function(){
       
        var _hostname = window.location.hostname.toString();
        var _hosts = _hostname.split(".");
        var _len = _hosts.length;
        //设置域名
        if(_len>2){
            try{
                document.domain= _hosts[_len-2]+"."+_hosts[_len-1];
            }catch(e){
                KISSY.log("set Domain error")
            }
        }
        K.log("setDomain:"+document.domain)
        return document.domain;
    };

    S.Ajax=Ajax;


    //提供一些简便的方法，便于调用
    /**
     * 自动判断跨域，发送请求
     * @name request
     * @memberOf SNS#
     * @function
     */
    S.request=function(url,config){
       
        return new Ajax(url,config).send();
    };

    /**
     * 使用jsonp的方式请求资源
     * @name jsonp
     * @memberOf SNS#
     * @function
     */
    
    S.jsonp=function(url,config){
        config.use="jsonp"
        return new Ajax(url,config).send();
    };

    /*合并基础database*/







    /**
 * 跨域请求数据封装
 * @requires  SNS ,SNS.sys.Class ,YAHOO.util.Container,YAHOO.lang.JSON;
 * @author zhangquan
 * @date 2009-08-22
 */
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
        };
        //混入方法
        Class.mixinFun=function(original, extended,sope){

            var newFun=function(arguments){
                original(arguments);
                extended(arguments);
            }

            return function(){
                newFun.apply(sope,arguments);
            }


        };

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
        };



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

        };


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



        };










        /**
     * 数据管理基础操作类
 	 * @module BasicDataSource
	 * @namespace SNS.sys
	 * @class BasicDataSource
     */
        var BasicDataSource = new Class({
            /**
         * 构造器
         * @method initialize
         * @param dataSourceConfig {Object} dataSource配置项
         */
            initialize: function(dataSourceConfig) {
                this.config = {
                    url: null, //请求url
                    parms: {}, //参数json对象
                    success: function() {}, //请求成功回调函数
                    failure: function() {}, //请求失败回调函数
                    callBackContext: this, //回调函数执行作用域，默认为this
                    iframeProxy: SNS.sys.Helper.getApiURI('http://comment.jianghu.{serverHost}/proxy.htm') //iframe代理地址
                };
                Class.mixin(this.config, dataSourceConfig);

            },

            /**
         * 得到请求参数字符串
         * @method getParms
         * @param jsonParms {Object} 参数对象
         * @return {String} 以&连接的请求参数字符串
         */
            getParms: function(jsonParms) {
                var config = this.config.parms;
                Class.mixin(config, jsonParms);
                Class.mixin(config, {
                    ran: Math.random()
                });
                var parms = '';
                //遍历params，组装字符串
                for (var p in config) {
                    if (config[p] != null)parms += p + '=' + encodeURIComponent(config[p]) + '&';
                }
                if (parms.length > 0)parms = parms.substring(0, parms.length - 1);
                return parms;
            },

            /**
         * 将url与参数合并成请求url
         * @param url   {String} 请求url
         * @param parms {String} 请求参数
         * @return {String} 带参数的请求url
         */
            buildUrl: function(url,parms) {
                url += url.indexOf('?') > 0 ? '&' : '?';
                return url + parms;

            },

            /**
         * POST方式的普通Ajax请求，使用json格式存取数据
         * @method json
         * @param requestJsonData {Object} 请求参数
         * @param successCallBack {function} 请求成功回调函数
         * @param failureCallBack {function} 请求失败回调函数
         * @return {Object} xhr对象
         */
            json: function(requestJsonData,successCallBack,failureCallBack) {
                var self = this;
                var callback = {

                    success: function(xhr) {
                        try {
                            var data = YAHOO.lang.JSON.parse(xhr.responseText);
                        }catch (e) {
                            throw new Error('Invalid response data');
                        }
                        //在当前作用域下执行回调方法
                        self.config.success.call(this.callBackContext, data);
                        if (successCallBack)successCallBack.call(this.callBackContext, data);
                    },

                    failure: function(xhr) {
                        self.config.failure.call(this, xhr);
                        if (failureCallBack)failureCallBack.call(this.callBackContext, xhr);
                    }

                };

                var parms = this.getParms(requestJsonData);
                //初始化头信息，使用json格式存取数据
                YAHOO.util.Connect.initHeader('Accept', 'application/json');
                YAHOO.util.Connect.initHeader('X-Request', 'JSON');

                var xhr = YAHOO.util.Connect.asyncRequest('POST', this.config.url, callback, parms);
                return xhr;

            },

            /**
         * jsonp形式的Ajax请求
         * @method jsonp
         * @param jsonParms       {Object} 请求参数
         * @param successCallBack {function} 请求成功回调函数
         * @return {HTMLElement} jsonp创建的script标签元素
         */
            jsonp: function(jsonParms,successCallBack) {
                var script = null;
                var timer = null;
                var index = SNS.sys._JSONP_counter;
                SNS.sys._JSONP_counter++;
                var self = this;
                //创建可直接调用的回调函数
                SNS.sys._JSONP_request_map['request_' + index] = function(json) {
                    if (timer) {
                        window.clearTimeout(timer);
                        timer = null;
                    }
                    //test
                    if (script && script.parentNode)script.parentNode.removeChild(script);
                    self.config.success.apply(self.config.callBackContext, arguments);
                    if (successCallBack)successCallBack.apply(self.config.callBackContext, arguments);
                }
                var parms = this.getParms(jsonParms);
                var src = this.buildUrl(this.config.url, parms + '&callback=SNS.sys._JSONP_request_map.request_' + index);

                //创建并插入<script>标签
                script = document.createElement('script');

                document.body.insertBefore(script, document.body.firstChild);
                window.setTimeout(function() {
                    script.setAttribute('type', 'text/javascript');
                    script.src = src;
                },1);
                timer = this._timeOut(script);
                return script;
            },

            /**
         * 通过iframe代理，用form形式实现跨域提交数据并运行callback函数
         * @method iframeProxy
         * @param parms {Object} 参数json对象
         * @param successCallBack {Object} 成功回调函数
         */
            iframeProxy: function(parms,successCallBack) {

                var timer = null;
                //取得当前页面domain
                var _domain = function() {
                    var _hostname = window.location.hostname.toString();
                    var _hosts = _hostname.split('.');
                    var _len = _hosts.length;
                    if (_len > 2) {
                        return _hosts[_len - 2] + '.' + _hosts[_len - 1];
                    }
                    return _hostname;
                }
                document.domain = _domain();
                var index = SNS.sys._IFRAME_PROXY_counter;
                SNS.sys._IFRAME_PROXY_counter++;
                var self = this;
                //var iframe=document.createElement("iframe");

                var iframe = document.getElementsByName('SNS.sys._IFRAME_PROXY')[0];

                if (!iframe)throw new Error(' Invalid iframe proxy');

                var form = document.createElement('form');

                //创建可直接调用的回调函数
                SNS.sys._IFRAME_PROXY_request_map['request_' + index] = function(json) {
                    if (timer) {
                        window.clearTimeout(timer);
                        timer = null;
                    }
                    self.config.success.apply(self.config.callBackContext, arguments);
                    if (successCallBack)successCallBack.apply(self.config.callBackContext, arguments);
                    if (form && form.parentNode)form.parentNode.removeChild(form);
                }

                var action = this.buildUrl(this.config.url, 'callback=SNS.sys._IFRAME_PROXY_request_map.request_' + index);


                iframe.setAttribute('src', this.config.iframeProxy);


                form.setAttribute('method', 'POST');
                form.setAttribute('action', action);
                //form的target设置为iframe
                form.setAttribute('target', 'SNS.sys._IFRAME_PROXY');

                var newParms = YAHOO.lang.merge(this.config.parms, parms || {});

                //将请求参数以隐藏域形式加入到form中
                for (var p in newParms) {
                    if (newParms[p] != null) {
                        var hide = document.createElement('input');
                        hide.setAttribute('type', 'hidden');
                        hide.setAttribute('name', p);
                        hide.setAttribute('value', newParms[p]);
                        form.appendChild(hide);
                    }
                }
                document.body.insertBefore(form, document.body.firstChild);

                //如果有iframe.YAHOO，则在iframe内提交Ajax请求
                if (iframe.YAHOO && iframe.YAHOO.util.Connect) {
                    var xhr = iframe.YAHOO.util.Connect.asyncRequest('POST', this.config.url, successCallBack, newParms);
                    return xhr;
                }

                //否则使用表单提交方式
                form.submit();
                if (form && form.parentNode)form.parentNode.removeChild(form);
                timer = this._timeOut(form);
            },

            /**
         * 请求超时，取消请求并运行回调函数
		 * @private
         * @param requestObject {Object} form表单元素
         * @param timeout       {Number} 超时时间，毫秒，默认5000
         * @param callback      {Object} 超时回调函数
         * @return {Object} setTimeout handler
         */
            _timeOut: function(requestObject,timeout,callback) {

                var time = timeout ? timeout : 5000;
                var timer = window.setTimeout(function() {
                    //SNS.sys.Helper.showMessage("已超时，请检查链接或重新输入");
                    if (requestObject && requestObject.parentNode) requestObject.parentNode.removeChild(requestObject);
                    if (callback)callback();
                },time);
                return timer;
            }

        });

        SNS.sys._IFRAME_PROXY_counter = 0;
        SNS.sys._IFRAME_PROXY_request_map = {};
        SNS.sys._JSONP_counter = 0;
        SNS.sys._JSONP_request_map = {};



        /**
     * 数据管理操作封装
     * @module DataSourceManager
	 * @namespace SNS.sys
     * @class DataSourceManager
     */
        var DataSourceManager = new Class({

            /**
         * 注册数据源
         * @param name             {String} 数据源名称标识
         * @param dataSourceConfig {Object} 数据源配置项
         * @param callBackContext {Object} 回调函数的作用域对象
         */
            registerDataSource: function(name,dataSourceConfig,callBackContext) {
                if (dataSourceConfig.url) {
                    this.dataSource = this.dataSource ? this.dataSource : {};
                    SNS.sys.Class.mixin(dataSourceConfig, {
                        callBackContext: callBackContext
                    });
                    this.dataSource[name] = new BasicDataSource(dataSourceConfig);
                }
            },

            /**
         * 根据名称标识获取数据源
         * @param name {String} 名称标识
         * @return {Object} 对应的数据源对象
         */
            getDataSource: function(name) {
                this.dataSource = this.dataSource ? this.dataSource : {};
                return this.dataSource[name];
            }
        });

        SNS.sys.BasicDataSource = BasicDataSource;
        SNS.sys.DataSourceManager = DataSourceManager;


    })();





},"SNS.util.Helper")



