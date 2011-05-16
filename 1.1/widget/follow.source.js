/*
 * 达人模块
 * @author zq
 * @date 2010.3.20
 */

SNS("SNS.widget.Follow", function() {

    var Util = YAHOO.util, Dom = Util.Dom, Event = Util.Event, Lang = YAHOO.lang,Helper = SNS.sys.Helper;
    /*
     * 达人应用交互
     * @class Daren
     * @parms {Object} config 配置
     */


    var Daren = function(config) {
        /*
         * 默认配置
         * @parms {Object} config
         * @property {String} followUrl 关注达人的url
         * @property {String} cancelFollowUrl 删除关注的url
         * @property {String} recommendUrl 推荐达人的url
         * @property {String} checkFriendsUrl 获取好友列表的url
         * @property {String} maybeFriendsUrl 获取可能认识的人的url
         * @property {String} addFrindsUrl 批量添加好友的url
         * @property {Object} parms options 公用请求参数 e.g.{userId:123123}
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
            //初始化判断登录
            /*  if (!Helper.checkAndShowLogin({
             autoCallback:true
             })) {
             return;
             }
             */
        },
        /*
         * 关注达人
         * @method follow
         * @parms {Object} config 关注达人配置
         */

        add:function(config) {
            /*
             * 合并配置
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
                                '<span>验证码：</span>' +
                                '<input type="text" maxlength="4" id="J_FollowCheckCode" class="f-txt" style="width:50px"/>' +
                                '<img id="J_FollowCheckCodeImg" style="vertical-align:middle" width="100" src="' + SNS.sys.Helper.getApiURI(data.url) + '"/>' +
                                '(不区分大小写) &nbsp;' +
                                '<a href="#" id="J_FollowCheckCodeChange">换一张</a>' +
                                '</p>'
                        var checkCode,change,img;
                        var checkpanel = SNS.sys.snsDialog({
                            width:"410px",
                            className:"checkCode",
                            title:"请输入验证码:",
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


            //发送请求
            //new SNS.sys.BasicDataSource(newConfig).jsonp();
            SNS.request(url, cfg);

        },


        /*
         * 删除关注
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
                        p = Helper.showMessage("操作失败");
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
                            p = Helper.showMessage("取消关注成功");
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


            //发送请求
            //new SNS.sys.BasicDataSource(newConfig).jsonp();
            SNS.request(url, cfg);

        },





        recommendAction:function(config) {
            /*
             * 参数
             * @parms {Object} config
             * @porperty {String} url 新url
             * @porperty {String} handle 触发事件的node
             */

            var newConfig = {
                url:Helper.getApiURI(this.config.recommendUrl),
                handle:"",//
                parms:{
                    starName:"",
                    starId:""
                }
            }
            //推荐达人回调
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
                title:'推荐' + newConfig.parms.starName + '给好友',
                pos:[0,0],
                haveCheckAll:true,
                haveBtn:true,
                runnow:true,
                inputType:'checkbox',
                url:SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/spell_search_json.htm?filterId=' + newConfig.parms.starId),//json url参数
                func:function(para) {
                    newConfig.parms.fId = para;
                    new SNS.sys.BasicDataSource(newConfig).jsonp();

                }
            })
        },


        addBlackList:function(params, callback, url) {
            var self = this;
            var panel = Helper.showConfirm("是否将该用户移入黑名单？", function() {
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
            var panel = Helper.showConfirm("是否将他从黑名单中去除？", function() {
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

