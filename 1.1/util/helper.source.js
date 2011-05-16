/**
 * 辅助方法库<br>
 * <font color=red>目前 Helper 里边方法已经加载太多了， 更多的可能基本上不怎么用到， 如果是某些 widget 比较常用的，建议移出到相应的 widget中 ，暂时将 Helper 分成几大类：APP_H、FIX_H、FIX_H、FORM_H、OTHER_H、URI_H。 by shiran 2010.09.26</font>
 * @module Helper 
 * @namespace SNS.sys
 * @class Helper
 * @author chonghou<chonghou@taobao.com>, shiran<shiran@taobao.com>, bofei<bofei.zq@taobao.com>
 */

SNS('SNS.util.Helper', function(S) {
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
    doc = document,

    Helper,

    //功能函数对象，默认赋值，防止一些函数被删除后，L.merge 报错
    APP_H = {},
    FIX_H = {},
    FORM_H = {},
    OTHER_H = {},
    URI_H = {},

    /**
		 * 辅助工具库的配置参数
		 */
    config = {
        apiToken: 'comment:/json/token.htm'
    },

    /**
		 * 注册的 API 服务器地址，格式为 服务器名称 : 地址，例如：
		 * portal : "http://wang.alisoft.com/space"
		 * @property apiServers
		 * @default <pre>{
						portal: 'http://jianghu.{serverHost}',
						assets: 'http://assets.{cdnHost}/app/sns',
						assetsV: 'http://assets.{cdnHost}/apps',
						app: 'http://app.jianghu.{serverHost}',
						comment: 'http://comment.jianghu.{serverHost}',
						poke: 'http://poke.jianghu.{serverHost}',
						share: 'http://share.jianghu.{serverHost}',
						blog: 'http://blog.jianghu.{serverHost}',
						fx: 'http://fx.{serverHost}',
						checkCode: 'http://comment.jianghu.{serverHost}/json/get_comment_check_code.htm',
						feedCheckCode: 'http://jianghu.{serverHost}/json/get_feed_comment_check_code.htm'
					}</pre>
		 */
    apiServers = {
        portal: 'http://jianghu.{serverHost}',
        assets: 'http://assets.{cdnHost}/app/sns',
        assetsV: 'http://assets.{cdnHost}/apps',
        app: 'http://app.jianghu.{serverHost}',
        comment: 'http://comment.jianghu.{serverHost}',
        poke: 'http://poke.jianghu.{serverHost}',
        share: 'http://share.jianghu.{serverHost}',
        blog: 'http://blog.jianghu.{serverHost}',
        fx: 'http://fx.{serverHost}',
        checkCode: 'http://comment.jianghu.{serverHost}/json/get_comment_check_code.htm',
        feedCheckCode: 'http://jianghu.{serverHost}/json/get_feed_comment_check_code.htm'
    };


    function pickDocumentDomain(depth, host) {
        host = host || location.hostname;
        depth = depth || 2;
        var parts = host.split('.'), ret = [];
        while (parts.length > 0 && depth > 0) {
            ret.unshift(parts.pop());
            depth--;
        }

        return ret.join('.');
    }

    function setToken(token) {
        var tokenStr = token || '',
        tokenArr = tokenStr.split('='),
        tokenDiv = D.get('Jianghu_tb_token'),
        input;

        if (!tokenDiv) {
            tokenDiv = doc.createElement('div');
            tokenDiv.id = 'Jianghu_tb_token';
            tokenDiv.innerHTML = '<input type="hidden" />';
            doc.body.appendChild(tokenDiv);
        }
        if (tokenStr && tokenArr.length === 2) {
            input = D.getFirstChild(tokenDiv);
            input.name = tokenArr[0];
            input.value = tokenArr[1];
        }

    }

    // 自动判断当前域名的 host
    var hostname = location.hostname,
    serverHost = 'taobao.com',
    cdnHost = 'taobaocdn.com';

    if (pickDocumentDomain(2) !== 'taobao.com') {
        serverHost = cdnHost = 'daily.taobao.net';
    }

    for (var p in apiServers) {
        if (typeof apiServers[p] === 'string') {
            apiServers[p] = KISSY.substitute(apiServers[p], {
                serverHost: serverHost,
                cdnHost: cdnHost
            });
        }
    }

    apiServers.serverHost = serverHost;
    apiServers.cdnHost = cdnHost;

    //跟业务紧密相关的函数
    APP_H = {
        /**
		 * 检查是否达人
		 * @return {Boolean} true 表示是达人页面.
		 */
        checkDaren: function() {
            return Boolean(D.get('J_darenStyle'));
        },

        /**
         * 检查用户是否登录
		 * @method checkLogin
         * @return {Boolean} true 表示用户已经登录.
         */
        checkLogin: function() {
            var getCookie = function(name) {
                var m = doc.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
                if(m && m[1]) {
                    if(m[1].indexOf('&') != -1) {
                        var vs = m[1].split('&'),
                        len = vs.length,
                        i = 0,
                        obj = {};

                        for(; i < len; i++) {

                            var v = vs[i],
                            idx = v.indexOf('='),
                            key = v.slice(0, idx),
                            value = v.slice(idx + 1);

                            obj[key] = value;
                        }

                        return obj;

                    } else {
                        return decodeURIComponent(m[1]);
                    }

                } else {
                    return '';
                }
            //return (m && m[1]) ? decodeURIComponent(m[1]) : '';
            };

            //对本地做判断
            if (location.href.indexOf('taobao') == -1) {
                return true;
            }

            // 用户昵称，Session内有效
            var nick = getCookie('_nk_');

            // 用户是否已经登录。注意：必须同时判断nick值，因为 _nk_ 和 _l_g_ 有时不同步
            // _l_g 修改为 cookie15，暂时兼容一周 by 释然 2010.11.19
            var isLogin = ((getCookie('_l_g_') || getCookie('uc1')['cookie15']) && nick) || getCookie('ck1')/*长登录*/;

            return !!isLogin;
			
        },

        /**
         * 检查登录状态，如果没有登录则显示登录框
		 * @method checkAndShowLogin
         * @param cfg {Object} 参数.
         * @param cfg.autoCallback {Boolean} 是否在登录完成后自动进行回调.
         * @return {Boolean} true 表示用户已经登录.
         */
        checkAndShowLogin: function(cfg) {
            var that = this;
            if (that.checkLogin()) {
                return true;
            }

            cfg = cfg || {};

            var callback = null;

            //执行回调函数 by shiran 100401
            if (cfg.callback) {
                callback = cfg.callback;
            } else if (cfg.autoCallback && arguments.callee.caller) {
                try {
                    var caller = arguments.callee.caller,
                    args = caller.arguments || [],
                    scope = cfg.callbackScope || {},
                    newArgs = [],
                    obj;

                    for (var i = 0; i < args.length; ++i) {
                        obj = args[i];
                        if (L.isObject(obj) && obj.srcElement) {
                            obj = L.merge({}, obj);
                        }
                        newArgs.push(obj);
                    }

                    callback = caller ? function() {
                        try {
                            caller && caller.apply(scope, newArgs);
                        } catch (e) {
                        //alert(e.message);
                        }
                    } : null;
                } catch (e) {
                    callback = null;
                }
            }
              
            // 页面载入了 UserCheck 时使用 Ajax 进行用户登录，否则直接跳转到登录页
            if (window.UserCheck && window.UserCheck.init) {
                window.UserCheck.init({
                    width: 354,
                    height: 285,
                    isLogin: true,
                    extraWrapperClass: '',
                    callback: function() {
                        callback && callback();
                        that.getToken();
                    }
                });
            } else {
                location.href = that.buildURI(that.getApiURI('portal:/admin/login.htm'),
                    'redirect_url=' + encodeURIComponent(location.href));
            }

            return false;
        },

        /**
		 * 获取验证码并执行回调
		 * @method getCheckCodeURI
		 * @param successCallback { Function } 回调函数.
		 * @param params { Object } 参数，json 形式.
		 * @param serverType { String } server 类型，默认为 checkCode.
		 * @return { Object } SNS.
		 * @TODO 统一验证码接口 2010.12.31
		 */
        getCheckCodeURI: function(successCallback, params, serverType) {
            var that = this,
            ds = new SNS.sys.BasicDataSource({
                url: that.getServerURI(serverType || 'checkCode')
            });
            ds.jsonp(params, successCallback);
            return S;
        },

        /**
         * 获取token
		 * @method getToken
		 * @return { Object } SNS.
	     */
        getToken: function() {
            var that = this;

            Get.script(that.buildURI(that.getApiURI(config.apiToken), 'callback=SNS.sys.Helper.setToken'), {
                charset: 'gbk'
            });

            return S;

        },

        /**
		 * 设置token
		 * @method setToken
		 * @param token { String } token 值.
		 * @param callback { Function } 回调函数.
		 * @return { Object } SNS.
		 */
        setToken: function(token,callback) {
            token && setToken(token);
            callback && callback();
            return S;
        }
    };


    //浏览器 bug 或者其它不支持的功能的处理
    FIX_H = {
        /**
         * 添加 TextArea 的最大长度的支持，使用 TextArea 和 maxlength 属性进行控制
         * @method addMaxLenSupport
         * @param elText {HTMLElement} TextArea 元素对象或元素 ID.
		 * @param max { Number } 最大长度，可选，如果没有，则取 textarea 的 maxlength 属性.
		 * @param className { String } 需要委派事件的元素 class.
		 * @param fn { Function } 委派事件.
		 * @return { Object } SNS.
         */
        addMaxLenSupport: function(elContl,max,className,fn) {

            var callback = function() {};
            /**
             * 获取最大长度属性
             * @param   {HTMLElement}   elText  TextArea 元素.
             */
            var getMaxLength = function(elText) {
                return max || parseInt(elText.getAttribute('maxlength') || '0', 10);
            };

            /**
             * 超出长度时，截断字符串
             */
            var cutStr = function(e) {

                var elText = E.getTarget(e),
                value = elText.value,
                maxLen = getMaxLength(elText);

                if (maxLen > 0 && value.length > maxLen) {
                    elText.value = value.substr(0, maxLen);
                }

            };

            // 粘贴事件处理程序
            var onPaste = function(e) {

                var elText = E.getTarget(e), maxLength = getMaxLength(elText);

                if (elText.value.length === maxLength) {
                    E.preventDefault(e);

                }

            };

            var onKeyDown = function(e) {

                var elText = E.getTarget(e), charCode = E.getCharCode(e),
                maxLength = getMaxLength(elText);

                // maxLength 小于 1 以及按下 Backspace 和 Delete 的时候不处理
                // 按键带有修饰符时不处理
                if (maxLength < 1 || charCode === 8 || charCode === 46 ||
                    e.ctrlKey || e.altKey) {
                    return;
                }

                var content = elText.value;
                if (content.length >= maxLength) {
                    E.preventDefault(e);

                }


            };

            function delegate(className,fn,callback) {
                return function(ev) {

                    var target = E.getTarget(ev);
                    if (D.hasClass(target, className)) {

                        fn(ev);
                        if (callback) callback(target);

                    }
                }

            }


            if (className) {
                if (!elContl) {
                    elContl = doc.body;
                }

                var donKeyDown = delegate(className, onKeyDown, fn);
                var dcutStr = delegate(className, cutStr, fn);
                var donPaste = delegate(className, onPaste, fn);
                E.on(elContl, 'keydown', donKeyDown);
                E.on(elContl, 'keyup', dcutStr);
                E.on(elContl, 'change', dcutStr);
                E.on(elContl, 'blur', dcutStr);
                E.on(elContl, 'paste', donPaste);

            }else {
                E.on(elContl, 'keydown', onKeyDown);
                E.on(elContl, 'keyup', cutStr);
                E.on(elContl, 'change', cutStr);
                E.on(elContl, 'blur', cutStr);
                E.on(elContl, 'paste', onPaste);
            }

            return S;

        },

        /**
         * 触发 IE 的 Reflow (ie6/7)
		 * @method deReflow
         * @param elContl {HTMLElelent} 要触发 Reflow 的元素，默认为 body.
		 * @return { Object } SNS.
         */
        doReflow: function(elContl) {
            if (UA.ie > 0 && UA.ie < 8) {
                elContl = elContl || doc.body;
                var noExistsClass = 'fix-ie-layout-problem-hack';
                D.addClass(elContl, noExistsClass);
                D.removeClass(elContl, noExistsClass);
            }

            return S;
        },


        /**
         * 修正 IE6 下文本框失去焦点后再次插入文本会丢失光标位置的 bug
         * @method fixCursorPosition
         * @param elText {HTMLElement} 要 fix 的文本框元素.
		 * @return { Object } SNS.
         */
        fixCursorPosition: function(elText) {
            if (UA.ie) {
                function getCursorPosition(elText) {

                    var start,
                    end,
                    range = doc.selection.createRange(),
                    range_all;

                    if (range.parentElement().id == elText.id) {
                        // create a selection of the whole textarea
                        range_all = doc.body.createTextRange();
                        range_all.moveToElementText(elText);
                        //两个range，一个是已经选择的text(range)，一个是整个textarea(range_all)
                        //range_all.compareEndPoints()比较两个端点，如果range_all比range更往左(further to the left)，则 //返回小于0的值，则range_all往右移一点，直到两个range的start相同。
                        // calculate selection start point by moving beginning of range_all to beginning of range
                        for (start = 0; range_all.compareEndPoints('StartToStart', range) < 0; start++) {
                            range_all.moveStart('character', 1);
                        }
                        // get number of line breaks from textarea start to selection start and add them to start
                        // 计算一下\n
                        //console.log("start \\n count " + (elText.value.substr(0, start+1).match(/\n/g) || []).length);
                        //start += (elText.value.substr(0, start+1).match(/\n/g) || []).length;
                        //for (var i = 0; i <= start; i++) {
                        //    if (textBox.value.charAt(i) == '\n') start++;
                        //}
                        // create a selection of the whole textarea
                        range_all = doc.body.createTextRange();
                        range_all.moveToElementText(elText);
                        // calculate selection end point by moving beginning of range_all to end of range
                        for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++) {
                            range_all.moveStart('character', 1);
                        }
                    // get number of line breaks from textarea start to selection end and add them to end
                    //console.log("end \\n count " + (elText.value.substr(0, end+1).match(/\n/g) || []).length);
                    //end += (elText.value.substr(0, end+1).match(/\n/g) || []).length;
                    //for (var i = 0; i <= end; i++) {
                    //    if (textBox.value.charAt(i) == '\n') end++;
                    //}
                    }

                    return [start, end];
                }

                elText = D.get(elText);

                if (!elText.getAttribute('data-cursorfixed')) {
                    elText.setAttribute('data-cursorfixed', 'true');
                    var posInfo = null;
                    E.on(elText, 'beforedeactivate', function() {
                        posInfo = getCursorPosition(elText);
                        elText.setAttribute('data-lastcursor', posInfo.join(','));
                    });
                }
            }

            return S;
        },


        /**
         * 修复 IE6 下非 A 标签不支持 :hover 的 bug
		 * @method fixHover
         * @param deConfig {Object} 参数.
         * @param deConfig.elements {Array} 要修正的元素列表，与 container 可以二选一.
         * @param deConfig.container {String} 要修正的容器，与 elements 可以二选一.
         * @param deConfig.tagName {String} 要修正元素的标签，在使用 container 时使用.
         * @param deConfig.itemClass {String} 要修正元素的拥有的样式，在使用 container 时使用.
         * @param deConfig.hoverClass {String} hover 时添加到元素的样式名称.
         * @param deConfig.checkPopuped {Boolean} 检查元素是否拥有 popuped=true 属性，如果有则 onMouseLeave 时不去除 hoverClass.
         * @example
		 * <pre>
         * {
         *  elements : "",      // 元素列表
         *  container : "",		// 容器
         *  tagName : "",		// 要加 hover 的元素标签
         *  hoverClass : "",	// hover 的class
         *  itemClass : ""		// 再次过滤元素，如果 tagName 的元素不具备此 class，则也不加 hover
         *  checkPopuped : true // 检查 popuped 属性，如果有 popuped 属性，则不执行 mouseleave
         * }
		 * </pre>
		 * @default { hoverClass: 'hover', checkPopuped: false }
		 * @return { Object } SNS.
         */
        fixHover: function(deConfig) {
            if (6 === UA.ie && deConfig) {
                var config = L.merge({
                    hoverClass: 'hover',
                    checkPopuped: false
                }, deConfig),
                container = config.container,
                tagName = config.tagName,
                hoverClass = config.hoverClass,
                itemClass = config.itemClass,
                items = config.elements,
                checkPopuped = config.checkPopuped,
                onMouseEnterCallback = config.onMouseEnter,
                onMouseLeaveCallback = config.onMouseLeave;

                if (!items && L.isString(container) && tagName) {
                    container = D.get(container);
                    items = container.getElementsByTagName(tagName);
                } else if (!items) {
                    items = [];
                }

                var onMouseEnter = function(e) {
                    D.addClass(E.getTarget(e), hoverClass);
                    onMouseEnterCallback && onMouseEnterCallback(e);
                };

                var onMouseLeave = function(e) {
                    if (checkPopuped && E.getTarget(e).getAttribute('popuped')) {
                        return;
                    }
                    D.removeClass(E.getTarget(e), hoverClass);
                    onMouseLeaveCallback && onMouseLeaveCallback(e);
                };

                D.batch(items, function(el) {
                    if (itemClass && !D.hasClass(el, itemClass)) {
                        return;
                    }

                    E.on(el, 'mouseenter', onMouseEnter);
                    E.on(el, 'mouseleave', onMouseLeave);
                });
            }

            return S;
        },


        /**
         * 修复 IE6 & IE7 下 TextArea 无法获取焦点的 bug
         * @fixTextAreaFocus
         * @param elText {HTMLElement} 要修正焦点 bug 的 TextArea 元素.
		 * @return { Object } SNS.
         */
        fixTextAreaFocus: function(elContl) {
            var that = this;
            if (UA.ie > 0 && UA.ie < 8) {
                function fixFocus(e) {
                    var elText = E.getTarget(e);
                    E.removeListener(elText, 'click', arguments.callee);

                    setTimeout(function() {
                        var range_all = document.body.createTextRange();
                        range_all.moveToElementText(elText);
                        range_all.select();
                        elText.focus();
                        elText.select();
                        that.recoverCursorPos(elText);
                    }, 0);
                }

                E.on(elContl, 'click', fixFocus);
            }

            return S;
        }



    };

    //表单部分的一些功能函数
    FORM_H = {
        /**
         * 插件文本到 textarea 的当然光标位置
		 * @method insertText
         * @param elText {HTMLElement} TextArea 元素.
         * @param text {String} 要插入的文本.
		 * @return { Object } SNS.
         */
        insertText: function(elText, text) {
            elText = D.get(elText);

            var curVal = elText.value;

            elText.focus();

            if (typeof document.selection !== 'undefined') {
                var range = document.selection.createRange();
                range.text = text;
                range.setEndPoint('StartToEnd', range);
                range.select();
            //range.setEndPoint("StartToEnd", range);
            } else {
                var selStart = elText.selectionStart,
                selEnd = elText.selectionEnd;

                elText.value = curVal.substr(0, selStart) + text + curVal.substr(selStart);
                elText.selectionStart = selStart + text.length;
                elText.selectionEnd = elText.selectionStart;
                elText.setSelectionRange &&
                elText.setSelectionRange(elText.selectionEnd, elText.selectionEnd);
            }

            

            D.setAttribute(elText, 'data-lastcursor', '');

            return S;
        },

        /**
         * 恢复失去焦点前保存的光标位置
         * @method recoverCursorPos
         * @param   {HTMLElement}   elText      文本框元素.
		 * @return { Object } SNS.
         */
        recoverCursorPos: function(elText) {
            if (UA.ie) {
                var posInfo = elText.getAttribute('data-lastcursor');
                if (!posInfo) {
                    return;
                }

                if (elText.value === '') {
                    posInfo = '0,0';
                }

                posInfo = posInfo.split(',');

                elText.focus();

                var range = document.selection.createRange(),
                range_all;

                if (range.parentElement().id == elText.id) {
                    range_all = document.body.createTextRange();
                    range_all.moveToElementText(elText);
                    range.setEndPoint('StartToStart', range_all);
                    range.setEndPoint('EndToStart', range);
                    range.moveStart('character', posInfo[0] * 1);

                    // moveEnd 时使用偏移，因为 moveStart 会影响 end 位置
                    range.moveEnd('character', posInfo[1] * 1 - posInfo[0] * 1);
                    range.select();
                }
            }

            return S;
        }

    };

    //URI 处理的相关函数
    URI_H = {
        /**
         * 给 URL 添加时间戳
		 * @method addStamp
         * @param url {String} 要添加时间戳的 URL.
         * @return {String} 添加了时间戳的 URL.
         */
        addStamp: function(url) {
            return this.buildURI(url, 't=' + new Date().getTime());
        },

        /**
         * 拼接 URI，自动判断第一部分是否有 ?，如果有则以 & 连接，
         * 否则以 & 连接第一部分和第二部分，其他部分均以 & 连接
		 * @method buildURI
         * @param uriPart {String} 要拼接的 URI 片段.
         * @return {String} 拼接的 URI.
         */
        buildURI: function() {
            var args = Array.prototype.slice.call(arguments);
            if (args.length < 2) {
                return args[0] || '';
            }

            var uri = args.shift();
            uri += uri.indexOf('?') > 0 ? '&' : '?';

            return uri + args.join('&').replace(/&+/g, '&');
        },

        /**
         * 获取 API 的 URI
		 * @method getApiURI
         * @param api {String} API 地址.
         * @param noCache {Boolean} 是否使用缓存，默认为 true.
         * @param ignoreToken {Boolean} 是否不加 Token.
         * @return {String} 获取到的实际 API 地址.
         */
        getApiURI: function(api, noCache, ignoreToken) {
            var that = this;

            if (!(api.substr(0, 7) === 'http://' || api.substr(0, 8) === 'https://') &&
                api.indexOf(':') > 0) {

                var semPos = api.indexOf(':');
                var apiServer = apiServers[api.substr(0, api.indexOf(':'))] || '';
                if (apiServer !== '') {
                    api = (apiServer + api.substr(semPos + 1)).replace(/assets\.taobaocdn\.com/, 'a.tbcdn.cn');
                }
            }

            if (typeof noCache == 'undefined' ? true : noCache) {
                api = that.addStamp(api);
            }

            if (!ignoreToken) {
                var elToken = D.get('Jianghu_tb_token');
                if (elToken) {
                    var tokens = elToken.getElementsByTagName('INPUT');
                    for (var i = 0; i < tokens.length; i++) {
                        if(tokens[i].value) api = that.buildURI(api, [tokens[i].name, encodeURIComponent(tokens[i].value)].join('='));
                    }
                }
            }
            var newApi = KISSY.substitute(api, {
                serverHost: serverHost,
                cdnHost: cdnHost
            });
            return newApi;
        },

        /**
         * 拼接出 assets 资源的 URI
		 * @method getAssetsURI
         * @param path {String} 相对路径.
         * @param useCache {Boolean} 使用缓存，默认是不使用缓存.
         * @return {String} 拼接得到的 assets 资源 URI.
         */
        getAssetsURI: function(path, noCache, isVertical) {
            return this.getApiURI((isVertical ? 'assetsV:' : 'assets:') + path, noCache, true);
        },

        /**
		 * 获取服务器 URI
		 * @method getServerURI
		 * @param serverName { String } 应用名.
		 * @return { String } 相应的应用地址.
		 */
        getServerURI: function(serverName) {
            return apiServers[serverName];
        },

        /**
         * 注册 API 的服务器
		 * @method regApiServer
         * @param config {Object} API 服务器的配置，以 协议:地址 对的形式出现，例如 { portal : "http://jianghu.taobao.com }.
         * @param overwrite {Boolean} 覆盖已有的 API 服务器配置.
		 * @return SNS.
         */
        regApiServer: function(config, overwrite) {
            L.augmentObject(apiServers, config, !!overwrite);
            return S;
        }

    };

    //其它函数
    OTHER_H = {
        /**
         * 添加模块支持，会注入模块的初始化方法 init 到 app 对象的 init 方法中，<font color=red>请停止使用此方法</font>
         * @method addModuleSupport
         * @param app {Object} app 对象.
         * @return {Object} 子模块容器对象.
         */
        addModuleSupport: (function() {

            /**
             * 模块容器
             * @private
             * @name        ModulesContainer
             * @memberOf    SNS.sys.Helper.addModuleSupport
             */
            var ModulesContainer = function() {
                this._names = [];
                this._stroe = {};
            };

            /** @scope SNS.sys.Helper.addModuleSupport.ModulesContainer */
            L.augmentObject(ModulesContainer.prototype, {
                /**
                 * 已添加模块名称列表
                 * @private
                 */
                _names: [],

                /**
                 * 与模块名称对应的模块对象
                 * @private
                 */
                _store: {},

                /**
                 * 添加一个模块
             	 * @private
                 * @param  {String}  name  模块名称.
                 * @param  {Object}  obj   模块对象.
                 */
                add: function(name, obj) {
                    if (name && obj) {
                        this[name] = obj;
                        this._names.push(name);
                        this._store[name] = obj;
                    }
                },

                /**
                 * 获取一个模块
             	 * @private
                 * @param   {String}    name    模块名称.
                 * @return  {Object}            模块对象，如果没有找到则为 null.
                 */
                get: function(name) {
                    return this._store[name] || null;
                },

                /**
                 * 初始化所有模块
                 * @private
                 */
                initAll: function(config) {
                    var names = this._names,
                    store = this._store,
                    name,
                    modConfig;

                    for (var i = 0; i < names.length; ++i) {
                        name = names[i];
                        if (store[name] && store[name].init) {
                            modConfig = config[name] ||
                            config[name.substr(0, 1).toLowerCase() + name.substr(1)] ||
                            config[name.toLowerCase()] || null;
                            modConfig && store[name].init(modConfig, config);
                        }
                    }
                }
            });


            /**
             * 向 app 的 init 方法注入子模块功能初始化方法
             * @inner
             * @memberOf    SNS.sys.Helper.addModulesSupport
             * @param   {Object}    context1    app 对象.
             * @param   {Function}  init        app 对象的 init 方法.
             * @param   {Object}    contenxt2   子模块对象.
             * @param   {Function}  append      子模块的初始化方法 initAll.
             * @return  {Function}              生成的新的 init 方法.
             */
            var injectNewConstructor = function(context1, init, context2, append) {
                return function() {
                    if (init.apply(context1, arguments) !== false) {
                        append.apply(context2, arguments);
                    }
                };
            };

            return function(app) {
                var modules = new ModulesContainer();
                app.Modules = modules;

                if (app.init) {
                    app.init = injectNewConstructor(app, app.init, modules, modules.initAll);
                }

                return modules;
            };
        })(),


        /**
         * 创建一个全局的回调函数, <font color=red>建议停止使用此方法！！</font>
         * @method createCallback
         * @param callback {Function} 回调函数.
         * @return {String} 指向回调函数的全局函数名.
         */
        createCallback: (function() {
            var uniqueId = new Date().getTime();

            return function(callback) {
                var callbackId = 'json' + uniqueId++;
                window[callbackId] = callback;

                return callbackId;
            };
        })(),

        /**
         * 截断字符
		 * @method cutStr
         * @param str {String} 要截断的字符串.
         * @param len {Number} 要截断的长度.
		 * @param useEllipsis { Boolean } 是否在末尾添加三个点，默认为 true.
         * @return {String} 截断后的字符串.
         */
        cutStr: function(str, len, useEllipsis) {
            if (len && len > 0) {
                var copyStr = str.replace(/[^\x00-\xFF]/g, '\xFF\xFF');
                if (copyStr.length > len) {
                    str = str.substr(0, len - (copyStr.substr(0, len).match(/[\xFF]/g) || []).length / 2);
                    if (useEllipsis || typeof useEllipsis === 'undefined') {
                        str += '...';
                    }
                }
            }

            return str;
        },

        /**
		 * 获取元素的以 "data-" 开头的自定义属性
		 * @method getParmsByAttr
		 * @params target { HTMLelement }
		 * @return { Object } 返回属性组成的 json 格式，如 <li data-id="1" data-name="jolin"></li>，返回 { id: 1, name: 'jolin' }.
		 */
        getParmsByAttr: function(target) {
            var params = {},
            name,
            value,
            len,
            property;
            for (var i = 0, len = target.attributes.length; i < len; i++) {
                property = target.attributes[i];
                name = property.nodeName;
                value = property.nodeValue;
                if (name.substring(0, 5) == 'data-') {
                    params[name.substring(5)] = value;
                }
            }
            return params;
        },

        /**
         * 旺旺点灯
		 * @method lightww
         * @param container { String|HTMLElement } 要点灯的区域，默认 document.
		 * @return { Object } SNS.
         */
        lightww: function(cfg) {
            var that = this,
            container;

            if (cfg && cfg.container) {
                container = cfg.container;
            } else {
                container = D.get(cfg);
            }

            if (container) {
                if (L.isArray(container)) {
                    D.batch(container, function(el) {
                        arguments.callee.call(that, {
                            container: el
                        });
                    });
                } else {
                    if (typeof Light != 'undefined' && Light) {
                        try {
                            Light.light(container);
                        } catch (e) {}
                    }
                }
            }

            return S;

        },

       


        /**
         * 获取 hostname
         * @method pickDocumentDomain
         * @param depth {Number} 获取的长度，从最后一级开始取，默认为 2.
         * @param hostname {String} 从指定的 hostname 中获取.
         * @return {String} 取得的指定节数的 hostname.
         */
        pickDocumentDomain: pickDocumentDomain,

        /**
         * 显示一个消息框
		 * @method showMessage
         * @param msg {String} 消息框内容.
		 * @return { Object } 弹出框对象.
         */
        showMessage: function(msg,config) {
            var c = {
                content: msg,
                cancelBtn: false,
                zIndex: 9999
            },
            newConfig = YAHOO.lang.merge(c, config || {});

            return S.sys.snsDialog(newConfig);
        },


        /**
         * 显示一个确认框
		 * @method showConfirm
         * @param msg {String} 消息框内容.
		 * @param callback {Function} 确定执行的动作.
		 * @return { Object } 弹出框对象.
          */
        showConfirm: function(msg,callback,config) {
            var panel;
            var c = {
                content: msg,
                confirmBtn: function(){
                    
                  var result =   callback();
                   if(result!==false) {
                       if(panel)panel.hide();
                   }

                }
            },
            newConfig = L.merge(c, config || {});
        panel = S.sys.snsDialog(newConfig);
            return panel;
        }

    };

    S.sys.Helper = Helper = L.merge(APP_H, FIX_H, FORM_H, URI_H, OTHER_H);

/**
 * 表单组件
 * @author shiran<shiran@taobao.com>
 * @date 2010.07.01
 */

SNS.add('form', function(S) {
    var Y = YAHOO,
    U = Y.util,
    D = U.Dom,
    E = U.Event,
    L=Y.lang,
    doc = document,
    win = window,
    SYS = S.sys,
    APP = S.app,
    Helper = SYS.Helper,
    /**
		 * 设置placeholder（提示）
		 * @method setPlaceHolder
		 * @param el { HTML element | Array }
		 * @require SNS.sys.Helper<../sys/js/sns-helper.js>
		 */
    setPlaceHolder = function(el) {
        var input,
        txt,
        that,
        func,
        isSupport;
        //检验浏览器是否原生支持placeholder
        input = doc.createElement('input');
        isSupport = Boolean('placeholder' in input);
        input = null;

        setPlaceHolder = function(el) {
            if(isSupport) return;

            if(L.isArray(el) || el.length) {
                D.batch(el,arguments.callee);
                return;
            }

            txt = el.getAttribute('placeholder');
            if(KISSY.trim(el.value) == '') {
                el.value = txt;
            }
            //focus
            E.on(el,'focus',function() {
                that = this;
                //重新取placeholder，防止其值有变
                txt = el.getAttribute('placeholder');

                if(that.value == txt) {
                    that.value = '';
                    //ie6字体颜色切换
                    6 == YAHOO.env.ua.ie  && D.addClass(that,'focus') && Helper.doReflow()/*ie6 bug 触发reflow造成页面下部错位问题，所以再次进行触发*/;
                }
            });
            //blur
            E.on(el,'blur',function() {
                that = this;
                //重新取placeholder，防止其值有变
                txt = el.getAttribute('placeholder');
                if(KISSY.trim(that.value) == '') {
                    that.value = txt;
                    //ie6字体颜色切换
                    6 == YAHOO.env.ua.ie  && D.removeClass(that,'focus') && Helper.doReflow()/*ie6 bug 触发reflow造成页面下部错位问题，所以再次进行触发*/;
                }
            });
        }
        //执行
        setPlaceHolder(el);
    },
    handle;

    //detail
    handle = {
        setPlaceHolder: setPlaceHolder
    }
    return (SYS.form = handle);

});





   
},"SNS.util.Popup");

