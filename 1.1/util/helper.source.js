/**
 * ����������<br>
 * <font color=red>Ŀǰ Helper ��߷����Ѿ�����̫���ˣ� ����Ŀ��ܻ����ϲ���ô�õ��� �����ĳЩ widget �Ƚϳ��õģ������Ƴ�����Ӧ�� widget�� ����ʱ�� Helper �ֳɼ����ࣺAPP_H��FIX_H��FIX_H��FORM_H��OTHER_H��URI_H�� by shiran 2010.09.26</font>
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

    //���ܺ�������Ĭ�ϸ�ֵ����ֹһЩ������ɾ����L.merge ����
    APP_H = {},
    FIX_H = {},
    FORM_H = {},
    OTHER_H = {},
    URI_H = {},

    /**
		 * �������߿�����ò���
		 */
    config = {
        apiToken: 'comment:/json/token.htm'
    },

    /**
		 * ע��� API ��������ַ����ʽΪ ���������� : ��ַ�����磺
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

    // �Զ��жϵ�ǰ������ host
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

    //��ҵ�������صĺ���
    APP_H = {
        /**
		 * ����Ƿ����
		 * @return {Boolean} true ��ʾ�Ǵ���ҳ��.
		 */
        checkDaren: function() {
            return Boolean(D.get('J_darenStyle'));
        },

        /**
         * ����û��Ƿ��¼
		 * @method checkLogin
         * @return {Boolean} true ��ʾ�û��Ѿ���¼.
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

            //�Ա������ж�
            if (location.href.indexOf('taobao') == -1) {
                return true;
            }

            // �û��ǳƣ�Session����Ч
            var nick = getCookie('_nk_');

            // �û��Ƿ��Ѿ���¼��ע�⣺����ͬʱ�ж�nickֵ����Ϊ _nk_ �� _l_g_ ��ʱ��ͬ��
            // _l_g �޸�Ϊ cookie15����ʱ����һ�� by ��Ȼ 2010.11.19
            var isLogin = ((getCookie('_l_g_') || getCookie('uc1')['cookie15']) && nick) || getCookie('ck1')/*����¼*/;

            return !!isLogin;
			
        },

        /**
         * ����¼״̬�����û�е�¼����ʾ��¼��
		 * @method checkAndShowLogin
         * @param cfg {Object} ����.
         * @param cfg.autoCallback {Boolean} �Ƿ��ڵ�¼��ɺ��Զ����лص�.
         * @return {Boolean} true ��ʾ�û��Ѿ���¼.
         */
        checkAndShowLogin: function(cfg) {
            var that = this;
            if (that.checkLogin()) {
                return true;
            }

            cfg = cfg || {};

            var callback = null;

            //ִ�лص����� by shiran 100401
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
              
            // ҳ�������� UserCheck ʱʹ�� Ajax �����û���¼������ֱ����ת����¼ҳ
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
		 * ��ȡ��֤�벢ִ�лص�
		 * @method getCheckCodeURI
		 * @param successCallback { Function } �ص�����.
		 * @param params { Object } ������json ��ʽ.
		 * @param serverType { String } server ���ͣ�Ĭ��Ϊ checkCode.
		 * @return { Object } SNS.
		 * @TODO ͳһ��֤��ӿ� 2010.12.31
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
         * ��ȡtoken
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
		 * ����token
		 * @method setToken
		 * @param token { String } token ֵ.
		 * @param callback { Function } �ص�����.
		 * @return { Object } SNS.
		 */
        setToken: function(token,callback) {
            token && setToken(token);
            callback && callback();
            return S;
        }
    };


    //����� bug ����������֧�ֵĹ��ܵĴ���
    FIX_H = {
        /**
         * ��� TextArea ����󳤶ȵ�֧�֣�ʹ�� TextArea �� maxlength ���Խ��п���
         * @method addMaxLenSupport
         * @param elText {HTMLElement} TextArea Ԫ�ض����Ԫ�� ID.
		 * @param max { Number } ��󳤶ȣ���ѡ�����û�У���ȡ textarea �� maxlength ����.
		 * @param className { String } ��Ҫί���¼���Ԫ�� class.
		 * @param fn { Function } ί���¼�.
		 * @return { Object } SNS.
         */
        addMaxLenSupport: function(elContl,max,className,fn) {

            var callback = function() {};
            /**
             * ��ȡ��󳤶�����
             * @param   {HTMLElement}   elText  TextArea Ԫ��.
             */
            var getMaxLength = function(elText) {
                return max || parseInt(elText.getAttribute('maxlength') || '0', 10);
            };

            /**
             * ��������ʱ���ض��ַ���
             */
            var cutStr = function(e) {

                var elText = E.getTarget(e),
                value = elText.value,
                maxLen = getMaxLength(elText);

                if (maxLen > 0 && value.length > maxLen) {
                    elText.value = value.substr(0, maxLen);
                }

            };

            // ճ���¼��������
            var onPaste = function(e) {

                var elText = E.getTarget(e), maxLength = getMaxLength(elText);

                if (elText.value.length === maxLength) {
                    E.preventDefault(e);

                }

            };

            var onKeyDown = function(e) {

                var elText = E.getTarget(e), charCode = E.getCharCode(e),
                maxLength = getMaxLength(elText);

                // maxLength С�� 1 �Լ����� Backspace �� Delete ��ʱ�򲻴���
                // �����������η�ʱ������
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
         * ���� IE �� Reflow (ie6/7)
		 * @method deReflow
         * @param elContl {HTMLElelent} Ҫ���� Reflow ��Ԫ�أ�Ĭ��Ϊ body.
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
         * ���� IE6 ���ı���ʧȥ������ٴβ����ı��ᶪʧ���λ�õ� bug
         * @method fixCursorPosition
         * @param elText {HTMLElement} Ҫ fix ���ı���Ԫ��.
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
                        //����range��һ�����Ѿ�ѡ���text(range)��һ��������textarea(range_all)
                        //range_all.compareEndPoints()�Ƚ������˵㣬���range_all��range������(further to the left)���� //����С��0��ֵ����range_all������һ�㣬ֱ������range��start��ͬ��
                        // calculate selection start point by moving beginning of range_all to beginning of range
                        for (start = 0; range_all.compareEndPoints('StartToStart', range) < 0; start++) {
                            range_all.moveStart('character', 1);
                        }
                        // get number of line breaks from textarea start to selection start and add them to start
                        // ����һ��\n
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
         * �޸� IE6 �·� A ��ǩ��֧�� :hover �� bug
		 * @method fixHover
         * @param deConfig {Object} ����.
         * @param deConfig.elements {Array} Ҫ������Ԫ���б��� container ���Զ�ѡһ.
         * @param deConfig.container {String} Ҫ�������������� elements ���Զ�ѡһ.
         * @param deConfig.tagName {String} Ҫ����Ԫ�صı�ǩ����ʹ�� container ʱʹ��.
         * @param deConfig.itemClass {String} Ҫ����Ԫ�ص�ӵ�е���ʽ����ʹ�� container ʱʹ��.
         * @param deConfig.hoverClass {String} hover ʱ��ӵ�Ԫ�ص���ʽ����.
         * @param deConfig.checkPopuped {Boolean} ���Ԫ���Ƿ�ӵ�� popuped=true ���ԣ�������� onMouseLeave ʱ��ȥ�� hoverClass.
         * @example
		 * <pre>
         * {
         *  elements : "",      // Ԫ���б�
         *  container : "",		// ����
         *  tagName : "",		// Ҫ�� hover ��Ԫ�ر�ǩ
         *  hoverClass : "",	// hover ��class
         *  itemClass : ""		// �ٴι���Ԫ�أ���� tagName ��Ԫ�ز��߱��� class����Ҳ���� hover
         *  checkPopuped : true // ��� popuped ���ԣ������ popuped ���ԣ���ִ�� mouseleave
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
         * �޸� IE6 & IE7 �� TextArea �޷���ȡ����� bug
         * @fixTextAreaFocus
         * @param elText {HTMLElement} Ҫ�������� bug �� TextArea Ԫ��.
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

    //�����ֵ�һЩ���ܺ���
    FORM_H = {
        /**
         * ����ı��� textarea �ĵ�Ȼ���λ��
		 * @method insertText
         * @param elText {HTMLElement} TextArea Ԫ��.
         * @param text {String} Ҫ������ı�.
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
         * �ָ�ʧȥ����ǰ����Ĺ��λ��
         * @method recoverCursorPos
         * @param   {HTMLElement}   elText      �ı���Ԫ��.
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

                    // moveEnd ʱʹ��ƫ�ƣ���Ϊ moveStart ��Ӱ�� end λ��
                    range.moveEnd('character', posInfo[1] * 1 - posInfo[0] * 1);
                    range.select();
                }
            }

            return S;
        }

    };

    //URI �������غ���
    URI_H = {
        /**
         * �� URL ���ʱ���
		 * @method addStamp
         * @param url {String} Ҫ���ʱ����� URL.
         * @return {String} �����ʱ����� URL.
         */
        addStamp: function(url) {
            return this.buildURI(url, 't=' + new Date().getTime());
        },

        /**
         * ƴ�� URI���Զ��жϵ�һ�����Ƿ��� ?����������� & ���ӣ�
         * ������ & ���ӵ�һ���ֺ͵ڶ����֣��������־��� & ����
		 * @method buildURI
         * @param uriPart {String} Ҫƴ�ӵ� URI Ƭ��.
         * @return {String} ƴ�ӵ� URI.
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
         * ��ȡ API �� URI
		 * @method getApiURI
         * @param api {String} API ��ַ.
         * @param noCache {Boolean} �Ƿ�ʹ�û��棬Ĭ��Ϊ true.
         * @param ignoreToken {Boolean} �Ƿ񲻼� Token.
         * @return {String} ��ȡ����ʵ�� API ��ַ.
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
         * ƴ�ӳ� assets ��Դ�� URI
		 * @method getAssetsURI
         * @param path {String} ���·��.
         * @param useCache {Boolean} ʹ�û��棬Ĭ���ǲ�ʹ�û���.
         * @return {String} ƴ�ӵõ��� assets ��Դ URI.
         */
        getAssetsURI: function(path, noCache, isVertical) {
            return this.getApiURI((isVertical ? 'assetsV:' : 'assets:') + path, noCache, true);
        },

        /**
		 * ��ȡ������ URI
		 * @method getServerURI
		 * @param serverName { String } Ӧ����.
		 * @return { String } ��Ӧ��Ӧ�õ�ַ.
		 */
        getServerURI: function(serverName) {
            return apiServers[serverName];
        },

        /**
         * ע�� API �ķ�����
		 * @method regApiServer
         * @param config {Object} API �����������ã��� Э��:��ַ �Ե���ʽ���֣����� { portal : "http://jianghu.taobao.com }.
         * @param overwrite {Boolean} �������е� API ����������.
		 * @return SNS.
         */
        regApiServer: function(config, overwrite) {
            L.augmentObject(apiServers, config, !!overwrite);
            return S;
        }

    };

    //��������
    OTHER_H = {
        /**
         * ���ģ��֧�֣���ע��ģ��ĳ�ʼ������ init �� app ����� init �����У�<font color=red>��ֹͣʹ�ô˷���</font>
         * @method addModuleSupport
         * @param app {Object} app ����.
         * @return {Object} ��ģ����������.
         */
        addModuleSupport: (function() {

            /**
             * ģ������
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
                 * �����ģ�������б�
                 * @private
                 */
                _names: [],

                /**
                 * ��ģ�����ƶ�Ӧ��ģ�����
                 * @private
                 */
                _store: {},

                /**
                 * ���һ��ģ��
             	 * @private
                 * @param  {String}  name  ģ������.
                 * @param  {Object}  obj   ģ�����.
                 */
                add: function(name, obj) {
                    if (name && obj) {
                        this[name] = obj;
                        this._names.push(name);
                        this._store[name] = obj;
                    }
                },

                /**
                 * ��ȡһ��ģ��
             	 * @private
                 * @param   {String}    name    ģ������.
                 * @return  {Object}            ģ��������û���ҵ���Ϊ null.
                 */
                get: function(name) {
                    return this._store[name] || null;
                },

                /**
                 * ��ʼ������ģ��
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
             * �� app �� init ����ע����ģ�鹦�ܳ�ʼ������
             * @inner
             * @memberOf    SNS.sys.Helper.addModulesSupport
             * @param   {Object}    context1    app ����.
             * @param   {Function}  init        app ����� init ����.
             * @param   {Object}    contenxt2   ��ģ�����.
             * @param   {Function}  append      ��ģ��ĳ�ʼ������ initAll.
             * @return  {Function}              ���ɵ��µ� init ����.
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
         * ����һ��ȫ�ֵĻص�����, <font color=red>����ֹͣʹ�ô˷�������</font>
         * @method createCallback
         * @param callback {Function} �ص�����.
         * @return {String} ָ��ص�������ȫ�ֺ�����.
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
         * �ض��ַ�
		 * @method cutStr
         * @param str {String} Ҫ�ضϵ��ַ���.
         * @param len {Number} Ҫ�ضϵĳ���.
		 * @param useEllipsis { Boolean } �Ƿ���ĩβ��������㣬Ĭ��Ϊ true.
         * @return {String} �ضϺ���ַ���.
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
		 * ��ȡԪ�ص��� "data-" ��ͷ���Զ�������
		 * @method getParmsByAttr
		 * @params target { HTMLelement }
		 * @return { Object } ����������ɵ� json ��ʽ���� <li data-id="1" data-name="jolin"></li>������ { id: 1, name: 'jolin' }.
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
         * �������
		 * @method lightww
         * @param container { String|HTMLElement } Ҫ��Ƶ�����Ĭ�� document.
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
         * ��ȡ hostname
         * @method pickDocumentDomain
         * @param depth {Number} ��ȡ�ĳ��ȣ������һ����ʼȡ��Ĭ��Ϊ 2.
         * @param hostname {String} ��ָ���� hostname �л�ȡ.
         * @return {String} ȡ�õ�ָ�������� hostname.
         */
        pickDocumentDomain: pickDocumentDomain,

        /**
         * ��ʾһ����Ϣ��
		 * @method showMessage
         * @param msg {String} ��Ϣ������.
		 * @return { Object } ���������.
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
         * ��ʾһ��ȷ�Ͽ�
		 * @method showConfirm
         * @param msg {String} ��Ϣ������.
		 * @param callback {Function} ȷ��ִ�еĶ���.
		 * @return { Object } ���������.
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
 * �����
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
		 * ����placeholder����ʾ��
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
        //����������Ƿ�ԭ��֧��placeholder
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
                //����ȡplaceholder����ֹ��ֵ�б�
                txt = el.getAttribute('placeholder');

                if(that.value == txt) {
                    that.value = '';
                    //ie6������ɫ�л�
                    6 == YAHOO.env.ua.ie  && D.addClass(that,'focus') && Helper.doReflow()/*ie6 bug ����reflow���ҳ���²���λ���⣬�����ٴν��д���*/;
                }
            });
            //blur
            E.on(el,'blur',function() {
                that = this;
                //����ȡplaceholder����ֹ��ֵ�б�
                txt = el.getAttribute('placeholder');
                if(KISSY.trim(that.value) == '') {
                    that.value = txt;
                    //ie6������ɫ�л�
                    6 == YAHOO.env.ua.ie  && D.removeClass(that,'focus') && Helper.doReflow()/*ie6 bug ����reflow���ҳ���²���λ���⣬�����ٴν��д���*/;
                }
            });
        }
        //ִ��
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

