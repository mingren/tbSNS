SNS("SNS.data.Feed",function(){
    var Helper=SNS.sys.Helper, K = KISSY;

    //�����ϵĽӿ�
    var Feed = function(cfg){
        Feed.superclass.constructor.call(this,cfg);
    }
    Feed.DATAS = {
        delFeed:{
            url:Helper.getApiURI("http://jianghu.{serverHost}/admin/home/delete_feed.htm?_input_charset=utf-8"),
            dataType:"json"
        },
        getFeed:{
            url:Helper.getApiURI("http://jianghu.{serverHost}/admin/home/index_feeds.htm?_input_charset=utf-8"),
            dataType:"text"
        },
        getJiwaiFeed:{
            url:Helper.getApiURI("http://t.{serverHost}/weibo/all_weibo_core_list.htm?_input_charset=utf-8"),
            dataType:"text"
        },
        getMyFeed:{
            url:Helper.getApiURI("http://jianghu.{serverHost}/admin/home/front_my_feeds.htm?_input_charset=utf-8"),
            dataType:"text"
        },
        getVFeed:{
            url:Helper.getApiURI("http://jianghu.{serverHost}/admin/home/v_front_my_feeds.htm?_input_charset=utf-8"),
            dataType:"text"
        },

        delJiwaiFeed:{
            url:Helper.getApiURI("http://t.{serverHost}/weibo/delete_weibo.htm?_input_charset=utf-8"),
            dataType:"json"
        },
        filterFeed:{
            url:Helper.getApiURI("http://jianghu.{serverHost}/admin/home/forbidden_friend_feed.htm?_input_charset=utf-8"),
            dataType:"json"
        },
        moreShare:{
             url:Helper.getApiURI("http://fx.{serverHost}/ajax/look_user_share.htm"),
             dataType:"json"
        }



    }
    SNS.Base.extend(Feed, SNS.Base,{
        // ����feeds
        getFeeds: function(parms,callback) {

            YAHOO.util.Connect.asyncRequest('POST',Helper.getApiURI(this.cfg.getFeedURL), callback, K.param(parms));
        }
    });

    SNS.data.Feed = Feed;

},"SNS.Base,SNS.util.Helper")