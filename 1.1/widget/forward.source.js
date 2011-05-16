/*
 * ߴ��ת��
 * ���� new SNS.widget.MicroblogForward({�����б�})
 * @author bofei
 * @date 2010.12.20
 */

SNS("SNS.widget.Forward",function() {



    var  Helper = SNS.sys.Helper,  K=KISSY, D=K.DOM, E = K.Event;

    /*
     * @class  ߴ��ת��
     */
    var Forward = function(cfg) {
        //��Ҫ������̨�Ĳ���
        this.cfg = {
            param:{},
            paramCmt:{},
            paramFwd:{},
            maxlength: '140',
            txt: '˳��˵��ʲô��...',
            tplURL: 'http://t.{serverHost}/weibo/ajax/forward.htm?_input_charset=utf-8',
            fowardURL: 'http://t.{serverHost}/weibo/addWeiboResult.htm?event_submit_do_publish_weibo=1&action=weibo/weiboAction',
            postMBCommentURL: 'http://comment.jianghu.{serverHost}/json/publish_comment.htm?action=comment/commentAction&event_submit_do_publish_comment_batch=true',
            //ת���ɹ��Ƿ�Ҫˢ��ҳ��
            refresh: false
        };
        this._cfg(cfg);
    }
    Forward.prototype = {

        /*
         * @constructs
         */
        init: function(cfg) {

            this._setup();


        },
        _cfg: function(cfg) {
            this.cfg = K.merge(this.cfg, cfg || {});
        },
        // ���ò��� ����������
        _setup: function() {
            // ����¼״̬��û��¼ֱ����ʾ��¼��
            if (!Helper.checkAndShowLogin({
                callback: function() {

                }
            })) {
                // ���� IE6 ���ı����п����޷���ȡ����� bug

                return;
            }
            var self=this;
            var popup=function(html){

                self.panel = SNS.sys.snsCenterPanel(html, {
                    width: '398px',
                    hideHandleTop: '10px',
                    hideHandleRight: '10px',
                    fixed: false
                });



                // ��ʼ����������
                new SNS.widget.MicroSuggest({
                    root: self.panel.content,
                    
                    autoHeight:false,
                    callback: function() {
                        self.showNum();
                    }
                });
                // ����textarea�ĳ���
                Helper.addMaxLenSupport(self.panel.content, 140, 'f-txt');

                self.recoverTxt();//����Ĭ���İ�
               
                self._on();
            
                 self.showNum();

            }


            SNS.request(Helper.getApiURI(self.cfg.tplURL),{
                data:self.cfg.param,
                dataType:"json",
                success:function(data){
                    if(data.status=="0"){
                      
                        popup(data.result.html);
                        self.cfg.paramFwd=data.result.param;
                        self.cfg.paramCmt=data.result.paramCmt;
           

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
                    else Helper.showMessage(data.msg);
                }
            })

        },


        // ����¼�
        _on: function() {
            var self = this, content = self.panel.content,
            num = D.get('.num-value',content),
            textarea = D.get('.f-txt',  content),

            cancle = D.get('.cancle', content),
            confirm = D.get('.confirm', content),
            face = D.get('.icon-insert-face',content),
            value = textarea.value;

            Helper.fixCursorPosition(textarea);
            SNS.sys.form.setPlaceHolder(textarea);
            textarea.style.overflow = 'hidden';

            if (D.attr(textarea,"placeholder")==value) {
                textarea.value="";
                textarea.focus();
            }
            else {
                //���ǰ�����ַ�Ϊ // ��λ����һ��, ���������
                if(0 === K.trim(value).indexOf('//')) {
                    this.setCaretPosition(textarea, 0);
                }
                textarea.focus();
            }


            E.on(textarea, 'keyup', function() {
                self.showNum();

            });

            E.on(cancle, 'click', function(e) {
                e.preventDefault();
                self.panel.hide();
            },this, true);

            E.on(confirm, 'click', function(e) {
                e.preventDefault();
                this.clearTxt();
                self.forwardEvent();
            },this, true);

            //��ӱ����¼�
            SNS.widget.faceSelector.init({
                elTrigger:face,
                container:content,
                insertBefore:function(){
                    if (textarea.value.length >= 140)return false;

                },
                insertAfter:function(){
                    self.clearTxt();
                    var n = 140 - textarea.value.length;
                    if (n < 0)n = 0;
                    num.innerHTML = n;

                }
            });


        },
        clearTxt: function() {
            var self = this, content = self.panel.content,
            textarea = D.get('.f-txt',content);
            if (textarea.value == this.cfg.txt) {
                textarea.value = '';
            }
        },
        showNum: function() {
            var self = this, content = self.panel.content,
            num = D.get('.num-value', content),

            textarea = D.get('.f-txt', content);
          
            var n = 140 - textarea.value.length;
            if (n < 0)n = 0;
         
            num.innerHTML = n;
           
        },
        recoverTxt: function() {
            var self = this, content = self.panel.content,
            textarea = D.get('.f-txt', content);
            if (K.trim(textarea.value) == '') {
                textarea.value = this.cfg.txt;
            }
        },
        //���ù��λ�ú���
        setCaretPosition: function(ctrl, pos) {
            setTimeout(function() {
                if (ctrl.setSelectionRange)
                {
                    ctrl.focus();
                    ctrl.setSelectionRange(pos, pos);
                }
                else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
                ctrl.focus();
            }, 50);
        },


        forwardEvent: function() {
            // ����¼״̬��û��¼ֱ����ʾ��¼��
            if (!Helper.checkAndShowLogin({
                callback: function() {

                }
            })) {
                // ���� IE6 ���ı����п����޷���ȡ����� bug

                return;
            }


            var self = this, content = self.panel.content,
            num =D.get('.num-value'.content),
            textarea = D.get('.f-txt', content),
            sendmsg =D.get('.sendmsg', content),
            osendmsg = D.get('.osendmsg',  content),

            param= K.mix(this.cfg.paramFwd,{
                content:textarea.value
            }),
            paramCmt = K.mix(this.cfg.paramCmt, {
                batch:0,
                content:textarea.value
            });

            //ת��ת����
            if (sendmsg.checked&&osendmsg&&osendmsg.checked)paramCmt.batch = '2';
            if (!sendmsg.checked&&osendmsg&&osendmsg.checked)paramCmt.batch = '1';



            var successPanel = function(msg) {
                var html = '<div>ת���ɹ�.</div>'
                /*new SNS.sys.Popup({
                    title: 'С��ʾ',
                    content: html,
                    onShow: function() {
                        var that = this;
                        setTimeout(function() {
                           // that.hide();
                        }, 4000);
                    }
                });
                */
                var panel =SNS.sys.snsDialog({
                    content:html,
                    cancelBtn:false
                })

                setTimeout(function() {

                    panel.hide();
                }, 2000);

            }
            var failurePanel = function(msg) {
                SNS.sys.snsDialog({
                    content:msg
                })

             
            //var panel=Helper.showMessage(msg);

            }

            var success = function(data) {
                if (data.status == 1) {
                    self.panel.hide();
                    if ((sendmsg && sendmsg.checked) || (osendmsg && osendmsg.checked)) {
                        self.comment(paramCmt, successPanel);
                    } else successPanel();
                }
                else if (data.status == 2) {
                    failurePanel(data.msg);
                }
                else {
                    if (!Helper.checkAndShowLogin()) {
                        return;
                    }
                }
            }

            this.forward(param, success);

        },
        forward:function(param,success){
            param =K.mix(this.cfg.paramFwd, param||{});
            new SNS.sys.BasicDataSource({
                url: Helper.getApiURI(this.cfg.fowardURL),
                parms: param,
                success: success
            }).iframeProxy();
           

        /* SNS.request(Helper.getApiURI(this.cfg.fowardURL), {
               data:param,
               success: success
           })
           */
        },


        comment:function(param, success){
            var self=this;
            var commentCallback = function(data) {
                if (!data.msg)data.msg = '';
                if (data && data.status && data.status == 12) {

                    var content = '<div class="sns-nf">' +
                    '<span>��֤�룺</span>' +
                    '<input type="text" maxlength="4" id="J_FollowCheckCode" class="f-txt" style="width:50px"/>' +
                    '<img id="J_FollowCheckCodeImg" style="vertical-align:middle" width="100" src="' + SNS.sys.Helper.getApiURI(data.result.checkCodeUrl) + '"/>' +
                    '(�����ִ�Сд) &nbsp;' +
                    '<a href="#" id="J_FollowCheckCodeChange">��һ��</a>' +
                    '</div>';
                    var checkCode, change, img;
                    var checkpanel = SNS.sys.snsDialog({
                        width: '410px',
                        className: 'checkCode',
                        title: '������������֤��:',
                        content: content,
                        confirmBtn: function() {
                            var checkCode = D.get('#J_FollowCheckCode');
                            var msg = D.get('#J_FollowCheckCodeMsg');
                            var newQueryParam = param;
                            newQueryParam['TPL_checkcode'] = checkCode.value;
                            self.comment(newQueryParam, success);
                            checkpanel.hide();
                        }
                    });

                    checkCode = D.get('#J_FollowCheckCode');
                    change = D.get('#J_FollowCheckCodeChange');
                    img = D.get('#J_FollowCheckCodeImg');
                    E.on(change, 'click', function(e) {
                        e.halt();
                        img.src = SNS.sys.Helper.getApiURI(data.result.checkCodeUrl);
                    });

                }
                else {
                    if(success)success();
                }

            }

            var cmt= new SNS.data.Comment()
            cmt.loadData("postCmt",commentCallback, param);
        }

    };

    SNS.widget.Forward = Forward;

},"SNS.util.Helper,SNS.util.Popup,SNS.util.Ajax");
