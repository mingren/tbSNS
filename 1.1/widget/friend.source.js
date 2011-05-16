/**
 *  @description 好友组件 包括加好友和共同好友功能
 *  @author 鸣人(mingren@taobao.com)
 *  @date 2011.04.06
 *
 *	依赖于 sns.js 和 kissy 1.1.6
 *
 */

SNS('SNS.widget.Friend', function() {

    var	K = KISSY, D = K.DOM, E = K.Event;

	(function(){

	/*
	 *	【加好友】
	 *
	 *
	 *	调用方式：
	 *
	 *	 SNS(function(){
	 *	 
	 *		SNS.widget.Friend.addFriend( {
	 *			userId : userId,
	 *			callback : function(){
	 *				console.log( "your code here" );
	 *			},
	 *			isFork : 0,
	 *			msgId : 123
	 *		);
	 *	 
	 *	 },"SNS.widget.Friend");
	 *
	 *	参数：
	 *	param					传给后台的参数，各业务可自己定义
	 *	{	
	 *		friendId			对方id
	 *		isFork				为特殊流程标记
	 *		msgId				用于消息中心中的加好友传递msgid
	 *	}
	 *
	 *	 callback		发送申请后的回调函数
	 *
	 */

	var addFriend = function( param , callback ){		/* 参数 { param = {} , callback = function(){} */ 

		var popup,		//弹出层对象
			popupEl;	//弹出层DOM

		/*
		 *	初始化入口
		 */

		var init = function(){

			if( SNS.widget.showLogin( arguments.callee ) == 0 ){
			
				return;
			
			}

			//统计
			D.create('<img src="http://www.atpanel.com/jsclick?cache='+ Math.ceil( Math.random()*Math.pow(10,7) ) +'&profriend=add" alt=" " />');

			K.getScript( SNS.sys.Helper.getApiURI('http://assets.{serverHost}/p/sns/1.1/widget/css/add-friends.css'), function(){}, 'GBK');

			//请求数据,弹出申请浮层
			K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/inviteSetting.htm'), param,	function(data){

					setTimeout(function(){

					if(data.auth == false){
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


					K.use("overlay",function(){
						popup = new K.Overlay({
							width: 430,
							elCls: "add-friend-popup",
							content:data.html,
							mask:true,
							align: {
								node: null, 
								points: ['cc','cc'],
								offset: [0, 0] 
							}
						});

						popup.show();

						//浮层DOM，流程内所有浮层公用
						popupEl = popup.get("contentEl").getDOMNode();

						_bindEvent();
					});

					},100);

				}
			);
			
		};



		/* 
		 *	事件代理
		 *	加好友流程中各步骤、功能
		 */

		var _bindEvent = function(){

			E.on( popupEl, "click", function(e){

				//回答问题申请好友浮层
				if( D.hasClass(e.target, "J_Request1") ){

					var reqParam = eval('(' + D.attr( e.target, "data-param") + ')');

					e.preventDefault();

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/applyFriend.htm'),
						K.mix( reqParam, {
							type : 0,//兼容老接口
							groupId : 1,//兼容老接口
							question : encodeURIComponent(encodeURIComponent(D.get(".J_Question").value)),
							answer : encodeURIComponent(encodeURIComponent(D.get(".J_Answer", popupEl).value))
						}),
						function(data){
							popup.set("content",data.html);
							
							if( (data.success == 1) && callback )
								callback();
						}
					);

				}
				
				//填好友验证信息申请好友浮层
				else if( D.hasClass(e.target, "J_Request2") ){

					var reqParam = eval('(' + D.attr( e.target, "data-param") + ')');

					e.preventDefault();

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/applyFriend.htm'),
						K.mix( reqParam , {
							type : 0,//兼容老接口
							groupId : 1,//兼容老接口
							message : encodeURIComponent(encodeURIComponent(D.get(".J_ReqTxt", popupEl).value))
						} ),
						function(data){
							popup.set("content",data.html);

							if( (data.success == 1) && callback )
								callback();
						}
					);

				}

				//共同好友
				else if( D.hasClass(e.target, "J_CommonFriend") ){

					e.preventDefault();

					SNS.widget.Friend.showCommonFriends( D.attr( e.target , "data-userId" ) , e.target );

				}

				//可能认识的人 加好友
				else if( D.hasClass(e.target, "J_AddFriend") ){

					e.preventDefault();
					
					popup.hide();

					SNS.widget.Friend.addFriend( { friendId: D.attr( e.target , "data-userid" ) , isFork: 1 } , function(){} );

				}

				//推荐自己的好友给对方
				else if( D.hasClass(e.target, "J_Recommend") ){

					e.preventDefault();
					
					var checkboxs = D.query("#J_UserList input");

					var ids = "";

					for( var i in checkboxs ){
						if( checkboxs[i].checked == true )
							ids = ids + "," + checkboxs[i].value;
					}

					ids = ids.substr(1);

					//判断未勾选点推荐时直接关闭浮层
					if( ids == "" ){
						popup.hide();
					}

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/commendMyFriend.htm'),
						{
							toUserId:D.attr(e.target,"data-userid"),
							recommendIds:ids
						},
						function(data){
							popup.set("content",data.html);
						}
					);
				}

				//提交验证码
				else if( D.hasClass(e.target, "J_SendCheckCode") ){

					e.preventDefault();

					var param = eval('(' + D.attr( e.target, "data-param") + ')');

					K.mix( param, {
					
						'TPL_checkcode':D.get(".J_CheckCode").value

					} );

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/applyFriend.htm'), param, function(data){
							popup.set( "content" , data.html );
						}
					);
				}

				//换一换 验证码
				else if( D.hasClass(e.target, "J_CheckCodeChange") ){
					e.preventDefault();
					e.halt();
					img = D.get('#J_CheckCodeImg');
					img.src = img.src + "&t=" + new Date().getTime();
				}

				//关闭按钮
				else if( D.hasClass(e.target, "J_Close") ){
					e.preventDefault();
					popup.hide();
				}
			});
		};

		/*
		 *	调用初始化函数
		 */

		init();

	}

	SNS.namespace("SNS.widget.Friend").addFriend = addFriend;


	})();




	/*************************************************************************************/


	(function(){



	/*
	 *	【共同好友】
	 *
	 *
	 *	调用方式：
	 *
	 *	 SNS(function(){
	 *	 
	 *		SNS.widget.Friend.showCommonFriends( userId );
	 *	 
	 *	 },"SNS.widget.Friend");
	 *
	 *	参数：
	 *		
	 *	userId	对方id
	 *
	 */



	/*
	 *	加载共同好友数据
	 */
	var loadCommonFriends = function( id , callback ) {
	
		K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.daily.taobao.net/recommend/common_friends.htm?userId='+id),function(data){
		
			callback(data);

		});

	}


	/*
	 *	共同好友弹层widget
	 */
	var showCommonFriends = function( id , triggerEl , align ) {

		//统计
		D.create('<img src="http://www.atpanel.com/jsclick?cache='+ Math.ceil( Math.random()*Math.pow(10,7) ) +'&profriend=add" alt=" " />');

		//浮层
		var popup;

		/* 模板拼接 */
		var combineTemp = function( data ){

			var listTemp = '<a href="{href}" class="pic" title="{name}"><img width="40" height="40" src="{img}"></a>';

			var list = "";

			//列表拼接
			for( var i = 0 ; i<data.list.length; i++ ){

				list = list + K.substitute( listTemp , data.list[i] );

			}

			//弹层content拼接
			var temp = '<div class="friends-list">'+
							list+
						'</div>';

			var content = K.substitute(
						'<div class="hd naked"><h3>你们有&nbsp;{num}个共同好友.&nbsp;'+
							( (data.num > 7) ? '<a href="{friendsHref}">查看更多</a>' : '' )+
						'</p></div><div class="bd">' +
							temp+
						'</div><div class="ft"><a href="#" title="关闭此窗口" class="btn-close J_Close">x</a></div>',data);

			return content;

		};


		/* 渲染弹层 */
		var render = function( data ){

			var content = combineTemp( data );

			if( !align ){
				var align = {
						node:triggerEl,
						points:['tc', 'bc'],
						offset:[0,0]
					};
			}

			K.use("overlay",function(){
			
				popup = new K.Overlay({
					width: 236,
					elCls: "common-friends J_CommonFriendsBox",
					content: content,
					zIndex: 10000,
					align:align
				});

				popup.show();
				bindEvent();

			});

		};


		/* 交互效果事件绑定 */
		var bindEvent = function(){

			//鼠标移入弹层时不隐藏弹层
			E.on( popup.get("contentEl").getDOMNode() , "click" , function(e){
			
				if( D.hasClass( e.target, "J_Close" ) ){

					e.preventDefault();
				
					popup.hide();

				}

			});

			//鼠标移出弹层时隐藏弹层
			E.on( document.body , "click" , function(e){
			
				if( !D.contains( popup.get("contentEl").getDOMNode(), e.target ) ){

					e.preventDefault();
				
					popup.hide();
				
				}

			});

		};

		
		
		
		/* 初始化函数 */
		var init = function(){
		
			K.getScript( SNS.sys.Helper.getApiURI('http://assets.{serverHost}/p/sns/1.1/widget/css/common-friends.css'), function(){}, 'GBK');

			//加载共同好友数据
			loadCommonFriends( id , render );

		};


		/*
		 *	入口函数执行
		 */

		init();
	
	}

	/*
	 *	加载共同好友数据
	 */
	SNS.namespace("SNS.widget.Friend").loadCommonFriends = loadCommonFriends;


	/*
	 *	共同好友弹层widget
	 */
	SNS.namespace("SNS.widget.Friend").showCommonFriends = showCommonFriends;


	})();


},"SNS.util.Helper,SNS.widget.showLogin");





