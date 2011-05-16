/*
 * ����ģ��
 * @author zq
 * @date 2010.3.20
 */

SNS("SNS.widget.Follow", function() {

    var Util = YAHOO.util, Dom = Util.Dom, Event = Util.Event, Lang = YAHOO.lang,Helper = SNS.sys.Helper;
    /*
     * ����Ӧ�ý���
     * @class Daren
     * @parms {Object} config ����
     */


    var Daren = function(config) {
        /*
         * Ĭ������
         * @parms {Object} config
         * @property {String} followUrl ��ע���˵�url
         * @property {String} cancelFollowUrl ɾ����ע��url
         * @property {String} recommendUrl �Ƽ����˵�url
         * @property {String} checkFriendsUrl ��ȡ�����б��url
         * @property {String} maybeFriendsUrl ��ȡ������ʶ���˵�url
         * @property {String} addFrindsUrl ������Ӻ��ѵ�url
         * @property {Object} parms options ����������� e.g.{userId:123123}
         */

        var defaultConfig = {
            followUrl:"http://jianghu.{serverHost}/admin/star/follow_star.htm?tracelog=dr001",
            cancelFollowUrl:"http://jianghu.{serverHost}/admin/star/cancelFollow.htm",
            recommendUrl:"http://jianghu.{serverHost}/admin/json/recommendStar.htm?tracelog=dr004",
            checkFriendsUrl:"http://jianghu.{serverHost}/json/spell_search_json.htm",
            maybeFriendsUrl:"http://jianghu.{serverHost}/admin/recommend/friendMaybeBox.htm?size=14",
            addFriendsUrl:"http://jianghu.{serverHost}/admin/json/addFriends.htm",
            addBlackListUrl:"http://jianghu.{serverHost}/admin/json/add_to_my_black_list.htm",
            removeBlackListUrl:"http://jianghu.{serverHost}/admin/json/remove_off_my_black_list.htm"
        }

        this.config = YAHOO.lang.merge(defaultConfig, config || {});
        this.init();
    }
    Daren.prototype = {
        init:function() {
            //��ʼ���жϵ�¼
            /*  if (!Helper.checkAndShowLogin({
             autoCallback:true
             })) {
             return;
             }
             */
        },
        /*
         * ��ע����
         * @method follow
         * @parms {Object} config ��ע��������
         */

        add:function(config) {
            /*
             * �ϲ�����
             * @Object newConfig
             * @property url
             */
            if (!Helper.checkAndShowLogin({
                callback: function() {
                    location.replace(location);
                }
            })) {
                return;
            }

            var newConfig = {
                url:Helper.getApiURI(this.config.followUrl),
                parms:{
                    starId:"",
                    starName:""
                }

            }

            newConfig.success = function(data) {

                switch (data.status) {

                    case -1:
                        var p = Helper.showMessage(data.msg);
                        p.onHide = function() {
                            if (newConfig.onFailure)newConfig.onFailure(data);
                        }
                        setTimeout(function() {
                            if (p) p.hide();

                        }, 4000);
                        break;
                    case 0:
                        var content = '<p class="sns-nf">' +
                                '<span>��֤�룺</span>' +
                                '<input type="text" maxlength="4" id="J_FollowCheckCode" class="f-txt" style="width:50px"/>' +
                                '<img id="J_FollowCheckCodeImg" style="vertical-align:middle" width="100" src="' + SNS.sys.Helper.getApiURI(data.url) + '"/>' +
                                '(�����ִ�Сд) &nbsp;' +
                                '<a href="#" id="J_FollowCheckCodeChange">��һ��</a>' +
                                '</p>'
                        var checkCode,change,img;
                        var checkpanel = SNS.sys.snsDialog({
                            width:"410px",
                            className:"checkCode",
                            title:"��������֤��:",
                            content:content,
                            confirmBtn:function() {
                                var checkCode = Dom.get("J_FollowCheckCode");

                                newConfig.parms["TPL_checkcode"] = checkCode.value;

                                SNS.widget.Follow.add(newConfig);
                                checkpanel.hide();
                            }

                        });
                        checkCode = Dom.get("J_FollowCheckCode");
                        change = Dom.get("J_FollowCheckCodeChange");
                        img = Dom.get("J_FollowCheckCodeImg");

                        Event.on(change, "click", function(e) {
                            Event.stopEvent(e);
                            img.src = SNS.sys.Helper.getApiURI(data.url);
                        })
                        break;

                    case 1:

                        if (newConfig.replaceSuccess) {
                            newConfig.replaceSuccess(data);
                        } else {
                            var p = Helper.showMessage(data.msg);
                            p.onHide = function() {
                                if (newConfig.onSuccess)newConfig.onSuccess(data);
                            }
                            setTimeout(function() {
                                if (p)p.hide();

                            }, 4000)
                        }
                        break;
                    case 2:
                        if (newConfig.replaceSuccess) {
                            newConfig.replaceSuccess(data);
                        } else if (newConfig.onSuccess) {
                            newConfig.onSuccess(data);
                        }
                        new SNS.widget.AddFriend({
                            friendId:newConfig.parms.starId,
                            friendNick:newConfig.parms.starName
                        })
                        break;
                }
            }
            newConfig = YAHOO.lang.merge(newConfig, config || {});
            var cfg = {
                data: newConfig.parms ,
                dataType: "json" ,
                success :   newConfig.success
            }

            var url =    newConfig.url;


            //��������
            //new SNS.sys.BasicDataSource(newConfig).jsonp();
            SNS.request(url, cfg);

        },


        /*
         * ɾ����ע
         * @method cancelFollow
         * @parms {Object} config
         */
        cancel:function(config) {
            if (!Helper.checkAndShowLogin({
                autoCallback:true
            })) {
                return;
            }

            var newConfig = {
                url:Helper.getApiURI(this.config.cancelFollowUrl),
                starId:""
            }
            newConfig.success = function(data) {
                var p;
                switch (data.message) {
                    case "false":
                        p = Helper.showMessage("����ʧ��");
                        p.onHide = function() {
                            if (newConfig.onFailure)newConfig.onFailure(data);
                        }
                        setTimeout(function() {
                            if (p)p.hide();


                        }, 2000);
                        break;
                    case "true":
                        if (newConfig.replaceSuccess) {
                            newConfig.replaceSuccess(data);
                        } else {
                            p = Helper.showMessage("ȡ����ע�ɹ�");
                            p.onHide = function() {
                                if (newConfig.onSuccess)newConfig.onSuccess(data);
                            }
                            setTimeout(function() {
                                if (p) p.hide();

                            }, 2000);
                            // new SNS.app.RecommendDaren();
                        }
                        break;
                }
            }
            newConfig = YAHOO.lang.merge(newConfig, config || {});
             var cfg = {
                data: {starId:newConfig.starId} ,
                dataType: "json" ,
                success :   newConfig.success
            }

            var url =    newConfig.url;


            //��������
            //new SNS.sys.BasicDataSource(newConfig).jsonp();
            SNS.request(url, cfg);

        },





        recommendAction:function(config) {
            /*
             * ����
             * @parms {Object} config
             * @porperty {String} url ��url
             * @porperty {String} handle �����¼���node
             */

            var newConfig = {
                url:Helper.getApiURI(this.config.recommendUrl),
                handle:"",//
                parms:{
                    starName:"",
                    starId:""
                }
            }
            //�Ƽ����˻ص�
            newConfig.success = function(data) {

                switch (data.type) {
                    case "true":
                        var p = Helper.showMessage(data.message);

                        setTimeout(function() {
                            if (p)  p.hide();

                        }, 2000);
                        break;
                    case "false":

                        p = Helper.showMessage(data.message);
                        setTimeout(function() {
                            if (p) p.hide();

                        }, 2000);
                        break;
                }
            }

            newConfig = YAHOO.lang.merge(newConfig, config);

            SNS.friendSuggest.decorate(Dom.get(newConfig.handle), {
                type:'pop',
                title:'�Ƽ�' + newConfig.parms.starName + '������',
                pos:[0,0],
                haveCheckAll:true,
                haveBtn:true,
                runnow:true,
                inputType:'checkbox',
                url:SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/spell_search_json.htm?filterId=' + newConfig.parms.starId),//json url����
                func:function(para) {
                    newConfig.parms.fId = para;
                    new SNS.sys.BasicDataSource(newConfig).jsonp();

                }
            })
        },


        addBlackList:function(params, callback, url) {
            var self = this;
            var panel = Helper.showConfirm("�Ƿ񽫸��û������������", function() {
                var f = callback.success;

                callback.success = function(res) {
                    f(res, panel);
                    panel.hide();

                }
               // YAHOO.util.Connect.asyncRequest("POST", url ? url : Helper.getApiURI(self.config.addBlackListUrl), callback, "blackuserid=" + params.blackuserid)
               SNS.request(url ? url : Helper.getApiURI(self.config.addBlackListUrl), {
                   data:{
                       blackuserid:params.blackuserid
                   },
                   success:callback.success
               })

             
            })

        },
        removeBlackList:function(params, callback, url) {
            var self = this;
            var panel = Helper.showConfirm("�Ƿ����Ӻ�������ȥ����", function() {
                var f = callback.success
                callback.success = function(res) {
                    f(res, panel);
                    panel.hide();
                }


              //  YAHOO.util.Connect.asyncRequest("POST", url ? url : Helper.getApiURI(self.config.removeBlackListUrl), callback, "blackuserid=" + params.blackuserid)
              SNS.request(url ? url : Helper.getApiURI(self.config.removeBlackListUrl), {
                   data:{
                       blackuserid:params.blackuserid
                   },
                   success:callback.success
               })
            })
        }
    }
    SNS.widget.Follow = new Daren();
},"SNS.util.Helper,SNS.util.Ajax");

