/**
 * sns.js
 * @author         bofei
 * @changelog      ver 1.0 @ 2010-9-25    Initialize release
 */

SNS("SNS.util.Ajax",function(S){
    
    var K = KISSY, Helper= SNS.sys.Helper;
    var rurl = /^(\w+:)?\/\/([^\/?#]+)/;
    var PROXYNAME="crossdomain.htm",PROXYID="J_Crossdomain";

    var iframeProxys={};//��Ŵ���iframe����ֹ�ٴ�����
    var requestState={};//��¼���󲢲�״̬����ֹ�������

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
     * <li>��ͬ��������Connectֱ�ӵ���YAHOO.util.YAHOO.util.Connect������Դ;</li>
     * <li>������������Connect ����ͨһ��id Ϊ��J_StaticIframeProxy����iframe��ȡ�������Ŀ¼�µĴ����ļ�
     * static_iframe_proxy.html������domain���һ�£�����iframe�е�YAHOO.util.YAHOO.util.Connect
     * ��������<li>
     * <li>����������������ϵ����ʹ��jsonp��������</li>
     * </ul>
     * @name Ajax
     * @memberOf SNS
     * @class Connect���YAHOO.util.YAHOO.util.Connect�����˷�װ���������˿������������
     * @param url {String} Ҫ������Դ��url��ַ
     * @param c {Object} ������Ϣ
     *  <ul>
     *     <li>method: ��string�����󷽷�:"GET"��"POST",��ʹ��JSONPʱֻ��ʹ�á�GET������</li>
     *     <li>use: {string}��������ķ�ʽ��Connect֧�����֣��ֱ���ԭ����XHR��xhr��,ͨ��iframe����(iframe),��JSONP(jsonp)</li>
     *     <li>success:{function}����ɹ�ʱ�Ļص�����</li>
     *     <li>failure:{function} ����ʧ��ʱ�Ļص�������ע��jsonp����������ص�</li>
     *     <li>data:{string}���͵�����</li>
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
         * �Զ��жϿ��򣬷�������
         *
         * @function
         * @param url {String} Ҫ������Դ��url��ַ
         * @param c {Object} ������Ϣ
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
         * ���ݿ��������ѡ������ʽ
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
                // ��iframe������ɺ�������
                //�ο���http://www.planabc.net/2009/09/22/iframe_onload/
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
                //��ȡ������Դ��iframe�����ļ�
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
        //��������
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


    //�ṩһЩ���ķ��������ڵ���
    /**
     * �Զ��жϿ��򣬷�������
     * @name request
     * @memberOf SNS#
     * @function
     */
    S.request=function(url,config){
       
        return new Ajax(url,config).send();
    };

    /**
     * ʹ��jsonp�ķ�ʽ������Դ
     * @name jsonp
     * @memberOf SNS#
     * @function
     */
    
    S.jsonp=function(url,config){
        config.use="jsonp"
        return new Ajax(url,config).send();
    };

    /*�ϲ�����database*/







    /**
 * �����������ݷ�װ
 * @requires  SNS ,SNS.sys.Class ,YAHOO.util.Container,YAHOO.lang.JSON;
 * @author zhangquan
 * @date 2009-08-22
 */
    /**
 * Class ʵ��
 * ʹ���������ʵ�ּ̳к���չ
 * requires SNS
 * @author zhangquan
 * @date   2009-08-17
 */


    (function(){
  

        /**
     * Class�Ĺ�����
     * @param {Object} ����������������Լ���
     * @return {Function} ����Ĺ�����
     */
        function Class(parms){
            //��������Ƿ������ͣ��Ѵ˷�������������
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
 
        //����
        Class.mixin=function(original, extended){
            if(original){
                for (var key in (extended || {})) if(extended[key]!=null)original[key] = extended[key];

                return original;
            }
        };
        //���뷽��
        Class.mixinFun=function(original, extended,sope){

            var newFun=function(arguments){
                original(arguments);
                extended(arguments);
            }

            return function(){
                newFun.apply(sope,arguments);
            }


        };

        //����
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
	 *��������
	 *@method Class.implement
	 *@origin {Object} Դʼ����
	 *@parms {Object} ��Ҫʵ�ֵ�����
	 */
        Class._build=function(origin,key, value){
            //ʵ�ּ̳к���չ
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
		* ���̳�
		* @super ��Function������
		*/
            extend:function(parent){

                //�̳�ԭ��
                this.parent=parent;
                var F=function(){};
                F.prototype=parent.prototype;
                this.prototype=new F();

                //���ø���Ĺ�������ֻ֧���ڹ��캯����ֱ�ӵ���


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
		* ������չ
		* ��֧��instanceof����
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
        //Ϊ���ɵ�����س��ù��߷���



        };










        /**
     * ���ݹ������������
 	 * @module BasicDataSource
	 * @namespace SNS.sys
	 * @class BasicDataSource
     */
        var BasicDataSource = new Class({
            /**
         * ������
         * @method initialize
         * @param dataSourceConfig {Object} dataSource������
         */
            initialize: function(dataSourceConfig) {
                this.config = {
                    url: null, //����url
                    parms: {}, //����json����
                    success: function() {}, //����ɹ��ص�����
                    failure: function() {}, //����ʧ�ܻص�����
                    callBackContext: this, //�ص�����ִ��������Ĭ��Ϊthis
                    iframeProxy: SNS.sys.Helper.getApiURI('http://comment.jianghu.{serverHost}/proxy.htm') //iframe�����ַ
                };
                Class.mixin(this.config, dataSourceConfig);

            },

            /**
         * �õ���������ַ���
         * @method getParms
         * @param jsonParms {Object} ��������
         * @return {String} ��&���ӵ���������ַ���
         */
            getParms: function(jsonParms) {
                var config = this.config.parms;
                Class.mixin(config, jsonParms);
                Class.mixin(config, {
                    ran: Math.random()
                });
                var parms = '';
                //����params����װ�ַ���
                for (var p in config) {
                    if (config[p] != null)parms += p + '=' + encodeURIComponent(config[p]) + '&';
                }
                if (parms.length > 0)parms = parms.substring(0, parms.length - 1);
                return parms;
            },

            /**
         * ��url������ϲ�������url
         * @param url   {String} ����url
         * @param parms {String} �������
         * @return {String} ������������url
         */
            buildUrl: function(url,parms) {
                url += url.indexOf('?') > 0 ? '&' : '?';
                return url + parms;

            },

            /**
         * POST��ʽ����ͨAjax����ʹ��json��ʽ��ȡ����
         * @method json
         * @param requestJsonData {Object} �������
         * @param successCallBack {function} ����ɹ��ص�����
         * @param failureCallBack {function} ����ʧ�ܻص�����
         * @return {Object} xhr����
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
                        //�ڵ�ǰ��������ִ�лص�����
                        self.config.success.call(this.callBackContext, data);
                        if (successCallBack)successCallBack.call(this.callBackContext, data);
                    },

                    failure: function(xhr) {
                        self.config.failure.call(this, xhr);
                        if (failureCallBack)failureCallBack.call(this.callBackContext, xhr);
                    }

                };

                var parms = this.getParms(requestJsonData);
                //��ʼ��ͷ��Ϣ��ʹ��json��ʽ��ȡ����
                YAHOO.util.Connect.initHeader('Accept', 'application/json');
                YAHOO.util.Connect.initHeader('X-Request', 'JSON');

                var xhr = YAHOO.util.Connect.asyncRequest('POST', this.config.url, callback, parms);
                return xhr;

            },

            /**
         * jsonp��ʽ��Ajax����
         * @method jsonp
         * @param jsonParms       {Object} �������
         * @param successCallBack {function} ����ɹ��ص�����
         * @return {HTMLElement} jsonp������script��ǩԪ��
         */
            jsonp: function(jsonParms,successCallBack) {
                var script = null;
                var timer = null;
                var index = SNS.sys._JSONP_counter;
                SNS.sys._JSONP_counter++;
                var self = this;
                //������ֱ�ӵ��õĻص�����
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

                //����������<script>��ǩ
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
         * ͨ��iframe������form��ʽʵ�ֿ����ύ���ݲ�����callback����
         * @method iframeProxy
         * @param parms {Object} ����json����
         * @param successCallBack {Object} �ɹ��ص�����
         */
            iframeProxy: function(parms,successCallBack) {

                var timer = null;
                //ȡ�õ�ǰҳ��domain
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

                //������ֱ�ӵ��õĻص�����
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
                //form��target����Ϊiframe
                form.setAttribute('target', 'SNS.sys._IFRAME_PROXY');

                var newParms = YAHOO.lang.merge(this.config.parms, parms || {});

                //�������������������ʽ���뵽form��
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

                //�����iframe.YAHOO������iframe���ύAjax����
                if (iframe.YAHOO && iframe.YAHOO.util.Connect) {
                    var xhr = iframe.YAHOO.util.Connect.asyncRequest('POST', this.config.url, successCallBack, newParms);
                    return xhr;
                }

                //����ʹ�ñ��ύ��ʽ
                form.submit();
                if (form && form.parentNode)form.parentNode.removeChild(form);
                timer = this._timeOut(form);
            },

            /**
         * ����ʱ��ȡ���������лص�����
		 * @private
         * @param requestObject {Object} form��Ԫ��
         * @param timeout       {Number} ��ʱʱ�䣬���룬Ĭ��5000
         * @param callback      {Object} ��ʱ�ص�����
         * @return {Object} setTimeout handler
         */
            _timeOut: function(requestObject,timeout,callback) {

                var time = timeout ? timeout : 5000;
                var timer = window.setTimeout(function() {
                    //SNS.sys.Helper.showMessage("�ѳ�ʱ���������ӻ���������");
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
     * ���ݹ��������װ
     * @module DataSourceManager
	 * @namespace SNS.sys
     * @class DataSourceManager
     */
        var DataSourceManager = new Class({

            /**
         * ע������Դ
         * @param name             {String} ����Դ���Ʊ�ʶ
         * @param dataSourceConfig {Object} ����Դ������
         * @param callBackContext {Object} �ص����������������
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
         * �������Ʊ�ʶ��ȡ����Դ
         * @param name {String} ���Ʊ�ʶ
         * @return {Object} ��Ӧ������Դ����
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



